import type { Book } from '@/types/book';
import type { IBooksService } from '@/types/booksService';

export class HttpBooksService implements IBooksService {
  private readonly baseUrl: string;

  constructor(endpointUrl: string) {
    if (!endpointUrl) {
      console.error('[HttpBooksService] Critical configuration error: base endpoint URL is missing.');
    }
    this.baseUrl = endpointUrl;
  }

  private handleError(error: unknown, contextMessage: string): never {
    const errorMessage = error instanceof Error ? error.message : 'Unknown network failure';
    console.error(`[Base HttpBooksService Error] ${contextMessage}:`, error);
    throw new Error(`${contextMessage}: ${errorMessage}`);
  }

  async getAllBooks(): Promise<Book[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) throw new Error(`HTTP error. Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      this.handleError(error, 'Failed to retrieve the books data stream');
    }
  }

  async createBook(book: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'isFavorite'>): Promise<Book> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...book, isFavorite: false }),
      });
      if (!response.ok) throw new Error(`HTTP error. Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      this.handleError(error, 'Failed to save a new book entry');
    }
  }

  // Pure REST implementation: Full data replacement via PUT
  async updateBook(id: string, updatedData: Partial<Book>): Promise<Book> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error(`HTTP error. Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      this.handleError(error, `Failed to replace data for book ID ${id}`);
    }
  }

  // Pure REST implementation: Partial item state mutation via PATCH (e.g., isFavorite toggle)
  async patchBook(id: string, partialData: Partial<Book>): Promise<Book> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partialData),
      });
      if (!response.ok) throw new Error(`HTTP error. Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      this.handleError(error, `Failed to partially patch book ID ${id}`);
    }
  }

  async deleteBook(id: string): Promise<Book> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP error. Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      this.handleError(error, `Failed to delete record for book ID ${id}`);
    }
  }
}
