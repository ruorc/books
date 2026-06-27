import { useState } from 'react';
import { booksService } from '@/services/booksDataServiceMockApi';
import { useSnack } from '@/providers/SnackProvider';
import { SNACK_TYPES } from '@/constants/snack';
import type { Book } from '@/types/book';

/**
 * Custom hook encapsulating optimistic favorite synchronization logic for a single book.
 */
export function useBookFavorite(initialBook: Book) {
  const [book, setBook] = useState<Book>(initialBook);
  const { showSnack } = useSnack();

  const handleToggleFavorite = async () => {
    const updatedStatus = !book.isFavorite;

    try {
      // Optimistic Update: instantly mutate state to secure fast feedback loop
      setBook((prev) => ({ ...prev, isFavorite: updatedStatus }));

      await booksService.patch(book.id, { isFavorite: updatedStatus });

      showSnack(
        updatedStatus
          ? `"${book.title}" added to favorites.`
          : `"${book.title}" removed from favorites.`,
        SNACK_TYPES.SUCCESS
      );
    } catch (err) {
      // Rollback: revert state properties if the network request fails
      setBook((prev) => ({ ...prev, isFavorite: !updatedStatus }));

      showSnack(
        'Server failed to synchronize your favorite status.',
        SNACK_TYPES.ERROR
      );
    }
  };

  return { book, handleToggleFavorite };
}
