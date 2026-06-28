import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBooksCatalogContext } from '../context/BooksCatalogContext';
import { useSnack } from '@/providers/SnackProvider';
import { FAVORITES_FILTER_KEY, FILTER_TYPES } from '@/constants/ui';
import { SNACK_TYPES } from '@/constants/snack';
import { booksService } from '@/services/booksDataServiceMockApi';
import type { CatalogFilterType } from '@/types/filter';
import type { BookPayload } from '@/types/book';

interface RouterLocationState {
  filterType?: CatalogFilterType;
  filterValue?: string;
}

export function useBooksPageLogic() {
  const { state: catalogState, dispatch } = useBooksCatalogContext();
  const { showSnack } = useSnack();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // REACTIVE LIFECYCLE MONITOR: Intercepts cross-linking filter events from the book profile view
  useEffect(() => {
    const routerState = location.state as RouterLocationState;
    if (!routerState || !routerState.filterType || !routerState.filterValue)
      return;

    const { filterType, filterValue } = routerState;

    // Aligned the state dropped variables strictly with the new server-side fields schema
    if (filterType === FILTER_TYPES.AUTHOR) {
      dispatch({
        type: 'SET_ADVANCED_FILTERS',
        payload: {
          authorSearch: filterValue,
          globalSearch: '',
          titleSearch: '',
          yearSearch: '',
        },
      });
    } else if (filterType === FILTER_TYPES.YEAR) {
      dispatch({
        type: 'SET_ADVANCED_FILTERS',
        payload: {
          yearSearch: filterValue,
          globalSearch: '',
          titleSearch: '',
          authorSearch: '',
        },
      });
    }

    // Instantly wipe history state to avoid sticky loops on reload
    navigate(location.pathname, { replace: true, state: {} });
  }, [location, navigate, dispatch]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_FILTER_KEY, String(catalogState.favOnly));
  }, [catalogState.favOnly]);

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
    updatedFields: Partial<typeof catalogState>
  ) => {
    dispatch({ type: 'SET_ADVANCED_FILTERS', payload: updatedFields });
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
  };
}
