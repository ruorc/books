import { useState } from 'react';
import {
  useBooksCatalogContext,
  type CatalogState,
} from '../context/BooksCatalogContext';
import { useSnack } from '@/providers/SnackProvider';
import { SNACK_TYPES } from '@/constants/snack';
import { SORT_FIELDS, SORT_DIRECTIONS } from '@/constants/ui'; // Imported sorting fields
import { booksService } from '@/services/booksDataServiceMockApi';
import type { BookPayload } from '@/types/book';

export function useBooksPageLogic() {
  const { state: catalogState, dispatch } = useBooksCatalogContext();
  const { showSnack } = useSnack();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleUpdateAdvancedFilters = (
    updatedFields: Partial<CatalogState>
  ) => {
    dispatch({ type: 'SET_ADVANCED_FILTERS', payload: updatedFields });
  };

  /**
   * Atomic macro trigger flushing out all active query states parameters
   * straight from the layout dashboard without entering modals bounds.
   */
  const handleClearAllFilters = () => {
    dispatch({
      type: 'SET_ADVANCED_FILTERS',
      payload: {
        globalSearch: '',
        titleSearch: '',
        authorSearch: '',
        yearSearch: '',
        sortField: SORT_FIELDS.CREATED_AT,
        sortDirection: SORT_DIRECTIONS.DESC,
      },
    });
    showSnack(
      'All active search filters successfully cleared.',
      SNACK_TYPES.INFO
    );
  };

  return {
    catalogState,
    isAddModalOpen,
    setIsAddModalOpen,
    isSearchModalOpen,
    setIsSearchModalOpen,
    isSubmitting,
    handleCreateBookSubmit,
    handleUpdateAdvancedFilters,
    handleClearAllFilters,
  };
}
