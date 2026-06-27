import { useEffect, useCallback, useRef, type Dispatch } from 'react';

interface UseInfiniteScrollProps<TAction> {
  page: number;
  cachedItemsCount: number;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasMore: boolean;
  dependencies: Record<string, any>;
  dispatch: Dispatch<TAction>;
  fetchDataFn: (
    targetPage: number,
    isInitial: boolean,
    signal: AbortSignal
  ) => Promise<void>;
}

export function useInfiniteScroll<TAction extends { type: string }>({
  page,
  cachedItemsCount,
  isLoading,
  isFetchingNextPage,
  hasMore,
  dependencies,
  dispatch,
  fetchDataFn,
}: UseInfiniteScrollProps<TAction>) {
  const prevDepsRef = useRef<string>('');

  // Serialize dependencies into a single static primitive string
  const currentDepsString = JSON.stringify(dependencies);

  // 1. Core orchestration effect for initial loads and filters mutations
  useEffect(() => {
    const controller = new AbortController();
    const isDepsMutated = prevDepsRef.current !== currentDepsString;

    // Cache guard: If items exist in cache and dependencies remain static, block initial fetch cycle
    if (cachedItemsCount > 0 && !isDepsMutated) {
      return;
    }

    prevDepsRef.current = currentDepsString;

    dispatch({ type: 'FETCH_INIT_START' } as any);
    fetchDataFn(1, true, controller.signal);

    return () => controller.abort();
    // Safely depend on the primitive serialized string representation instead of dynamic arrays
  }, [fetchDataFn, cachedItemsCount, dispatch, currentDepsString]);

  // 2. Incremental pagination workflow tracker effect
  useEffect(() => {
    const controller = new AbortController();

    if (page > 1) {
      dispatch({ type: 'FETCH_NEXT_START' } as any);
      fetchDataFn(page, false, controller.signal);
    }

    return () => controller.abort();
  }, [page, fetchDataFn, dispatch]);

  // 3. Re-bound dynamic infinite scroll trigger callback
  const loadNextPage = useCallback(() => {
    if (isFetchingNextPage || !hasMore || isLoading) return;
    dispatch({ type: 'NEXT_PAGE' } as any);
  }, [isFetchingNextPage, hasMore, isLoading, dispatch]);

  return { loadNextPage };
}
