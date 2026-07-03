import { useEffect, useCallback, type Dispatch } from 'react';

/**
 * Permitted action types required by the infinite scroll reducer dispatch contract.
 */
export type InfiniteScrollAction =
  | { type: 'FETCH_NEXT_START' }
  | { type: 'NEXT_PAGE' }
  | { type: 'FETCH_NEXT_SUCCESS' | 'FETCH_NEXT_FAILURE' }; // Included for full lifecycle state cleanup

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

/**
 * Dynamic custom hook orchestrating page increments and network streams for infinite scroll layouts.
 * Ensures strict action dispatch safety and automatic AbortController memory cleanup.
 *
 * @template TAction - The restricted reducer action type, enforcing compatibility with InfiniteScrollAction.
 */
export function useInfiniteScroll<
  TAction extends { type: string } & InfiniteScrollAction,
>({
  page,
  isLoading,
  isFetchingNextPage,
  hasMore,
  dispatch,
  fetchDataFn,
}: UseInfiniteScrollProps<TAction>) {
  // Pure single-responsibility effect: tracks incremental page steps and safely cleans up connections
  useEffect(() => {
    const controller = new AbortController();

    const triggerFetch = async () => {
      // If it's the initial page, let the parent component or service orchestrate baseline load if needed
      const isInitial = page === 1;

      if (!isInitial) {
        dispatch({ type: 'FETCH_NEXT_START' } as TAction);
      }

      try {
        await fetchDataFn(page, isInitial, controller.signal);
      } catch (error) {
        // Prevent clearing state flags if the request was intentionally cancelled by an effect cleanup
        if (error instanceof Error && error.name === 'AbortError') return;

        // Notify reducer about a crash state to safely toggle off the 'isFetchingNextPage' loading overlay
        dispatch({ type: 'FETCH_NEXT_FAILURE' } as TAction);
      }
    };

    triggerFetch();

    return () => controller.abort();
  }, [page, fetchDataFn, dispatch]);

  // Stable, dynamic scroll end-of-list trigger callback
  const loadNextPage = useCallback(() => {
    if (isFetchingNextPage || !hasMore || isLoading) return;

    dispatch({ type: 'NEXT_PAGE' } as TAction);
  }, [isFetchingNextPage, hasMore, isLoading, dispatch]);

  return { loadNextPage };
}
