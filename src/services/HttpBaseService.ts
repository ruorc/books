import { NETWORK_CONFIG } from '@/config/network';
import type { RetryOptions, QueryFilters } from '@/types/api';

/**
 * Universal abstract base class managing transport, retries, and standard CRUD behaviors.
 * T represents the main core entity model, TPayload represents creation/update specifications.
 */
export abstract class HttpBaseService<T, TPayload> {
  protected readonly baseUrl: string;

  constructor(endpointUrl: string) {
    if (!endpointUrl) {
      console.error(
        `[${this.constructor.name}] Critical configuration error: base endpoint URL is missing.`
      );
    }
    this.baseUrl = endpointUrl;
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
   * Implements exponential backoff strategy for transparent connection recovery drops.
   */
  protected async retryNetworkRequest<R>(
    fn: () => Promise<R>,
    retries: number,
    delay: number
  ): Promise<R> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        console.warn(
          `[${this.constructor.name}] Network failed. Retrying in ${delay}ms... (${retries} attempts left)`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.retryNetworkRequest(fn, retries - 1, delay * 1.5);
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
      const url = new URL(this.baseUrl);
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

      const response = await fetch(url.toString(), { signal });
      if (!response.ok)
        throw new Error(`HTTP error. Status: ${response.status}`);
      return await response.json();
    };

    try {
      return await this.retryNetworkRequest(executeFetch, retries, delay);
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

    const executeFetch = async () => {
      const response = await fetch(`${this.baseUrl}/${id}`, { signal });
      if (!response.ok)
        throw new Error(`HTTP error. Status: ${response.status}`);
      return await response.json();
    };

    try {
      return await this.retryNetworkRequest(executeFetch, retries, delay);
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
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok)
        throw new Error(`HTTP error. Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      this.handleError(error, 'Failed to save a new entry');
    }
  }

  /**
   * Overwrites target resource state with fresh complete schema configurations.
   */
  async update(id: string, updatedData: Partial<TPayload>): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok)
        throw new Error(`HTTP error. Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      this.handleError(error, `Failed to replace data for ID ${id}`);
    }
  }

  /**
   * Applies precise local differential field mutations on the server.
   */
  async patch(id: string, partialData: Partial<T>): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partialData),
      });
      if (!response.ok)
        throw new Error(`HTTP error. Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      this.handleError(error, `Failed to partially patch ID ${id}`);
    }
  }

  /**
   * Strips a record permanently from the remote cluster database.
   */
  async delete(id: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok)
        throw new Error(`HTTP error. Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      this.handleError(error, `Failed to delete record for ID ${id}`);
    }
  }
}
