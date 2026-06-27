import type { Book, BookPayload } from '@/types/book';
import type { RetryOptions, QueryFilters } from '@/types/api';

/**
 * Read-only contract used strictly by Catalog components and search views.
 * Bound directly to the universal core entity shape.
 */
export interface IBooksReadService {
  getAll(
    page: number,
    limit: number,
    filters?: QueryFilters<Book>,
    retryOptions?: RetryOptions
  ): Promise<Partial<Book>[]>;

  getById(id: string, retryOptions?: RetryOptions): Promise<Book>;
}

/**
 * Write-only contract injected directly into creation/edition Form components.
 */
export interface IBooksWriteService {
  create(book: Omit<BookPayload, 'isFavorite'>): Promise<Book>;
  update(id: string, updatedData: Partial<BookPayload>): Promise<Book>;
  patch(id: string, partialData: Partial<Book>): Promise<Book>;
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
  update(
    id: string,
    updatedData: Partial<BookPayload>,
    shouldUpdateTimestamp?: boolean
  ): Promise<Book>;
}
