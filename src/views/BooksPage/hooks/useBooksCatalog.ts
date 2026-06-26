import { useEffect, useMemo, useCallback, useReducer } from 'react';
import { booksService } from '@/services/booksDataServiceMockApi';
import { BOOKS_PER_PAGE_LIMIT } from '@/constants/ui';
import { useConfirm } from '@/providers/ConfirmProvider';
import { useSnack } from '@/providers/SnackProvider';
import { SNACK_TYPES } from '@/constants/snack';
import type { Book } from '@/types/book';
import type { QueryFilters } from '@/types/api';

interface UseBooksCatalogProps {
  search: string;
  favOnly: boolean;
  selectedAuthor?: string;
  selectedYear?: string;
}

interface CatalogState {
  booksMap: Map<string, Book>;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
}

type CatalogAction =
  | { type: 'FETCH_INIT_START' }
  | { type: 'FETCH_NEXT_START' }
  | {
      type: 'FETCH_SUCCESS';
      payload: { remoteBooks: Book[]; isInitial: boolean };
    }
  | { type: 'FETCH_FAILURE'; payload: string }
  | { type: 'NEXT_PAGE' }
  | { type: 'DELETE_BOOK'; payload: string }
  | { type: 'TOGGLE_FAVORITE'; payload: { id: string; isFavorite: boolean } };

const initialState: CatalogState = {
  booksMap: new Map(),
  isLoading: true,
  isFetchingNextPage: false,
  error: null,
  page: 1,
  hasMore: true,
};

function catalogReducer(
  state: CatalogState,
  action: CatalogAction
): CatalogState {
  switch (action.type) {
    case 'FETCH_INIT_START':
      return {
        ...state,
        isLoading: true,
        error: null,
        page: 1,
        hasMore: true,
        booksMap: new Map(),
      };
    case 'FETCH_NEXT_START':
      return {
        ...state,
        isFetchingNextPage: true,
        error: null,
      };
    case 'FETCH_SUCCESS': {
      const { remoteBooks, isInitial } = action.payload;
      const nextMap = isInitial ? new Map() : new Map(state.booksMap);
      remoteBooks.forEach((book) => nextMap.set(book.id, book));

      return {
        ...state,
        booksMap: nextMap,
        isLoading: false,
        isFetchingNextPage: false,
        hasMore: remoteBooks.length === BOOKS_PER_PAGE_LIMIT,
      };
    }
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isFetchingNextPage: false,
        error: action.payload,
      };
    case 'NEXT_PAGE':
      return {
        ...state,
        page: state.page + 1,
      };
    case 'DELETE_BOOK': {
      const nextMap = new Map(state.booksMap);
      nextMap.delete(action.payload);
      return { ...state, booksMap: nextMap };
    }
    case 'TOGGLE_FAVORITE': {
      const { id, isFavorite } = action.payload;
      const nextMap = new Map(state.booksMap);
      const target = nextMap.get(id);
      if (target) {
        nextMap.set(id, { ...target, isFavorite });
      }
      return { ...state, booksMap: nextMap };
    }
    default:
      return state;
  }
}

export function useBooksCatalog({
  search,
  favOnly,
  selectedAuthor,
  selectedYear,
}: UseBooksCatalogProps) {
  const [state, dispatch] = useReducer(catalogReducer, initialState);

  const { showConfirm } = useConfirm();
  const { showSnack } = useSnack();

  // Side effect triggering initial data loading on filters mutations sequence shifts
  useEffect(() => {
    // Instantiate a fresh controller wrapper boundary for this specific run execution loop
    const controller = new AbortController();
    const { signal } = controller;

    dispatch({ type: 'FETCH_INIT_START' });

    const executeInitialFetch = async () => {
      try {
        const queryFilters: QueryFilters = {};
        if (favOnly) queryFilters.isFavorite = true;
        if (search.trim()) queryFilters.search = search.trim();
        if (selectedAuthor) queryFilters.author = selectedAuthor;
        if (selectedYear) queryFilters.year = selectedYear;

        // Forward the specific abort signal reference into the infrastructure layer
        const remoteBooks = await booksService.getAllBooks(
          1,
          BOOKS_PER_PAGE_LIMIT,
          queryFilters,
          { signal }
        );

        dispatch({
          type: 'FETCH_SUCCESS',
          payload: { remoteBooks, isInitial: true },
        });
      } catch (err) {
        // Intercept clean user-triggered browser abort actions silently without pushing error indicators
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        const msg = err instanceof Error ? err.message : 'Failed to sync data';
        dispatch({ type: 'FETCH_FAILURE', payload: msg });
        showSnack(`Network error: ${msg}`, SNACK_TYPES.ERROR);
      }
    };

    executeInitialFetch();

    // Kill the pending connection flow instantly if dependencies change mid-flight
    return () => {
      controller.abort();
    };
  }, [search, favOnly, selectedAuthor, selectedYear, showSnack]);

  // Side effect executing incremental pagination fetching routines when page changes (> 1)
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    if (state.page > 1) {
      dispatch({ type: 'FETCH_NEXT_START' });

      const executeNextPageFetch = async () => {
        try {
          const queryFilters: QueryFilters = {};
          if (favOnly) queryFilters.isFavorite = true;
          if (search.trim()) queryFilters.search = search.trim();
          if (selectedAuthor) queryFilters.author = selectedAuthor;
          if (selectedYear) queryFilters.year = selectedYear;

          // Forward the specific abort signal reference into the infrastructure layer
          const remoteBooks = await booksService.getAllBooks(
            state.page,
            BOOKS_PER_PAGE_LIMIT,
            queryFilters,
            { signal }
          );

          dispatch({
            type: 'FETCH_SUCCESS',
            payload: { remoteBooks, isInitial: false },
          });
        } catch (err) {
          if (err instanceof Error && err.name === 'AbortError') {
            return;
          }
          const msg =
            err instanceof Error ? err.message : 'Failed to sync data';
          dispatch({ type: 'FETCH_FAILURE', payload: msg });
          showSnack(`Network error: ${msg}`, SNACK_TYPES.ERROR);
        }
      };

      executeNextPageFetch();
    }

    return () => {
      controller.abort();
    };
  }, [state.page, search, favOnly, selectedAuthor, selectedYear, showSnack]);

  const loadNextPage = useCallback(() => {
    if (state.isFetchingNextPage || !state.hasMore || state.isLoading) return;
    dispatch({ type: 'NEXT_PAGE' });
  }, [state.isFetchingNextPage, state.hasMore, state.isLoading]);

  const handleDeleteBook = async (id: string) => {
    const targetBook = state.booksMap.get(id);
    const bookTitle = targetBook ? `"${targetBook.title}"` : 'this book';

    const isConfirmed = await showConfirm({
      title: 'Delete Book Record',
      description: `Are you absolutely sure you want to delete ${bookTitle}?`,
      confirmLabel: 'Delete permanently',
      cancelLabel: 'Keep book',
      isDanger: true,
    });

    if (!isConfirmed) return;

    try {
      await booksService.deleteBook(id);
      dispatch({ type: 'DELETE_BOOK', payload: id });
      showSnack(`${bookTitle} was successfully deleted.`, SNACK_TYPES.SUCCESS);
    } catch (err) {
      showSnack(
        err instanceof Error ? err.message : 'Server rejected deletion.',
        SNACK_TYPES.ERROR
      );
    }
  };

  const handleToggleFavorite = async (id: string) => {
    const targetBook = state.booksMap.get(id);
    if (!targetBook) return;

    const updatedStatus = !targetBook.isFavorite;

    try {
      await booksService.patchBook(id, { isFavorite: updatedStatus });
      dispatch({
        type: 'TOGGLE_FAVORITE',
        payload: { id, isFavorite: updatedStatus },
      });

      showSnack(
        updatedStatus
          ? `"${targetBook.title}" bookmarked.`
          : `"${targetBook.title}" unbookmarked.`,
        SNACK_TYPES.SUCCESS
      );
    } catch (err) {
      showSnack(
        'Server failed to synchronize your favorite status.',
        SNACK_TYPES.ERROR
      );
    }
  };

  const filteredBooks = useMemo(() => {
    return Array.from(state.booksMap.values());
  }, [state.booksMap]);

  return {
    filteredBooks,
    isLoading: state.isLoading,
    isFetchingNextPage: state.isFetchingNextPage,
    hasMore: state.hasMore,
    error: state.error,
    loadNextPage,
    handleDeleteBook,
    handleToggleFavorite,
  };
}
