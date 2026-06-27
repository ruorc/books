/**
 * Core interface definition representing the standard Book domain model entity.
 */
export interface Book {
  id: string;
  title: string;
  author: string;
  year: string;
  description: string;
  coverImage: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Global blueprint for any data transfer object used to create or fully replace a book entity.
 * Strips away server-managed systemic properties like id and analytical timestamps.
 */
export type BookPayload = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>;
