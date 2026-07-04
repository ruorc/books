import { HttpBaseService } from './HttpBaseService';
import type { Book, BookPayload } from '@/types/book';
import type { BooksService } from '@/types/booksService';

/**
 * Specialized HTTP transport coordinator focusing explicitly on Book business entities.
 * Manages standardized communication interfaces with underlying infrastructure layers.
 * Completely free from any abstract param or template tags under strict repository rules.
 */
export class HttpBooksService
  extends HttpBaseService<Book, BookPayload>
  implements BooksService
{
  /**
   * Initializes the specialized Book transport service.
   * Passes the external endpoint configuration directly up to the HTTP transport layer validation matrix.
   */
  constructor(endpointUrl: string) {
    super(endpointUrl);
  }

  /**
   * Seeds missing runtime UI flags natively on baseline insertion procedures.
   * Forces safe fallback defaults for non-nullable domain model attributes.
   * Directly types the object literal to ensure strict structural compile-time safety.
   */
  override async create(book: Omit<BookPayload, 'isFavorite'>): Promise<Book> {
    const securePayload: BookPayload = {
      ...book,
      isFavorite: false,
    };

    return await super.create(securePayload);
  }
}
