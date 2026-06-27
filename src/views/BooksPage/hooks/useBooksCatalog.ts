import { useMemo } from 'react';
import { useBooksFetch } from './useBooksFetch';
import { useBooksActions } from './useBooksActions';

interface UseBooksCatalogProps {
  search: string;
  favOnly: boolean;
  selectedAuthor?: string;
  selectedYear?: string;
}

export function useBooksCatalog(props: UseBooksCatalogProps) {
  const { search, favOnly, selectedAuthor, selectedYear } = props;

  // Forward the active configuration dictionary straight into the data layer hook
  const { state, dispatch, loadNextPage } = useBooksFetch(props);

  const { handleDeleteBook, handleToggleFavorite } = useBooksActions({
    booksMap: state.booksMap,
    dispatch,
  });

  /**
   * Safe and reactive client-side filtering engine.
   * Ensures instant interface response even during background network synchronization cycles.
   */
  const filteredBooks = useMemo(() => {
    const allBooks = Array.from(state.booksMap.values());
    const normalizedSearch = search.trim().toLowerCase();

    return allBooks.filter((book) => {
      // 1. Full-text search criteria matching title or author
      if (normalizedSearch) {
        const matchesTitle = book.title
          .toLowerCase()
          .includes(normalizedSearch);
        const matchesAuthor = book.author
          .toLowerCase()
          .includes(normalizedSearch);
        if (!matchesTitle && !matchesAuthor) return false;
      }

      // 2. Local storage driven favorite criteria toggle matching
      if (favOnly && !book.isFavorite) {
        return false;
      }

      // 3. Metadata explicit author query selection matching
      if (selectedAuthor && book.author !== selectedAuthor) {
        return false;
      }

      // 4. Metadata explicit publication year query selection matching
      if (selectedYear && book.year !== selectedYear) {
        return false;
      }

      return true;
    });
  }, [state.booksMap, search, favOnly, selectedAuthor, selectedYear]);

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
