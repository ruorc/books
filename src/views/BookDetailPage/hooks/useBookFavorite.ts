import { useState } from 'react';
import { booksService } from '@/services';
import { useSnack } from '@/context/Snack';
import { SNACKS } from '@/context/Snack/constants/snackConstants';
import type { Book } from '@/views/BooksDomain/types/book';

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

      await booksService.patch(book.bookId, { isFavorite: updatedStatus });

      showSnack(
        updatedStatus
          ? `"${book.title}" added to favorites.`
          : `"${book.title}" removed from favorites.`,
        SNACKS.SUCCESS
      );
    } catch (err) {
      // Rollback: revert state properties if the network request fails
      setBook((prev) => ({ ...prev, isFavorite: !updatedStatus }));

      showSnack(
        'Server failed to synchronize your favorite status.',
        SNACKS.ERROR
      );
    }
  };

  return { book, handleToggleFavorite };
}
