import { useMemo } from 'react';
import { useBooksFetch } from './useBooksFetch';
import { useBooksActions } from './useBooksActions';

/**
 * Custom facade hook co-ordinating server-side fetched data streams
 * alongside local client mutation event pipes.
 */
export function useBooksCatalog() {
  // Pull states controlled directly by the server-side streaming fetch hook
  const { state, dispatch, loadNextPage } = useBooksFetch();

  const { handleDeleteBook, handleToggleFavorite } = useBooksActions({
    booksMap: state.booksMap,
    triggerListUpdate: () =>
      dispatch({ type: 'SET_ADVANCED_FILTERS', payload: {} }),
  });

  /**
   * Lean memory-efficient client layout.
   * Server has already sorted and queried the data boundaries.
   */
  const filteredBooks = useMemo(() => {
    const allBooks = Array.from(state.booksMap.values());
    const normTitle = state.titleSearch.trim().toLowerCase();

    // Client only handles fine-grained targeted title filtering if specified
    return allBooks.filter((book) => {
      if (normTitle && !book.title.toLowerCase().includes(normTitle)) {
        return false;
      }
      return true;
    });
  }, [state.booksMap, state.titleSearch]);

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
