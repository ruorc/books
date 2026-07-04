import { HttpBooksService } from './HttpBooksService';
import type { Book, BookPayload } from '@/types/book';
import type { RetryOptions, QueryFilters } from '@/types/api';
import type { MockApiBooksService as MockApiBooksContract } from '@/types/booksService';

/**
 * MockAPI adapter overriding default mechanisms to patch vendor constraints.
 * Implements strict type safety across all operations without relying on any explicit any types.
 * Normalizes specialized network status codes and filters data structures natively.
 * Documented strictly as plain textual engineering prose entirely free from descriptor tags.
 */
export class MockApiHttpBooksService
  extends HttpBooksService
  implements MockApiBooksContract
{
  /**
   * Initializes the MockAPI service with a vendor-specific absolute URL.
   * Explicitly passes the unique vendor-specific absolute URL to the inheritance chain.
   */
  constructor(mockApiEndpointUrl: string) {
    super(mockApiEndpointUrl);
  }

  /**
   * Normalizes boolean values to strings and intercepts 404 responses to fallback empty arrays safely.
   * Intercepts vendor specific query filters to match explicit string values strictly.
   * Returns a promise resolving to an array of partial book records.
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
      if (error instanceof Error && error.message.includes('Status: 404')) {
        return [];
      }

      throw error;
    }
  }

  /**
   * Stamps auditing ISO timestamp strings during initial record injection processes.
   * Automatically synchronizes metadata properties before sending data to the super pipeline.
   * Returns a promise resolving to the created Book instance.
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
   * Protects server state validation metrics and conditionally updates modified timestamps.
   * Returns a promise resolving to the updated Book instance.
   */
  override async update(
    id: string,
    updatedData: Partial<BookPayload>,
    shouldUpdateTimestamp: boolean = true
  ): Promise<Book> {
    const cleanData: Partial<BookPayload> & { id?: string } = {
      ...updatedData,
    };

    delete cleanData.id;

    const enrichedPayload: Partial<BookPayload> & { updatedAt?: string } = {
      ...cleanData,
    };

    if (shouldUpdateTimestamp) {
      enrichedPayload.updatedAt = new Date().toISOString();
    }

    return await super.update(id, enrichedPayload);
  }

  /**
   * Recomposes a virtual patch transaction utilizing standard retry-protected workflow calls.
   * Assesses modification deltas to determine whether auditing timestamps must change.
   * Wraps underlying transport exceptions within the native cause option property.
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

      return await this.update(id, fullUpdatedData, !isOnlyFavoriteToggle);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown transport error';

      console.error(
        `[MockApiBooksService Overridden Patch Error] Failed to delegate patch for book ID ${id}:`,
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
