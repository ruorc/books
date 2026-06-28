import { useState } from 'react';
import {
  useBooksCatalogContext,
  type CatalogState,
} from '../context/BooksCatalogContext'; // Imported CatalogState definition type
import { useSnack } from '@/providers/SnackProvider';
import { SNACK_TYPES } from '@/constants/snack';
import { booksService } from '@/services/booksDataServiceMockApi';
import type { BookPayload } from '@/types/book';

/**
 * Custom hook isolating states and action side-effects for the main BooksPage view layer.
 */
export function useBooksPageLogic() {
  const { state: catalogState, dispatch } = useBooksCatalogContext();
  const { showSnack } = useSnack();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handles asynchronous entity creation workflow streaming responses into global contexts.
   */
  const handleCreateBookSubmit = async (
    newBookData: Omit<BookPayload, 'isFavorite'>
  ) => {
    setIsSubmitting(true);
    try {
      const createdBook = await booksService.create(newBookData);
      dispatch({ type: 'LOCAL_ADD_BOOK', payload: createdBook });
      showSnack(
        `"${createdBook.title}" successfully added to catalog.`,
        SNACK_TYPES.SUCCESS
      );
      setIsAddModalOpen(false);
    } catch (err) {
      showSnack(
        'Failed to register a new book record on the server.',
        SNACK_TYPES.ERROR
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Dispatches unified filters updates directly to the central catalog reducer core.
   * Fixed type evaluation bug by matching the arguments mapping to partial CatalogState attributes dictionary.
   */
  const handleUpdateAdvancedFilters = (
    updatedFields: Partial<CatalogState>
  ) => {
    dispatch({ type: 'SET_ADVANCED_FILTERS', payload: updatedFields });
  };

  return {
    catalogState,
    dispatch,
    isAddModalOpen,
    setIsAddModalOpen,
    isSearchModalOpen,
    setIsSearchModalOpen,
    isSubmitting,
    handleCreateBookSubmit,
    handleUpdateAdvancedFilters,
  };
}
