import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { booksService } from '@/services/booksDataServiceMockApi';
import { useSnack } from '@/providers/SnackProvider';
import { SNACK_TYPES } from '@/constants/snack';
import { ROUTES } from '@/routers/routes';
import type { CatalogFilterType } from '@/types/filter';
import type { Book } from '@/types/book';

/**
 * Consolidated controller hook managing single entity interactions and modal tracking parameters.
 */
export function useBookDetailPageLogic(initialBook: Book) {
  const [localBook, setLocalBook] = useState<Book>(initialBook);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { showSnack } = useSnack();
  const navigate = useNavigate();

  // REACTIVE MONITOR: Synchronizes the internal state whenever the router loader pushes fresh data profiles
  useEffect(() => {
    setLocalBook(initialBook);
  }, [initialBook]);

  const handleBackToCatalog = () => navigate(ROUTES.BOOKS);

  const handleFilterRedirect = (
    filterType: CatalogFilterType,
    value: string
  ) => {
    navigate(ROUTES.BOOKS, { state: { filterType, filterValue: value } });
  };

  const handleToggleFavorite = async () => {
    const updatedStatus = !localBook.isFavorite;
    try {
      // Optimistic Update: instantly toggle visual state layer
      setLocalBook((prev) => ({ ...prev, isFavorite: updatedStatus }));

      await booksService.patch(localBook.id, { isFavorite: updatedStatus });

      showSnack(
        updatedStatus
          ? `"${localBook.title}" added to favorites.`
          : `"${localBook.title}" removed from favorites.`,
        SNACK_TYPES.SUCCESS
      );
    } catch (err) {
      // Error Rollback: revert field properties if network drops
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
