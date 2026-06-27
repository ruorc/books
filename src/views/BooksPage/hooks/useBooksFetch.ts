import { useCallback } from 'react';
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

  /**
   * Encapsulates book-specific query filters building pipeline and service network request.
   * Bound tightly to the verified generic getAll method signature.
   */
  const loadBooksData = useCallback(
    async (targetPage: number, isInitial: boolean, signal: AbortSignal) => {
      try {
        // Tied QueryFilters strictly to the Book entity interface shape
        const queryFilters: QueryFilters<Book> = {};

        if (favOnly) queryFilters.isFavorite = true;
        if (search.trim()) queryFilters.search = search.trim();
        if (selectedAuthor) queryFilters.author = selectedAuthor;
        if (selectedYear) queryFilters.year = selectedYear;

        // Fully aligned with the strict interface contract: getAll
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
   * Delegates the raw side-effects management lifecycle directly to the generic scroll engine handler.
   */
  const { loadNextPage } = useInfiniteScroll({
    page: state.page,
    cachedItemsCount: state.booksMap.size,
    isLoading: state.isLoading,
    isFetchingNextPage: state.isFetchingNextPage,
    hasMore: state.hasMore,
    dispatch,
    fetchDataFn: loadBooksData,
    // Collect active search parameters dictionary as a structural dependency bundle
    dependencies: { search, favOnly, selectedAuthor, selectedYear },
  });

  return {
    state,
    dispatch,
    loadNextPage,
  };
}
