import { useCallback, useEffect, useRef } from 'react';
import { useBooksCatalogContext } from '@/views/BooksPage/context/BooksCatalogContext';
import { booksService } from '@/services/booksDataServiceMockApi';
import { BOOKS_PER_PAGE_LIMIT } from '@/constants/ui';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { QueryFilters } from '@/types/api';
import type { Book } from '@/types/book';

interface UseBooksFetchProps {
  search: string;
  favOnly: boolean;
  selectedAuthor?: string;
  selectedYear?: string;
}

export function useBooksFetch({
  search,
  favOnly,
  selectedAuthor,
  selectedYear,
}: UseBooksFetchProps) {
  const { state, dispatch } = useBooksCatalogContext();

  // Ref to hold the active AbortController for the initial request cycle
  const initialAbortRef = useRef<AbortController | null>(null);

  /**
   * Central data transport method fetching explicit page boundaries from the service layer.
   */
  const loadBooksData = useCallback(
    async (targetPage: number, isInitial: boolean, signal: AbortSignal) => {
      try {
        const queryFilters: QueryFilters<Book> = {};

        if (favOnly) queryFilters.isFavorite = true;
        if (search.trim()) queryFilters.search = search.trim();
        if (selectedAuthor) queryFilters.author = selectedAuthor;
        if (selectedYear) queryFilters.year = selectedYear;

        const remoteBooks = (await booksService.getAll(
          targetPage,
          BOOKS_PER_PAGE_LIMIT,
          queryFilters,
          { signal }
        )) as Book[];

        dispatch({
          type: 'FETCH_SUCCESS',
          payload: { remoteBooks, isInitial },
        });
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        dispatch({
          type: 'FETCH_FAILURE',
          payload: err instanceof Error ? err.message : 'Failed to sync data',
        });
      }
    },
    [search, favOnly, selectedAuthor, selectedYear, dispatch]
  );

  /**
   * REACTIVE LIFECYCLE MONITOR:
   * Orchestrates strict state drops and initial fetch triggers whenever filters mutate.
   * This logic is now properly isolated here instead of being hardcoded inside the scrolling engine.
   */
  useEffect(() => {
    // Abort any previous pending initial request to avoid race conditions
    if (initialAbortRef.current) {
      initialAbortRef.current.abort();
    }

    const controller = new AbortController();
    initialAbortRef.current = controller;

    // Cache guard: If we are already on page 1 but maps are empty, or filters changed, fire init
    dispatch({ type: 'FETCH_INIT_START' });
    loadBooksData(1, true, controller.signal);

    return () => {
      controller.abort();
    };
  }, [search, favOnly, selectedAuthor, selectedYear, loadBooksData, dispatch]);

  /**
   * Universal lean infinite scroll engine execution call.
   * Completely decoupled from any product-specific business logic parameters.
   */
  const { loadNextPage } = useInfiniteScroll({
    page: state.page,
    isLoading: state.isLoading,
    isFetchingNextPage: state.isFetchingNextPage,
    hasMore: state.hasMore,
    dispatch,
    fetchDataFn: loadBooksData,
  });

  return {
    state,
    dispatch,
    loadNextPage,
  };
}
