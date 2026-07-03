import { HttpBaseService } from './HttpBaseService';
import type { Book, BookPayload } from '@/types/book';
import type { IBooksService } from '@/types/booksService';

/**
 * Specialized HTTP transport coordinator focusing explicitly on Book business entities.
 * Manages standardized communication interfaces with underlying infrastructure layers.
 */
export class HttpBooksService
  extends HttpBaseService<Book, BookPayload>
  implements IBooksService
{
  /**
   * Initializes the specialized Book transport service.
   * @param endpointUrl - The absolute URL path pointing to the book management service endpoint.
   */
  constructor(endpointUrl: string) {
    // Pass the external endpoint configuration directly up to the HTTP transport layer validation matrix
    super(endpointUrl);
  }

  /**
   * Seeds missing runtime UI flags natively on baseline insertion procedures.
   * Forces safe fallback defaults for non-nullable domain model attributes.
   *
   * @param book - The payload containing book data, omitting the initial favorite status flag.
   * @returns A promise resolving to the fully structured and registered Book entity.
   */
  override async create(book: Omit<BookPayload, 'isFavorite'>): Promise<Book> {
    // Directly typing the object literal ensures strict structural compile-time safety without 'as'
    const securePayload: BookPayload = {
      ...book,
      isFavorite: false,
    };

    return await super.create(securePayload);
  }
}
