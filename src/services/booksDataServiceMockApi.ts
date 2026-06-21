import { MOCKAPI_CONFIG } from '@/config/mockapi';
import type { Book } from '@/types/book';

class BooksDataServiceMockApi {
  private readonly apiUrl = MOCKAPI_CONFIG.ENDPOINTS.BOOKS;

  /**
   * Helper method to centralize error handling and logging
   */
  private handleError(error: unknown, contextMessage: string): never {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error(`[BooksService Error] ${contextMessage}:`, error);
    throw new Error(`${contextMessage}: ${errorMessage}`);
  }

  /**
   * Fetches all books from the MockAPI server
   */
  async getAllBooks(): Promise<Book[]> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      this.handleError(error, 'Failed to fetch books repository');
    }
  }

  /**
   * Creates and adds a new book record to the MockAPI server
   */
  async createBook(book: Omit<Book, 'id' | 'createdAt'>): Promise<Book> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(book),
      });
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      this.handleError(error, 'Failed to create a new book record');
    }
  }

  /**
   * Updates an existing book record on the MockAPI server
   */
  async updateBook(
    id: string,
    updatedData: Partial<Omit<Book, 'id' | 'createdAt'>>
  ): Promise<Book> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      this.handleError(error, `Failed to update book with ID ${id}`);
    }
  }

  /**
   * Deletes a specific book from the MockAPI server by ID
   */
  async deleteBook(id: string): Promise<Book> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      this.handleError(error, `Failed to delete book with ID ${id}`);
    }
  }
}

export const booksService = new BooksDataServiceMockApi();
