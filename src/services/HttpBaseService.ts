import { NETWORK_CONFIG } from '@/config/network';
import type { RetryOptions, QueryFilters } from '@/types/api';

/**
 * Universal abstract base class managing transport, retries, and standard CRUD behaviors.
 * T represents the main core entity model, TPayload represents creation/update specifications.
 */
export abstract class HttpBaseService<T, TPayload> {
  protected readonly baseUrl: URL;

  constructor(endpointUrl: string) {
    this.baseUrl = this.validateAndNormalizeUrl(endpointUrl);
  }

  /**
   * Validates, cleans, and normalizes the endpoint URL using native Web APIs.
   */
  private validateAndNormalizeUrl(url: string): URL {
    if (!url || typeof url !== 'string') {
      throw new Error(
        `[${this.constructor.name}] Critical configuration error: Base endpoint URL is missing.`
      );
    }

    // Normalize backslashes from potential typo concatenations
    const sanitizedUrl = url.replace(/\\/g, '/');

    // 1. Enforce strict web URL compliance using native validation (handles missing domains and hostnames)
    if (!URL.canParse(sanitizedUrl)) {
      throw new Error(
        `[${this.constructor.name}] Configuration error: Provided string is not a valid absolute URL.`
      );
    }

    const parsedUrl = new URL(sanitizedUrl);

    // 2. Restrict to secure web communication protocols only
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new Error(
        `[${this.constructor.name}] Security error: Only HTTP and HTTPS protocols are allowed.`
      );
    }

    // 3. Clean up trailing slashes inside the pathname structure to avoid duplicate slash bugs
    if (parsedUrl.pathname.endsWith('/')) {
      parsedUrl.pathname = parsedUrl.pathname.replace(/\/+$/, '');
    }

    return parsedUrl;
  }

  /**
   * Formats, prints, and rethrows processing and runtime transport infrastructure exceptions.
   */
  protected handleError(error: unknown, contextMessage: string): never {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown network failure';
    console.error(`[${this.constructor.name} Error] ${contextMessage}:`, error);
    throw new Error(`${contextMessage}: ${errorMessage}`);
  }

  /**
   * Shared request wrapper to inject default headers and handle HTTP status validation.
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
   * Implements exponential backoff strategy with strict AbortSignal monitoring.
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

        await new Promise((resolve, reject) => {
          const timer = setTimeout(resolve, delay);
          signal?.addEventListener('abort', () => {
            clearTimeout(timer);
            reject(signal.reason || new Error('Aborted'));
          });
        });

        return this.retryNetworkRequest(fn, retries - 1, delay * 1.5, signal);
      }
      throw error;
    }
  }

  /**
   * Pulls structural paginated generic array collections matching filter rules.
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
      // Safely clone the pre-validated URL object to prevent instance mutation
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
   * Pulls a singular specific complete resource configuration by its unique identifier.
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
   * Registers a fresh item into the remote system.
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
   * Overwrites target resource state with fresh complete schema configurations.
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
   * Applies precise local differential field mutations on the server.
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
   * Strips a record permanently from the remote cluster database.
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
