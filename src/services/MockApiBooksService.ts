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
          sanitizedFilters[key] = value as any;
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
