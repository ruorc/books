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
  // Destructured the dispatch pipeline straight from the shared catalog context
  const { dispatch } = useBooksCatalogContext();
  const { showSnack } = useSnack();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuthorState, setSelectedAuthor] = useState('');
  const [selectedYearState, setSelectedYear] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(() => {
    const saved = localStorage.getItem(FAVORITES_FILTER_KEY);
    return saved === 'true';
  });

  useEffect(() => {
    const routerState = location.state as RouterLocationState;
    if (!routerState || !routerState.filterType || !routerState.filterValue)
      return;

    const { filterType, filterValue } = routerState;

    if (filterType === FILTER_TYPES.AUTHOR) {
      setSelectedAuthor(filterValue);
      setSearchQuery('');
    } else if (filterType === FILTER_TYPES.YEAR) {
      setSelectedYear(filterValue);
      setSearchQuery('');
    }

    navigate(location.pathname, { replace: true, state: {} });
  }, [location, navigate]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_FILTER_KEY, String(showFavoritesOnly));
  }, [showFavoritesOnly]);

  const handleCreateBookSubmit = async (
    newBookData: Omit<BookPayload, 'isFavorite'>
  ) => {
    setIsSubmitting(true);
    try {
      const createdBook = await booksService.create(newBookData);

      // Dispatched the clean immutable action to trigger immediate down-tree rendering
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

  return {
    searchQuery,
    setSearchQuery,
    selectedAuthorState,
    setSelectedAuthor,
    selectedYearState,
    setSelectedYear,
    showFavoritesOnly,
    setShowFavoritesOnly,
    isAddModalOpen,
    setIsAddModalOpen,
    isSubmitting,
    handleCreateBookSubmit,
  };
}
