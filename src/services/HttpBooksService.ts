import { NETWORK_CONFIG } from '@/config/network';
import type { Book, BookPayload } from '@/types/book';
import type { RetryOptions, QueryFilters } from '@/types/api';
import type { IBooksService } from '@/types/booksService';

export class HttpBooksService implements IBooksService {
  protected readonly baseUrl: string;

  constructor(endpointUrl: string) {
    if (!endpointUrl) {
      console.error(
        '[HttpBooksService] Critical configuration error: base endpoint URL is missing.'
      );
    }
    this.baseUrl = endpointUrl;
  }

  /**
   * Private helper to centralize and format network errors
   */
  private handleError(error: unknown, contextMessage: string): never {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown network failure';
    console.error(`[Base HttpBooksService Error] ${contextMessage}:`, error);
    throw new Error(`${contextMessage}: ${errorMessage}`);
  }

  /**
   * Private helper to retry ONLY clean network failures (CORS, offline, DNS drops)
   * It implements exponential backoff to lower stress on the server.
   */
  private async retryNetworkRequest<T>(
    fn: () => Promise<T>,
    retries: number,
    delay: number
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        console.warn(
          `[HttpBooksService] Network connection failed. Retrying in ${delay}ms... (${retries} attempts left)`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.retryNetworkRequest(fn, retries - 1, delay * 1.5);
      }
      throw error;
    }
  }

  // Accepts structural constraints parameters from the upper calling layers
  // Inside HttpBooksService.ts -> getAllBooks method:
  async getAllBooks(
    page: number,
    limit: number,
    filters: QueryFilters = {},
    retryOptions: RetryOptions = {}
  ): Promise<Book[]> {
    const {
      retries = NETWORK_CONFIG.DEFAULT_RETRIES,
      delay = NETWORK_CONFIG.DEFAULT_DELAY,
      signal,
    } = retryOptions;

    const executeFetch = async () => {
      const url = new URL(this.baseUrl);
      url.searchParams.append('page', String(page));
      url.searchParams.append('limit', String(limit));

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          url.searchParams.append(key, String(value));
        }
      });

      let response: Response;
      try {
        // Pass the browser signal directly into the native fetch options pipeline
        response = await fetch(url.toString(), { signal });
      } catch (networkError) {
        throw networkError; // Forward to trigger retry loop logic
      }

      if (!response.ok) {
        throw new Error(`HTTP error. Status: ${response.status}`);
      }

      return await response.json();
    };

    try {
      return await this.retryNetworkRequest(executeFetch, retries, delay);
    } catch (error) {
      // If the error is an intentional AbortError, simply rethrow it without triggering console.error spikes
      if (error instanceof Error && error.name === 'AbortError') {
        throw error;
      }
      this.handleError(error, 'Failed to retrieve the books data stream');
    }
  }

  // Uses Omit over the clean BookPayload block for baseline initialization
  async createBook(book: Omit<BookPayload, 'isFavorite'>): Promise<Book> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...book, isFavorite: false }),
      });
      if (!response.ok)
        throw new Error(`HTTP error. Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      this.handleError(error, 'Failed to save a new book entry');
    }
  }

  // Standard payload replacement matching the updated core BookPayload type
  async updateBook(
    id: string,
    updatedData: Partial<BookPayload>
  ): Promise<Book> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok)
        throw new Error(`HTTP error. Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      this.handleError(error, `Failed to replace data for book ID ${id}`);
    }
  }

  async patchBook(id: string, partialData: Partial<Book>): Promise<Book> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partialData),
      });
      if (!response.ok)
        throw new Error(`HTTP error. Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      this.handleError(error, `Failed to partially patch book ID ${id}`);
    }
  }

  async deleteBook(id: string): Promise<Book> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok)
        throw new Error(`HTTP error. Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      this.handleError(error, `Failed to delete record for book ID ${id}`);
    }
  }
}
