import type { Book, BookPayload } from '@/types/book';
import type { RetryOptions, QueryFilters } from '@/types/api';

/**
 * Read-only contract used strictly by Catalog components and search views.
 * Bound directly to the universal core entity shape.
 */
export interface IBooksReadService {
  /**
   * Pulls a structurally paginated collection of book records matching specified filter rules.
   *
   * @param page - The target pagination page offset value.
   * @param limit - The maximum number of elements returned per page.
   * @param filters - Optional filtering criteria mapped directly to the Book model properties.
   * @param retryOptions - Optional policy configuration managing automated request retries.
   * @returns A promise resolving to an array of partial book records.
   */
  getAll(
    page: number,
    limit: number,
    filters?: QueryFilters<Book>,
    retryOptions?: RetryOptions
  ): Promise<Partial<Book>[]>;

  /**
   * Pulls a singular specific complete book entity by its unique identifier.
   *
   * @param id - The unique identifier targeting the specific remote book resource.
   * @param retryOptions - Optional policy configuration managing automated request retries.
   * @returns A promise resolving to the fully fetched complete Book entity configuration.
   */
  getById(id: string, retryOptions?: RetryOptions): Promise<Book>;
}

/**
 * Write-only contract injected directly into creation/edition Form components.
 */
export interface IBooksWriteService {
  /**
   * Registers a fresh book item into the remote system, seeding initial required system flags.
   *
   * @param book - The payload containing book data, omitting the initial favorite status flag.
   * @returns A promise resolving to the freshly saved structural Book record representation.
   */
  create(book: Omit<BookPayload, 'isFavorite'>): Promise<Book>;

  /**
   * Overwrites the target book resource state with a fresh complete schema configuration.
   *
   * @param id - The unique identifier targeting the book resource to update.
   * @param updatedData - Schema payload indicating properties to update.
   * @returns A promise resolving to the updated Book record state representing mutations.
   */
  update(id: string, updatedData: Partial<BookPayload>): Promise<Book>;

  /**
   * Applies precise local differential field mutations (delta changes) on the server.
   *
   * @param id - The unique identifier targeting the book resource to modify.
   * @param partialData - A delta payload containing modified object fields.
   * @returns A promise resolving to the final mutated Book structure.
   */
  patch(id: string, partialData: Partial<Book>): Promise<Book>;

  /**
   * Strips a book record permanently from the remote cluster database.
   *
   * @param id - The unique identifier targeting the book resource to remove.
   * @returns A promise resolving to the deleted asset state returned by the platform.
   */
  delete(id: string): Promise<Book>;
}

/**
 * Unified application-level contract combining both read and write capabilities.
 */
export interface IBooksService extends IBooksReadService, IBooksWriteService {}

/**
 * Concrete infrastructure-level contract specifically for MockAPI edge-cases.
 * Overrides the base update method signature to support vendor auditing parameters.
 */
export interface IMockApiBooksService extends IBooksService {
  /**
   * Updates targeted fields and cleans out hazardous immutable parameters, supporting optional timestamp management.
   *
   * @param id - The unique identifier of the book entity to update.
   * @param updatedData - The partial payload containing data fields slated for update.
   * @param shouldUpdateTimestamp - Optional flag dictating whether the auditing timestamp must be incremented.
   * @returns A promise resolving to the updated Book instance.
   */
  update(
    id: string,
    updatedData: Partial<BookPayload>,
    shouldUpdateTimestamp?: boolean
  ): Promise<Book>;
}
