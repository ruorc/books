import { HttpBooksService } from './HttpBooksService';
import type { Book, BookPayload } from '@/types/book';
import type { RetryOptions, QueryFilters } from '@/types/api';
import type { IMockApiBooksService } from '@/types/booksService';

/**
 * MockAPI adapter overriding default mechanisms to patch vendor constraints.
 */
export class MockApiBooksService
  extends HttpBooksService
  implements IMockApiBooksService
{
  constructor(mockApiEndpointUrl: string) {
    // Explicitly pass the unique vendor-specific absolute URL to the inheritance chain
    super(mockApiEndpointUrl);
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
        // MockAPI filters primitives by matching explicit string values strictly
        if (value === true || value === 'true') {
          sanitizedFilters[key] = 'true' as any;
        } else if (value === false || value === 'false') {
          sanitizedFilters[key] = 'false' as any;
        } else if (value !== undefined && value !== '') {
          sanitizedFilters[key] = value as any;
        }
      });

      return await super.getAll(page, limit, sanitizedFilters, retryOptions);
    } catch (error) {
      // MockAPI natively triggers a 404 status exception instead of sending an empty dataset [].
      if (error instanceof Error && error.message.includes('Status: 404')) {
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

    // This correctly bubbles up to HttpBooksService.create which appends 'isFavorite: false'
    return await super.create(enrichedPayload);
  }

  /**
   * Updates targeted fields and cleans out hazardous immutable parameters like 'id' from payloads.
   */
  override async update(
    id: string,
    updatedData: Partial<BookPayload>,
    shouldUpdateTimestamp: boolean = true
  ): Promise<Book> {
    // Destructure to isolate and strip immutable id field preventing 400 Bad Request responses
    const { id: _, ...cleanData } = updatedData as any;

    const enrichedPayload: Partial<BookPayload> & { updatedAt?: string } = {
      ...cleanData,
    };

    if (shouldUpdateTimestamp) {
      enrichedPayload.updatedAt = new Date().toISOString();
    }

    // Skips HttpBooksService (which doesn't have an update) and triggers HttpBaseService.update natively
    return await super.update(id, enrichedPayload);
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

      // Delegate directly to the overridden update method above to ensure clean execution and timestamps
      return await this.update(id, fullUpdatedData, !isOnlyFavoriteToggle);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown transport error';
      console.error(
        `[MockApiBooksService Overridden Patch Error] Failed to delegate patch for book ID ${id}:`,
        error
      );
      throw new Error(
        `Failed to patch book fields on MockAPI: ${errorMessage}`
      );
    }
  }
}
