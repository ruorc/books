import { useMemo, useState, useCallback } from 'react';
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
  const { state, loadNextPage } = useBooksFetch(props);

  // Micro-state version counter forcing clean client-side re-renders upon direct cache mutations
  const [, setListVersion] = useState(0);
  const forceListUpdate = useCallback(() => setListVersion((v) => v + 1), []);

  // Connected direct actions mapped with stable state triggers
  const { handleDeleteBook, handleToggleFavorite } = useBooksActions({
    booksMap: state.booksMap,
    triggerListUpdate: forceListUpdate,
  });

  const filteredBooks = useMemo(() => {
    const allBooks = Array.from(state.booksMap.values());
    const normalizedSearch = search.trim().toLowerCase();

    return allBooks.filter((book) => {
      if (normalizedSearch) {
        const matchesTitle = book.title
          .toLowerCase()
          .includes(normalizedSearch);
        const matchesAuthor = book.author
          .toLowerCase()
          .includes(normalizedSearch);
        if (!matchesTitle && !matchesAuthor) return false;
      }

      if (favOnly && !book.isFavorite) return false;
      if (selectedAuthor && book.author !== selectedAuthor) return false;
      if (selectedYear && book.year !== selectedYear) return false;

      return true;
    });
    // Connected local list state version counter as a reactive dependency link
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
