import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { booksService } from '@/services/booksDataServiceMockApi';
import { useSnack } from '@/providers/SnackProvider';
import { SNACK_TYPES } from '@/constants/snack';
import { ROUTES } from '@/routers/routes';
import type { CatalogFilterType } from '@/types/filter';
import type { Book } from '@/types/book';

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
  const handleFilterRedirect = (
    filterType: CatalogFilterType,
    value: string
  ) => {
    // Generates semantic endpoints e.g., /books?author=F.+Scott+Fitzgerald
    navigate(`${ROUTES.BOOKS}?${filterType}=${encodeURIComponent(value)}`);
  };

  const handleToggleFavorite = async () => {
    const updatedStatus = !localBook.isFavorite;
    try {
      setLocalBook((prev) => ({ ...prev, isFavorite: updatedStatus }));
      await booksService.patch(localBook.id, { isFavorite: updatedStatus });
      showSnack(
        updatedStatus
          ? `"${localBook.title}" added to favorites.`
          : `"${localBook.title}" removed from favorites.`,
        SNACK_TYPES.SUCCESS
      );
    } catch (err) {
      setLocalBook((prev) => ({ ...prev, isFavorite: !updatedStatus }));
      showSnack(
        'Server failed to synchronize your favorite status.',
        SNACK_TYPES.ERROR
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
