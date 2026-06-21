import { useEffect, useState, useMemo } from 'react';
import { booksService } from '@/services/booksDataServiceMockApi';
import { MOCKAPI_CONFIG } from '@/config/mockapi';
import type { Book } from '@/types/book';

interface UseBooksCatalogProps {
  search: string;
  favOnly: boolean;
}

const LOCAL_STORAGE_FAV_KEY = MOCKAPI_CONFIG.LOCAL_STORAGE_KEYS.FAVORITES;

export function useBooksCatalog({ search, favOnly }: UseBooksCatalogProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_FAV_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_FAV_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await booksService.getAllBooks();
        setBooks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
      {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleDeleteBook = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await booksService.deleteBook(id);
      setBooks((prev) => prev.filter((book) => book.id !== id));
      setFavorites((prev) => prev.filter((favId) => favId !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase());
      const matchesFav = favOnly ? favorites.includes(book.id) : true;
      return matchesSearch && matchesFav;
    });
  }, [books, search, favOnly, favorites]);

  return {
    filteredBooks,
    isLoading,
    error,
    favorites,
    handleDeleteBook,
    handleToggleFavorite,
  };
}
