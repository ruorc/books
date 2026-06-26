import type { Book, BookPayload } from '@/types/book';
import type { RetryOptions, QueryFilters } from '@/types/api'; 

// 1. Read-only contract used strictly by Catalog components and search views
export interface IBooksReadService {
  getAllBooks(page: number, limit: number, filters?: QueryFilters, retryOptions?: RetryOptions): Promise<Book[]>;
}

// 2. Write-only contract injected directly into creation/edition Form components
export interface IBooksWriteService {
  createBook(book: Omit<BookPayload, 'isFavorite'>): Promise<Book>;
  updateBook(id: string, updatedData: Partial<BookPayload>): Promise<Book>;
  patchBook(id: string, partialData: Partial<Book>): Promise<Book>;
  deleteBook(id: string): Promise<Book>;
}

// 3. Unified application-level contract combining both read and write capabilities
export interface IBooksService extends IBooksReadService, IBooksWriteService {}

// 4. Concrete infrastructure-level contract specifically for MockAPI edge-cases
export interface IMockApiBooksService extends IBooksService {
  updateBook(id: string, updatedData: Partial<BookPayload>, shouldUpdateTimestamp?: boolean): Promise<Book>;
}
