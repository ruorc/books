import { NETWORK_CONFIG } from '@/config/network';
import { HttpBaseService } from './HttpBaseService';
import { runWithRetry, shouldRetryRequest } from './HttpRetryRunner';

import type { RetryOptions, QueryFilters } from '@/types/api';

/**
 * Standard configuration options interface applied to unsafe data-mutating
 * HTTP operations like creation, updates, and records removal.
 */
export interface HttpTransactionOptions {
  /** Connects mid-flight payload mutations to global timeout trees or explicit component eviction hooks */
  readonly signal?: AbortSignal;
}

/**
 * Abstract resource-oriented service implementing standard CRUD operations over HTTP transport.
 */
export abstract class HttpCrudService<T, TPayload> extends HttpBaseService {
  /**
   * Resolves structurally paginated queries by mapping complex local object graphs into safe URL query streams.
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
      maxDelay = NETWORK_CONFIG.DEFAULT_MAX_DELAY,
      signal,
    } = retryOptions;

    const searchParams = new URLSearchParams();

    searchParams.append('page', String(page));
    searchParams.append('limit', String(limit));

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        if (key === 'select' && Array.isArray(value)) {
          searchParams.append('select', value.join(','));
        } else if (key !== 'select') {
          searchParams.append(key, String(value));
        }
      }
    });

    const url = this.urlManager.resolve(undefined, searchParams);

    try {
      return await runWithRetry(
        () =>
          this.request<Partial<T>[]>(url.toString(), {
            signal: signal ?? undefined,
          }),
        retries,
        delay,
        signal ?? undefined,
        shouldRetryRequest,
        maxDelay
      );
    } catch (error) {
      throw await this.handleError(error, 'Failed to retrieve the data stream');
    }
  }

  /**
   * Resolves structural configuration profiles for separate, isolated entities matching a single primary identifier.
   */
  async getById(id: string, retryOptions: RetryOptions = {}): Promise<T> {
    const {
      retries = NETWORK_CONFIG.DEFAULT_RETRIES,
      delay = NETWORK_CONFIG.DEFAULT_DELAY,
      maxDelay = NETWORK_CONFIG.DEFAULT_MAX_DELAY,
      signal,
    } = retryOptions;

    const targetUrl = this.urlManager.resolve(id).toString();

    try {
      return await runWithRetry(
        () => this.request<T>(targetUrl, { signal: signal ?? undefined }),
        retries,
        delay,
        signal ?? undefined,
        shouldRetryRequest,
        maxDelay
      );
    } catch (error) {
      throw await this.handleError(
        error,
        `Failed to retrieve item by ID ${id}`
      );
    }
  }

  /**
   * Commits fresh data models to remote persistence stores.
   */
  async create(
    payload: TPayload,
    options?: HttpTransactionOptions
  ): Promise<T> {
    try {
      return await this.request<T>(this.urlManager.url, {
        method: 'POST',
        body: JSON.stringify(payload),
        signal: options?.signal,
      });
    } catch (error) {
      throw await this.handleError(error, 'Failed to save a new entry');
    }
  }

  /**
   * Enforces complete idempotency constraints by entirely overwriting target schemas.
   */
  async update(
    id: string,
    updatedData: Partial<TPayload>,
    options?: HttpTransactionOptions
  ): Promise<T> {
    try {
      return await this.request<T>(this.urlManager.resolve(id).toString(), {
        method: 'PUT',
        body: JSON.stringify(updatedData),
        signal: options?.signal,
      });
    } catch (error) {
      throw await this.handleError(
        error,
        `Failed to replace data for ID ${id}`
      );
    }
  }

  /**
   * Optimizes ingress data traffic flows by patching partial delta field variations.
   */
  async patch(
    id: string,
    partialData: Partial<TPayload>,
    options?: HttpTransactionOptions
  ): Promise<T> {
    try {
      return await this.request<T>(this.urlManager.resolve(id).toString(), {
        method: 'PATCH',
        body: JSON.stringify(partialData),
        signal: options?.signal,
      });
    } catch (error) {
      throw await this.handleError(error, `Failed to partially patch ID ${id}`);
    }
  }

  /**
   * Evicts resource allocations from server clusters and dispatches cascade cache purges.
   */
  async delete(id: string, options?: HttpTransactionOptions): Promise<T> {
    try {
      return await this.request<T>(this.urlManager.resolve(id).toString(), {
        method: 'DELETE',
        signal: options?.signal,
      });
    } catch (error) {
      throw await this.handleError(
        error,
        `Failed to delete record for ID ${id}`
      );
    }
  }
}
