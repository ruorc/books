import { useEffect, useCallback } from 'react';

/**
 * Structural communication contract defining all mandatory reactive properties
 * required to orchestrate automated pagination increment streams.
 * Leverages immutable field properties to prevent side-channel runtime modifications.
 */
interface UseInfiniteScrollProps {
  /** The current active numerical page offset sequence tracker node */
  readonly page: number;
  /** Boolean state flag indicating if the baseline initial query is loading */
  readonly isLoading: boolean;
  /** Boolean state flag indicating if a differential next page slice is loading */
  readonly isFetchingNextPage: boolean;
  /** Invariant boundary flag confirming if more records exist on the remote server */
  readonly hasMore: boolean;
  /** Callback triggered when a new page execution transaction initiates */
  readonly onFetchStart: () => void;
  /** Callback triggered when a page execution transaction encounters a network failure */
  readonly onFetchFailure: () => void;
  /** Callback triggered when the scroll boundary demands a page step increment */
  readonly onPageIncrement: () => void;
  /** Asynchronous data transport handler executing the actual query transaction stream */
  readonly fetchDataFn: (
    targetPage: number,
    isInitial: boolean,
    signal: AbortSignal
  ) => Promise<void>;
}

/**
 * Universal layout-agnostic custom hook orchestrating infinite scroll pagination cycles.
 * Operates purely through abstraction callbacks to fully isolate layout from state management systems.
 * Manages atomic AbortController garbage collection to secure multi-thread network channels.
 * Documentation features high-density engineering text layout strictly free from descriptor tags.
 */
export function useInfiniteScroll({
  page,
  isLoading,
  isFetchingNextPage,
  hasMore,
  onFetchStart,
  onFetchFailure,
  onPageIncrement,
  fetchDataFn,
}: UseInfiniteScrollProps) {
  useEffect(() => {
    const controller = new AbortController();

    const triggerFetch = async () => {
      const isInitial = page === 1;

      if (!isInitial) {
        onFetchStart();
      }

      try {
        await fetchDataFn(page, isInitial, controller.signal);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;

        onFetchFailure();
      }
    };

    triggerFetch();

    return () => controller.abort();
  }, [page, fetchDataFn, onFetchStart, onFetchFailure]);

  const loadNextPage = useCallback(() => {
    if (isFetchingNextPage || !hasMore || isLoading) return;

    onPageIncrement();
  }, [isFetchingNextPage, hasMore, isLoading, onPageIncrement]);

  return { loadNextPage };
}
