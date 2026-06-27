import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { booksService } from '@/services/booksDataServiceMockApi';
import { useSnack } from '@/providers/SnackProvider';
import { SNACK_TYPES } from '@/constants/snack';
import { ROUTES } from '@/routers/routes';
import type { CatalogFilterType } from '@/types/filter';
import type { Book, BookPayload } from '@/types/book';

/**
 * Consolidated controller hook managing single entity interactions and modal tracking parameters.
 */
export function useBookDetailPageLogic(initialBook: Book) {
  const [localBook, setLocalBook] = useState<Book>(initialBook);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { showSnack } = useSnack();
  const navigate = useNavigate();

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

  const handleEditBookSubmit = async (
    updatedFields: Omit<BookPayload, 'isFavorite'>
  ) => {
    setIsUpdating(true);
    try {
      const savedBook = await booksService.update(localBook.id, updatedFields);
      setLocalBook(savedBook);
      showSnack(
        `"${savedBook.title}" was successfully updated.`,
        SNACK_TYPES.SUCCESS
      );
      setIsEditModalOpen(false);
    } catch (err) {
      showSnack(
        'Failed to synchronize book modifications with the server.',
        SNACK_TYPES.ERROR
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    localBook,
    isEditModalOpen,
    setIsEditModalOpen,
    isUpdating,
    handleBackToCatalog,
    handleFilterRedirect,
    handleToggleFavorite,
    handleEditBookSubmit,
  };
}
