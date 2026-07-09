import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useBooksCatalogContext,
  type CatalogState,
} from '../context/BooksCatalogContext';
import { useSnack } from '@/context/Snack';
import { SNACKS } from '@/context/Snack/constants/snackConstants';
import {
  SORT_FIELDS,
  SORT_DIRECTIONS,
} from '@/views/BooksDomain/constants/booksConstants'; // Cleaned up: removed unused FILTER_TYPES
import { booksService } from '@/services';
import type { BookPayload } from '@/views/BooksDomain/types/book';

export function useBooksPageLogic() {
  const { state: catalogState, dispatch } = useBooksCatalogContext();
  const { showSnack } = useSnack();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * ON-MOUNT URL SYNCHRONIZER:
   * Reads raw native search queries (?author=...&year=...) straight from the browser address bar
   * upon mount and injects them atomically inside the global context state reducer.
   */
  useEffect(() => {
    const authorParam = searchParams.get('author') || '';
    const yearParam = searchParams.get('year') || '';

    if (authorParam || yearParam) {
      dispatch({
        type: 'SET_ADVANCED_FILTERS',
        payload: {
          author: authorParam,
          year: yearParam,
          globalSearch: '',
          titleSearch: '',
        },
      });
      // Clear URL parameters to keep address string sterile after successful context injection
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, dispatch, setSearchParams]);

  const handleCreateBookSubmit = async (
    newBookData: Omit<BookPayload, 'isFavorite'>
  ) => {
    setIsSubmitting(true);
    try {
      const createdBook = await booksService.create(newBookData);
      dispatch({ type: 'LOCAL_ADD_BOOK', payload: createdBook });
      showSnack(
        `"${createdBook.title}" successfully added to catalog.`,
        SNACKS.SUCCESS
      );
      setIsAddModalOpen(false);
    } catch (err) {
      showSnack(
        'Failed to register a new book record on the server.',
        SNACKS.ERROR
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

  const handleClearAllFilters = () => {
    dispatch({
      type: 'SET_ADVANCED_FILTERS',
      payload: {
        globalSearch: '',
        titleSearch: '',
        author: '',
        year: '',
        sortField: SORT_FIELDS.CREATED_AT,
        sortDirection: SORT_DIRECTIONS.DESC,
      },
    });
    showSnack('All active search filters successfully cleared.', SNACKS.INFO);
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
