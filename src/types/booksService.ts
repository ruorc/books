import type { Book } from '@/types/book';

export interface IBooksService {
  getAllBooks(): Promise<Book[]>;
  createBook(book: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'isFavorite'>): Promise<Book>;
  updateBook(id: string, updatedData: Partial<Book>): Promise<Book>; // Full resource replacement (PUT)
  patchBook(id: string, partialData: Partial<Book>): Promise<Book>;   // Partial resource mutation (PATCH)
  deleteBook(id: string): Promise<Book>;
}
