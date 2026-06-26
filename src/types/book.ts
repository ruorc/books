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

// Global blueprint for any data transfer object used to create or fully replace a book entity
export type BookPayload = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>;
