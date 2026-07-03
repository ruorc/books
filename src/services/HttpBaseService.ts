import { NETWORK_CONFIG } from '@/config/network';
import type { RetryOptions, QueryFilters } from '@/types/api';

/**
 * Universal abstract base class managing transport, retries, and standard CRUD behaviors.
 * Implements full compile-time type safety against strict schema mutations.
 *
 * @template T - The primary backend data model entity.
 * @template TPayload - The technical specification schema mapping payload objects for creation/updates.
 */
export abstract class HttpBaseService<T, TPayload> {
  protected readonly baseUrl: URL;

  /**
   * Initializes the base network infrastructure layer.
   * @param endpointUrl - The absolute target server string configuration.
   */
  constructor(endpointUrl: string) {
    this.baseUrl = this.validateAndNormalizeUrl(endpointUrl);
  }

  /**
   * Validates, cleans, and normalizes the endpoint URL using native Web APIs.
   *
   * @param url - The raw configuration string.
   * @returns A fully parsed Web API URL instance.
   * @throws {Error} If the URL parameter breaks structural or security constraints.
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
   * Formats, prints, and rethrows processing and runtime transport infrastructure exceptions with cause context.
   *
   * @param error - The underlying thrown crash instance.
   * @param contextMessage - Explanatory metadata describing the failed operation.
   * @throws {Error} Always throws an enriched error wrapping the primary exception inside 'cause'.
   */
  protected handleError(error: unknown, contextMessage: string): never {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown network failure';

    console.error(`[${this.constructor.name} Error] ${contextMessage}:`, error);

    throw new Error(`${contextMessage}: ${errorMessage}`, { cause: error });
  }

  /**
   * Shared request wrapper to inject default headers and handle HTTP status validation.
   *
   * @template R - The expected data schema shape inside the resolved promise payload.
   * @param url - The absolute target destination URL string.
   * @param options - Standard fetch parameters extending RequestInit configurations.
   * @returns Type-mapped JSON results.
   * @throws {Error} When response.ok yields false.
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
   *
   * @template R - The expected target data result.
   * @param fn - Wrapper execution block encapsulating the primary transport fetch instruction.
   * @param retries - Remaining attempt loops allowed before terminal crash state.
   * @param delay - Current backoff duration tracker in milliseconds.
   * @param signal - Optional AbortSignal instance allowing asynchronous interruption.
   * @returns Resolution of the wrapped network request.
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
   * Pulls structural paginated generic array collections matching filter rules.
   *
   * @param page - The target pagination page offset value.
   * @param limit - The size layout indicating maximum elements returned.
   * @param filters - Active filtering properties adhering to specific entity properties.
   * @param retryOptions - Policy parameters configuration modifying backoff loops.
   * @returns Array collection holding system objects.
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
   * Pulls a singular specific complete resource configuration by its unique identifier.
   *
   * @param id - The identifier targeting the unique server resource.
   * @param retryOptions - Policy parameters configuration modifying backoff loops.
   * @returns The fully fetched remote model entity configuration.
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
   *
   * @param payload - Structuring model variables matching creation specifications.
   * @returns The freshly saved structural record representation.
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
   *
   * @param id - The identifier targeting the unique server resource.
   * @param updatedData - Schema payload indicating properties to update.
   * @returns The updated record state representing mutations.
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
   *
   * @param id - The identifier targeting the unique server resource.
   * @param partialData - A delta payload containing modified object fields.
   * @returns The final mutated structure.
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
   *
   * @param id - The identifier targeting the unique server resource.
   * @returns The deleted asset image state returned by the platform.
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
