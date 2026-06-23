import { useEffect, useState, useMemo } from 'react';
import { booksService } from '@/services/booksDataServiceMockApi';
import { useConfirm } from '@/providers/ConfirmProvider';
import { useSnack } from '@/providers/SnackProvider';
import { SNACK_TYPES } from '@/constants/snack';
import type { Book } from '@/types/book';

interface UseBooksCatalogProps {
  search: string;
  favOnly: boolean;
}

export function useBooksCatalog({ search, favOnly }: UseBooksCatalogProps) {
  const [booksMap, setBooksMap] = useState<Map<string, Book>>(() => new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { showConfirm } = useConfirm();
  const { showSnack } = useSnack();

  // 1. Fetch entire books collection from the server on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const remoteBooks = await booksService.getAllBooks();
        const normalizedMap = new Map(remoteBooks.map((book) => [book.id, book]));
        setBooksMap(normalizedMap);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to fetch catalog';
        setError(msg);
        showSnack(`Data sync failed: ${msg}`, SNACK_TYPES.ERROR);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // 2. Derive favorites IDs array reactively from the Map values
  const favorites = useMemo(() => {
    return Array.from(booksMap.values())
      .filter((book) => book.isFavorite)
      .map((book) => book.id);
  }, [booksMap]);

  // 3. Delete book with full integration of custom confirm dialogue and success snack
  const handleDeleteBook = async (id: string) => {
    const targetBook = booksMap.get(id);
    const bookTitle = targetBook ? `"${targetBook.title}"` : 'this book';

    const isConfirmed = await showConfirm({
      title: 'Delete Book Record',
      description: `Are you absolutely sure you want to delete ${bookTitle}? This operation will permanently remove the record from the remote server database.`,
      confirmLabel: 'Delete permanently',
      cancelLabel: 'Keep book',
      isDanger: true,
    });

    if (!isConfirmed) return;

    try {
      await booksService.deleteBook(id);
      
      setBooksMap((prev) => {
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
      
      showSnack(`${bookTitle} was successfully deleted from the database.`, SNACK_TYPES.SUCCESS);
    } catch (err) {
      showSnack(err instanceof Error ? err.message : 'Server rejected the delete operation.', SNACK_TYPES.ERROR);
    }
  };

  // 4. Toggle favorite flag with instant O(1) lookup and confirmation snack
  const handleToggleFavorite = async (id: string) => {
    const targetBook = booksMap.get(id);
    if (!targetBook) return;

    const updatedStatus = !targetBook.isFavorite;

    try {
      await booksService.patchBook(id, { isFavorite: updatedStatus });

      setBooksMap((prev) => {
        const next = new Map(prev);
        next.set(id, { ...targetBook, isFavorite: updatedStatus });
        return next;
      });

      const snackMessage = updatedStatus
        ? `"${targetBook.title}" added to your favorites stack.`
        : `"${targetBook.title}" removed from your favorites stack.`;
        
      showSnack(snackMessage, SNACK_TYPES.SUCCESS);
    } catch (err) {
      showSnack('Server failed to synchronize your favorite status.', SNACK_TYPES.ERROR);
    }
  };

  // 5. Compute filtered array from Map values
  const filteredBooks = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();
    const allBooks = Array.from(booksMap.values());

    return allBooks.filter((book) => {
      const matchesSearch = !normalizedSearch ||
        book.title.toLowerCase().includes(normalizedSearch) ||
        book.author.toLowerCase().includes(normalizedSearch);
        
      const matchesFav = favOnly ? book.isFavorite : true;
      
      return matchesSearch && matchesFav;
    });
  }, [booksMap, search, favOnly]);

  return {
    filteredBooks,
    isLoading,
    error,
    favorites,
    handleDeleteBook,
    handleToggleFavorite,
  };
}
