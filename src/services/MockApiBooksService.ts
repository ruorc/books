import { HttpBooksService } from './HttpBooksService';
import type { Book, BookPayload } from '@/types/book';
import type { RetryOptions, QueryFilters } from '@/types/api';
import type { IMockApiBooksService } from '@/types/booksService';

// Use 'implements' keyword to bind the strict MockAPI contract boundary
export class MockApiBooksService extends HttpBooksService implements IMockApiBooksService {
  /**
   * Overrides the base method to implement customized MockAPI query constraints resolution
   */
  override async getAllBooks(
    page: number, 
    limit: number, 
    filters: QueryFilters = {}, 
    retryOptions: RetryOptions = {}
  ): Promise<Book[]> {
    try {
      const sanitizedFilters: QueryFilters = {};

      Object.entries(filters).forEach(([key, value]) => {
        if (value === true || value === 'true') {
          sanitizedFilters[key] = 'true';
        } else if (value === false || value === 'false') {
          sanitizedFilters[key] = 'false';
        } else if (value !== undefined && value !== '') {
          sanitizedFilters[key] = value;
        }
      });

      return await super.getAllBooks(page, limit, sanitizedFilters, retryOptions);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Status: 404')) {
        return [];
      }
      throw error;
    }
  }

  /**
   * Overrides createBook to inject baseline server-side timestamps upon entity initialization
   */
  override async createBook(book: Omit<BookPayload, 'isFavorite'>): Promise<Book> {
    const currentIsoTime = new Date().toISOString();
    
    // Explicit intersection type declaration allows appending backend timestamp markers safely
    const enrichedPayload: Omit<BookPayload, 'isFavorite'> & { createdAt?: string; updatedAt?: string } = {
      ...book,
      createdAt: currentIsoTime,
      updatedAt: currentIsoTime,
    };

    return await super.createBook(enrichedPayload);
  }

  /**
   * Overrides updateBook to accept an optional flag for controlling the updatedAt generation log.
   */
  override async updateBook(
    id: string, 
    updatedData: Partial<BookPayload>, 
    shouldUpdateTimestamp: boolean = true
  ): Promise<Book> {
    // Explicit intersection type extension resolves the missing property compilation error natively
    const enrichedPayload: Partial<BookPayload> & { updatedAt?: string } = {
      ...updatedData,
    };

    if (shouldUpdateTimestamp) {
      enrichedPayload.updatedAt = new Date().toISOString();
    }

    return await super.updateBook(id, enrichedPayload);
  }

  /**
   * Overrides patchBook to check properties and delegate transport entirely to updateBook.
   */
  override async patchBook(id: string, partialData: Partial<Book>): Promise<Book> {
    try {
      const getResponse = await fetch(`${this.baseUrl}/${id}`);
      if (!getResponse.ok) {
        throw new Error(`Failed to fetch baseline book state for ID ${id}. Status: ${getResponse.status}`);
      }
      
      const currentBook: Book = await getResponse.json();

      const incomingKeys = Object.keys(partialData);
      const isOnlyFavoriteToggle = incomingKeys.length === 1 && incomingKeys[0] === 'isFavorite';

      const fullUpdatedData: Book = {
        ...currentBook,
        ...partialData,
      };

      return await this.updateBook(id, fullUpdatedData, !isOnlyFavoriteToggle);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown transport error';
      console.error(`[MockApiBooksService Overridden Patch Error] Failed to delegate patch for book ID ${id}:`, error);
      throw new Error(`Failed to patch book fields on MockAPI: ${errorMessage}`);
    }
  }
}
