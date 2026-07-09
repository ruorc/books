import { useCallback, useEffect, useRef } from 'react';
import { useBooksCatalogContext } from '@/views/BooksPage/context/BooksCatalogContext';
import { booksService } from '@/services';
import { BOOKS_PER_PAGE_LIMIT } from '@/views/BooksDomain/constants/booksConstants';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { QueryFilters } from '@/types/api';
import type { Book } from '@/views/BooksDomain/types/book';

export function useBooksFetch() {
  const { state, dispatch } = useBooksCatalogContext();
  const initialAbortRef = useRef<AbortController | null>(null);

  /**
   * Central data transport method fetching sorted boundaries from the server.
   */
  const loadBooksData = useCallback(
    async (targetPage: number, isInitial: boolean, signal: AbortSignal) => {
      try {
        // Build the filters object directly aligned with MockAPI query specs
        const queryFilters: QueryFilters = {};

        // 1. Pass active target filtering parameters
        if (state.favOnly) queryFilters.isFavorite = 'true';
        if (state.globalSearch.trim())
          queryFilters.search = state.globalSearch.trim();
        if (state.author.trim()) queryFilters.author = state.author.trim();
        if (state.year.trim()) queryFilters.year = state.year.trim();

        // 2. Inject NATIVE Server-side sorting parameters backed by MockAPI
        queryFilters.sortBy = state.sortField;
        queryFilters.order = state.sortDirection;

        // Execute unified fetch matching our interface signature
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
    // Track sorting and search primitives directly to update callbacks memoization
    [
      state.globalSearch,
      state.favOnly,
      state.author,
      state.year,
      state.sortField,
      state.sortDirection,
      dispatch,
    ]
  );

  // Trigger drop and reload initial page whenever ANY filter or sorting metrics change
  useEffect(() => {
    if (initialAbortRef.current) initialAbortRef.current.abort();
    const controller = new AbortController();
    initialAbortRef.current = controller;

    dispatch({ type: 'FETCH_INIT_START' });
    loadBooksData(1, true, controller.signal);

    return () => controller.abort();
  }, [
    state.globalSearch,
    state.titleSearch,
    state.author,
    state.year,
    state.favOnly,
    state.sortField,
    state.sortDirection,
    loadBooksData,
    dispatch,
  ]);

  const { loadNextPage } = useInfiniteScroll({
    page: state.page,
    isLoading: state.isLoading,
    isFetchingNextPage: state.isFetchingNextPage,
    hasMore: state.hasMore,
    dispatch,
    fetchDataFn: loadBooksData,
  });

  return { state, dispatch, loadNextPage };
}
