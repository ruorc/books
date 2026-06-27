import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { booksService } from '@/services/booksDataServiceMockApi';
import { useSnack } from '@/providers/SnackProvider';
import { SNACK_TYPES } from '@/constants/snack';
import type { Book } from '@/types/book';

export function useBookDetail() {
  const { id } = useParams<{ id: string }>();
  const { showSnack } = useSnack();

  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();
    const { signal } = controller;

    // Double shield technique combining browser-level abort with structural render ignore boundary
    let ignore = false;

    setIsLoading(true);
    setError(null);

    const loadSingleBookProfile = async () => {
      try {
        // Aligned with the exact architecture contract: getById
        const fetchedBook = await booksService.getById(id, { signal });

        // Strict Mode protection check before setting local component states
        if (!ignore) {
          setBook(fetchedBook);
          setIsLoading(false);
        }
      } catch (err) {
        // Silently swallow intentional user or system-driven development abort triggers
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        // Only trigger UI modifications if this specific effect cycle hasn't been unmounted
        if (!ignore) {
          const msg =
            err instanceof Error ? err.message : 'Unknown data failure';
          setError(msg);
          setIsLoading(false);
          showSnack(`Error loading book: ${msg}`, SNACK_TYPES.ERROR);
        }
      }
    };

    loadSingleBookProfile();

    // Cleanup pipeline runs immediately when Strict Mode executes its mandatory layout shift cycle
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [id, showSnack]);

  const handleToggleFavorite = async () => {
    if (!book) return;

    const updatedStatus = !book.isFavorite;

    try {
      // Aligned with the exact architecture contract: patch
      await booksService.patch(book.id, { isFavorite: updatedStatus });
      setBook((prev) => (prev ? { ...prev, isFavorite: updatedStatus } : null));

      showSnack(
        updatedStatus
          ? `"${book.title}" added to favorites.`
          : `"${book.title}" removed from favorites.`,
        SNACK_TYPES.SUCCESS
      );
    } catch (err) {
      showSnack(
        'Server failed to synchronize your favorite status.',
        SNACK_TYPES.ERROR
      );
    }
  };

  return {
    book,
    isLoading,
    error,
    handleToggleFavorite,
  };
}
