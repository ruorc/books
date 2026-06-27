import { useEffect, useCallback, type Dispatch } from 'react';

interface UseInfiniteScrollProps<TAction> {
  page: number;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasMore: boolean;
  dispatch: Dispatch<TAction>;
  fetchDataFn: (
    targetPage: number,
    isInitial: boolean,
    signal: AbortSignal
  ) => Promise<void>;
}

export function useInfiniteScroll<TAction extends { type: string }>({
  page,
  isLoading,
  isFetchingNextPage,
  hasMore,
  dispatch,
  fetchDataFn,
}: UseInfiniteScrollProps<TAction>) {
  // Pure single-responsibility effect: tracks ONLY incremental page steps (page > 1)
  useEffect(() => {
    const controller = new AbortController();

    if (page > 1) {
      dispatch({ type: 'FETCH_NEXT_START' } as any);
      fetchDataFn(page, false, controller.signal);
    }

    return () => controller.abort();
  }, [page, fetchDataFn, dispatch]);

  // Stable, dynamic scroll end-of-list trigger callback
  const loadNextPage = useCallback(() => {
    if (isFetchingNextPage || !hasMore || isLoading) return;
    dispatch({ type: 'NEXT_PAGE' } as any);
  }, [isFetchingNextPage, hasMore, isLoading, dispatch]);

  return { loadNextPage };
}
