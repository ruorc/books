import { HttpBooksService } from './HttpBooksService';
import { HttpServiceError } from '@/services/http/HttpServiceError';

import type { Book, BookPayload } from '@/views/BooksDomain/types/book';
import type { RetryOptions, QueryFilters } from '@/types/api';
import type { AuthInterceptor } from '@/types/auth';
import type {
  MockApiBooksService as MockApiBooksContract,
  MockApiUpdateOptions,
} from '@/views/BooksDomain/types/booksService';

/**
 * MockAPI adapter overriding default mechanisms to patch vendor constraints.
 * Implements strict type safety across all operations without relying on any explicit any types.
 */
export class MockApiHttpBooksService
  extends HttpBooksService
  implements MockApiBooksContract
{
  /**
   * Initializes the MockAPI service with a vendor-specific absolute URL and an optional authorization interceptor.
   */
  constructor(mockApiEndpointUrl: string, authInterceptor?: AuthInterceptor) {
    super(mockApiEndpointUrl, authInterceptor);
  }

  /**
   * Normalizes boolean values to strings and intercepts 404 responses to fallback empty arrays safely.
   */
  override async getAll(
    page: number,
    limit: number,
    filters: QueryFilters<Book> = {},
    retryOptions: RetryOptions = {}
  ): Promise<Partial<Book>[]> {
    try {
      const sanitizedFilters: QueryFilters<Book> = {};

      Object.entries(filters).forEach(([key, value]) => {
        if (value === true || value === 'true') {
          sanitizedFilters[key] = 'true';
        } else if (value === false || value === 'false') {
          sanitizedFilters[key] = 'false';
        } else if (value !== undefined && value !== '') {
          sanitizedFilters[key] = value as string | number;
        }
      });

      return await super.getAll(page, limit, sanitizedFilters, retryOptions);
    } catch (error) {
      if (error instanceof HttpServiceError && error.status === 404) {
        return [];
      }

      throw error;
    }
  }

  /**
   * Stamps auditing ISO timestamp strings during initial record injection processes.
   */
  override async create(book: Omit<BookPayload, 'isFavorite'>): Promise<Book> {
    const currentIsoTime = new Date().toISOString();

    const enrichedPayload = {
      ...book,
      createdAt: currentIsoTime,
      updatedAt: currentIsoTime,
    };

    return await super.create(enrichedPayload);
  }

  /**
   * Updates targeted fields and cleans out hazardous immutable parameters like id from payloads.
   */
  override async update(
    id: string,
    updatedData: Partial<BookPayload> & { readonly id?: string },
    options?: MockApiUpdateOptions
  ): Promise<Book> {
    const shouldUpdateTimestamp = options?.shouldUpdateTimestamp ?? true;

    const { id: _ignoredId, ...cleanData } = updatedData;

    const enrichedPayload: Partial<BookPayload> & { updatedAt?: string } = {
      ...cleanData,
    };

    if (shouldUpdateTimestamp) {
      enrichedPayload.updatedAt = new Date().toISOString();
    }

    return await super.update(id, enrichedPayload, { signal: options?.signal });
  }

  /**
   * Recomposes a virtual patch transaction utilizing standard retry-protected workflow calls.
   */
  override async patch(id: string, partialData: Partial<Book>): Promise<Book> {
    try {
      const currentBook = await this.getById(id);

      const incomingKeys = Object.keys(partialData);
      const isOnlyFavoriteToggle =
        incomingKeys.length === 1 && incomingKeys[0] === 'isFavorite';

      const fullUpdatedData = {
        ...currentBook,
        ...partialData,
      };

      return await this.update(id, fullUpdatedData, {
        shouldUpdateTimestamp: !isOnlyFavoriteToggle,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown transport error';

      console.error(
        `[${this.constructor.name} Overridden Patch Error] Failed to delegate patch for book ID ${id}:`,
        error
      );

      throw new Error(
        `Failed to patch book fields on MockAPI: ${errorMessage}`,
        {
          cause: error,
        }
      );
    }
  }
}
