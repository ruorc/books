import type { Book, BookPayload } from '../types/book';
import type { RetryOptions, QueryFilters } from '@/types/api';

/**
 * Interface segregation client contract isolating read-only data operations.
 * Prevents consumer views from accidentally accessing state-mutating transaction pipelines.
 */
export interface BooksReadService {
  /**
   * Fetches the filtered catalog collection with support for infinite scrolling and pagination.
   * Leverages exponential backoff retries to guarantee presentation stability during network degradation.
   */
  readonly getAll: (
    page: number,
    limit: number,
    filters?: QueryFilters<Book>,
    retryOptions?: RetryOptions
  ) => Promise<Partial<Book>[]>;

  /**
   * Resolves a complete, individual book profile configuration from the persistent data store.
   * Serves as the primary data hydration hook for deep-linked detail presentation views.
   */
  readonly getById: (id: string, retryOptions?: RetryOptions) => Promise<Book>;
}

/**
 * Interface segregation client contract isolating write-only data mutations.
 * Enforces strict boundary controls over state destruction and creation pipelines.
 */
export interface BooksWriteService {
  /**
   * Registers a fresh book instance into the ecosystem repository.
   * Automatically initializes necessary server-side relational records and search parameters.
   */
  readonly create: (book: Omit<BookPayload, 'isFavorite'>) => Promise<Book>;

  /**
   * Dispatches a complete structural replacement payload to update an existing book profile.
   * Triggers global state synchronization across active rendering layout trees.
   */
  readonly update: (
    id: string,
    updatedData: Partial<BookPayload>
  ) => Promise<Book>;

  /**
   * Applies atomic field variations or delta patches to a targeted catalog asset.
   * Optimizes network bandwidth consumption during low-overhead structural mutations.
   */
  readonly patch: (id: string, partialData: Partial<Book>) => Promise<Book>;

  /**
   * Evicts a book entity permanently from the centralized data infrastructure.
   * Triggers cascade cleanups across local cached collections and client-side view states.
   */
  readonly delete: (id: string) => Promise<Book>;
}

/**
 * Unified application-level service contract combining read and write capabilities.
 */
export interface BooksService extends BooksReadService, BooksWriteService {}

/**
 * Platform override constraints tailored specifically for the MockAPI vendor ecosystem.
 */
export interface MockApiUpdateOptions {
  /** Bypasses global entity validation layers to preserve legacy system update flags */
  readonly signal?: AbortSignal;
  /** Specialized auditing toggle indicating if the modification timestamp should be refreshed */
  readonly shouldUpdateTimestamp?: boolean;
}

/**
 * Infrastructure integration contract handling MockAPI platform synchronization workarounds.
 * Accounts for vendor-specific mutations and non-standard payload structural formats.
 */
export interface MockApiBooksService extends BooksService {
  /**
   * Synchronizes data fields with the vendor platform while stripping out invalid local parameters.
   * Intercepts standard mutations to inject platform-specific timestamp payloads safely.
   */
  readonly update: (
    id: string,
    updatedData: Partial<BookPayload>,
    options?: MockApiUpdateOptions
  ) => Promise<Book>;
}
