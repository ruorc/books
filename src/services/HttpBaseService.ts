import type { RetryOptions, QueryFilters } from '@/types/api';

/**
 * Global HTTP and Network transport layer configuration parameters.
 * These metrics guard core application API infrastructure connections behavior.
 */
const NETWORK_CONFIG = {
  /** Total number of connection retry attempts for transient network failures */
  DEFAULT_RETRIES: 2,
  /** Initial exponential backoff delay time baseline metric in milliseconds */
  DEFAULT_DELAY: 1000,
} as const;

/**
 * Abstract foundational infrastructure network data transport manager.
 * Orchestrates fetch requests, automates exponential backoff retry pipelines,
 * normalizes server destination path URLs, and isolates global request exception trees.
 */
export abstract class HttpBaseService<T, TPayload> {
  /** Secure validated root Uniform Resource Locator destination tracking node */
  protected readonly baseUrl: URL;

  /**
   * Initializes the operational instance and triggers endpoint layout sanitization.
   */
  constructor(endpointUrl: string) {
    this.baseUrl = this.validateAndNormalizeUrl(endpointUrl);
  }

  /**
   * Internal verification utility assessing absolute address paths consistency.
   * Blocks non-HTTP protocol mutations and trailing slashes to prevent query fragmentation.
   */
  private validateAndNormalizeUrl(url: string): URL {
    if (!url || typeof url !== 'string') {
      throw new Error(
        `[${this.constructor.name}] Critical configuration error: Base endpoint URL is missing.`
      );
    }

    const sanitizedUrl = url.replace(/\\/g, '/');

    if (!URL.canParse(sanitizedUrl)) {
      throw new Error(
        `[${this.constructor.name}] Configuration error: Provided string is not a valid absolute URL.`
      );
    }

    const parsedUrl = new URL(sanitizedUrl);

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new Error(
        `[${this.constructor.name}] Security error: Only HTTP and HTTPS protocols are allowed.`
      );
    }

    if (parsedUrl.pathname.endsWith('/')) {
      parsedUrl.pathname = parsedUrl.pathname.replace(/\/+$/, '');
    }

    return parsedUrl;
  }

  /**
   * Central catch coordinator marshaling raw runtime exceptions into descriptive execution logs.
   */
  protected handleError(error: unknown, contextMessage: string): never {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown network failure';

    console.error(`[${this.constructor.name} Error] ${contextMessage}:`, error);

    throw new Error(`${contextMessage}: ${errorMessage}`, { cause: error });
  }

  /**
   * Atomic transport utility interfacing with the client window native Fetch API.
   * Sets content type boundaries and unpacks structured status payloads safely.
   */
  protected async request<R>(url: string, options?: RequestInit): Promise<R> {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error. Status: ${response.status}`);
    }

    return response.status === 204 ? ({} as R) : await response.json();
  }

  /**
   * Stateful recursive macro-task scheduling automated retry flows.
   * Monitors active AbortSignals to immediately cancel transactions mid-flight.
   */
  protected async retryNetworkRequest<R>(
    fn: () => Promise<R>,
    retries: number,
    delay: number,
    signal?: AbortSignal
  ): Promise<R> {
    try {
      return await fn();
    } catch (error) {
      if (signal?.aborted) throw signal.reason || new Error('Aborted');

      if (error instanceof Error && error.name === 'AbortError') throw error;

      if (retries > 0) {
        console.warn(
          `[${this.constructor.name}] Network failed. Retrying in ${delay}ms... (${retries} attempts left)`
        );

        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(() => {
            signal?.removeEventListener('abort', handleAbort);
            resolve();
          }, delay);

          const handleAbort = () => {
            clearTimeout(timer);
            reject(signal?.reason || new Error('Aborted'));
          };

          signal?.addEventListener('abort', handleAbort);
        });

        return this.retryNetworkRequest(fn, retries - 1, delay * 1.5, signal);
      }

      throw error;
    }
  }

  /**
   * Pulls a structurally paginated collection matching specified filtration query trees.
   * Maps criteria directly to destination query search params dynamically.
   */
  async getAll(
    page: number,
    limit: number,
    filters: QueryFilters<T> = {},
    retryOptions: RetryOptions = {}
  ): Promise<Partial<T>[]> {
    const {
      retries = NETWORK_CONFIG.DEFAULT_RETRIES,
      delay = NETWORK_CONFIG.DEFAULT_DELAY,
      signal,
    } = retryOptions;

    const executeFetch = async () => {
      const url = new URL(this.baseUrl.toString());

      url.searchParams.append('page', String(page));
      url.searchParams.append('limit', String(limit));

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          if (key === 'select' && Array.isArray(value)) {
            url.searchParams.append('select', value.join(','));
          } else if (key !== 'select') {
            url.searchParams.append(key, String(value));
          }
        }
      });

      return this.request<Partial<T>[]>(url.toString(), { signal });
    };

    try {
      return await this.retryNetworkRequest(
        executeFetch,
        retries,
        delay,
        signal
      );
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') throw error;

      this.handleError(error, 'Failed to retrieve the data stream');
    }
  }

  /**
   * Acquires a single targeted complete dataset entity from the server by its key identifier.
   */
  async getById(id: string, retryOptions: RetryOptions = {}): Promise<T> {
    const {
      retries = NETWORK_CONFIG.DEFAULT_RETRIES,
      delay = NETWORK_CONFIG.DEFAULT_DELAY,
      signal,
    } = retryOptions;

    try {
      const targetUrl = `${this.baseUrl.origin}${this.baseUrl.pathname}/${id}`;

      return await this.retryNetworkRequest(
        () => this.request<T>(targetUrl, { signal }),
        retries,
        delay,
        signal
      );
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') throw error;

      this.handleError(error, `Failed to retrieve item by ID ${id}`);
    }
  }

  /**
   * dispatches a network POST request to append a new complete record on the cluster.
   */
  async create(payload: TPayload): Promise<T> {
    try {
      return await this.request<T>(this.baseUrl.toString(), {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (error) {
      this.handleError(error, 'Failed to save a new entry');
    }
  }

  /**
   * Overwrites the complete asset allocation slot state configuration via an HTTP PUT call.
   */
  async update(id: string, updatedData: Partial<TPayload>): Promise<T> {
    try {
      const targetUrl = `${this.baseUrl.origin}${this.baseUrl.pathname}/${id}`;

      return await this.request<T>(targetUrl, {
        method: 'PUT',
        body: JSON.stringify(updatedData),
      });
    } catch (error) {
      this.handleError(error, `Failed to replace data for ID ${id}`);
    }
  }

  /**
   * Injects narrow delta field modifications on the backend entity layout via an HTTP PATCH call.
   */
  async patch(id: string, partialData: Partial<T>): Promise<T> {
    try {
      const targetUrl = `${this.baseUrl.origin}${this.baseUrl.pathname}/${id}`;

      return await this.request<T>(targetUrl, {
        method: 'PATCH',
        body: JSON.stringify(partialData),
      });
    } catch (error) {
      this.handleError(error, `Failed to partially patch ID ${id}`);
    }
  }

  /**
   * Dispatches a terminal HTTP DELETE transaction to remove a record from the database.
   */
  async delete(id: string): Promise<T> {
    try {
      const targetUrl = `${this.baseUrl.origin}${this.baseUrl.pathname}/${id}`;

      return await this.request<T>(targetUrl, {
        method: 'DELETE',
      });
    } catch (error) {
      this.handleError(error, `Failed to delete record for ID ${id}`);
    }
  }
}
