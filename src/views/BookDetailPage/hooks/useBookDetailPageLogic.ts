import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { booksService } from '@/services';
import { useSnack } from '@/context/Snack';
import { SNACKS } from '@/context/Snack/constants/snackConstants';
import { ROUTES } from '@/router/routes';
import type { BookFilterField } from '@/types/booksFilter';
import type { Book } from '@/views/BooksDomain/types/book';

export function useBookDetailPageLogic(initialBook: Book) {
  const [localBook, setLocalBook] = useState<Book>(initialBook);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { showSnack } = useSnack();
  const navigate = useNavigate();

  useEffect(() => {
    setLocalBook(initialBook);
  }, [initialBook]);

  const handleBackToCatalog = () => navigate(ROUTES.BOOKS);

  /**
   * FIXED: Dispatches formal native browser query strings (?author=Value)
   * to guarantee zero-race execution steps during multi-page context shifts.
   */
  const handleFilterRedirect = (filterType: BookFilterField, value: string) => {
    // Generates semantic endpoints e.g., /books?author=F.+Scott+Fitzgerald
    navigate(`${ROUTES.BOOKS}?${filterType}=${encodeURIComponent(value)}`);
  };

  const handleToggleFavorite = async () => {
    const updatedStatus = !localBook.isFavorite;
    try {
      setLocalBook((prev) => ({ ...prev, isFavorite: updatedStatus }));
      await booksService.patch(localBook.bookId, { isFavorite: updatedStatus });
      showSnack(
        updatedStatus
          ? `"${localBook.title}" added to favorites.`
          : `"${localBook.title}" removed from favorites.`,
        SNACKS.SUCCESS
      );
    } catch (err) {
      setLocalBook((prev) => ({ ...prev, isFavorite: !updatedStatus }));
      showSnack(
        'Server failed to synchronize your favorite status.',
        SNACKS.ERROR
      );
    }
  };

  return {
    localBook,
    isEditModalOpen,
    setIsEditModalOpen,
    handleBackToCatalog,
    handleFilterRedirect,
    handleToggleFavorite,
  };
}
