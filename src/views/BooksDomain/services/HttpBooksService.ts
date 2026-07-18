import { HttpCrudService } from '@/services/http/HttpCrudService';

import type { Book, BookPayload } from '../types/book';
import type { BooksService } from '../types/booksService';
import type { AuthInterceptor } from '@/types/auth';

/**
 * Specialized HTTP transport coordinator focusing explicitly on Book business entities.
 * Manages standardized communication interfaces with underlying infrastructure layers.
 */
export class HttpBooksService
  extends HttpCrudService<Book, BookPayload>
  implements BooksService
{
  /**
   * Initializes the specialized Book transport service with endpoint validation and authorization interceptors.
   * Maps foundational connection vectors and security tokens required by secure egress gateways.
   */
  constructor(endpointUrl: string, authInterceptor?: AuthInterceptor) {
    super(endpointUrl, authInterceptor);
  }

  /**
   * Seeds missing runtime UI flags natively on baseline insertion procedures.
   * Forces safe fallback defaults for non-nullable domain model attributes.
   */
  override async create(book: Omit<BookPayload, 'isFavorite'>): Promise<Book> {
    const securePayload: BookPayload = {
      ...book,
      isFavorite: false,
    };

    return await super.create(securePayload);
  }
}
