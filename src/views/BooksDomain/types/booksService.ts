import type { Book, BookPayload } from '@/views/BooksDomain/types/book';
import type { RetryOptions, QueryFilters } from '@/types/api';

/**
 * Read-only interface contract used strictly by catalog components and search views.
 * Exposes safe retrieval methods bound directly to the universal core book entity shape.
 * Documented strictly as plain textual prose entirely free from any parameter descriptors.
 */
export interface BooksReadService {
  /**
   * Pulls a structurally paginated collection of book records matching specified filter rules.
   * Accepts target page offset, maximum elements per page boundary, optional query filters,
   * and custom policy configurations managing automated network request retries.
   * Returns a promise resolving to an array of partial book records.
   */
  readonly getAll: (
    page: number,
    limit: number,
    filters?: QueryFilters<Book>,
    retryOptions?: RetryOptions
  ) => Promise<Partial<Book>[]>;

  /**
   * Pulls a singular specific complete book entity from the server by its unique identifier.
   * Accepts the unique resource target token and optional policy controls managing request retries.
   * Returns a promise resolving to the fully fetched complete book entity configurations.
   */
  readonly getById: (id: string, retryOptions?: RetryOptions) => Promise<Book>;
}

/**
 * Write-only interface contract injected directly into creation or edition form components.
 * Restricts access to data-mutating network transactions to secure architecture pipelines.
 * Features dense text descriptions completely free from any implicit token tags.
 */
export interface BooksWriteService {
  /**
   * Registers a fresh book item into the remote system, seeding initial required system flags.
   * Accepts a core payload containing book data fields while omitting initial favorite status flags.
   * Returns a promise resolving to the freshly saved structural book record representation.
   */
  readonly create: (book: Omit<BookPayload, 'isFavorite'>) => Promise<Book>;

  /**
   * Overwrites the target book resource state with a fresh complete schema configuration.
   * Accepts the unique identifying resource token and a partial payload indicating mutations.
   * Returns a promise resolving to the updated book record state representing server variations.
   */
  readonly update: (
    id: string,
    updatedData: Partial<BookPayload>
  ) => Promise<Book>;

  /**
   * Applies precise local differential field mutations or delta changes on the remote database.
   * Accepts the unique identifying resource token and a delta payload containing modified fields.
   * Returns a promise resolving to the final mutated complete book structure.
   */
  readonly patch: (id: string, partialData: Partial<Book>) => Promise<Book>;

  /**
   * Strips a book record permanently from the remote cluster database infrastructure.
   * Accepts the unique target identifier tracking the book resource to remove.
   * Returns a promise resolving to the deleted asset state returned by the platform.
   */
  readonly delete: (id: string) => Promise<Book>;
}

/**
 * Unified application-level contract combining both read and write capabilities.
 * Inherits all method signatures from baseline segregation interfaces securely.
 */
export interface BooksService extends BooksReadService, BooksWriteService {}

/**
 * Configuration options interface governing specific update transaction behavior
 * on the MockAPI vendor platform.
 */
export interface MockApiUpdateOptions {
  /** Standard web API abort signal utilized to cancel the ongoing network transaction */
  readonly signal?: AbortSignal;
  /** Specialized auditing toggle indicating if the modification timestamp should be refreshed */
  readonly shouldUpdateTimestamp?: boolean;
}

/**
 * Concrete infrastructure-level contract specifically managing MockAPI operational overrides.
 * Adjusts baseline transaction definitions to support specialized audit-logging parameters.
 */
export interface MockApiBooksService extends BooksService {
  /**
   * Updates targeted fields and cleans out hazardous immutable parameters on the vendor platform.
   * Accepts the target identifier, a partial payload, and an optional timestamp modification configuration.
   * Returns a promise resolving to the freshly mutated book instance.
   */
  readonly update: (
    id: string,
    updatedData: Partial<BookPayload>,
    options?: MockApiUpdateOptions
  ) => Promise<Book>;
}
