import { HttpBaseService } from './HttpBaseService';
import type { Book, BookPayload } from '@/types/book';
import type { IBooksService } from '@/types/booksService';

/**
 * Specialized HTTP transport coordinator focusing explicitly on Book business entities.
 */
export class HttpBooksService
  extends HttpBaseService<Book, BookPayload>
  implements IBooksService
{
  constructor(endpointUrl: string) {
    // Pass the external endpoint configuration directly up to the HTTP transport layer validation matrix
    super(endpointUrl);
  }

  /**
   * Seeds missing runtime UI flags natively on baseline insertion procedures.
   */
  override async create(book: Omit<BookPayload, 'isFavorite'>): Promise<Book> {
    const securePayload = {
      ...book,
      isFavorite: false,
    } as BookPayload;

    return await super.create(securePayload);
  }
}
