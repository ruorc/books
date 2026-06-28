import { useEffect, useRef } from 'react';
import { AlertCircle, Inbox } from 'lucide-react';
import { BookCard } from '@/components/BookCard';
import PageLoader from '@/components/PageLoader';
import { useBooksCatalog } from '@/views/BooksPage/hooks/useBooksCatalog';
import { useBooksCatalogContext } from './context/BooksCatalogContext';

export function FuncCatalog() {
  const { dispatch: catalogDispatch } = useBooksCatalogContext();

  // Fixed: Invoking the facade hook completely parameterless
  const {
    filteredBooks,
    isLoading,
    isFetchingNextPage,
    hasMore,
    error,
    loadNextPage,
    handleDeleteBook,
    handleToggleFavorite,
  } = useBooksCatalog();

  const observerTargetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = observerTargetRef.current;
    if (!target || !hasMore || isLoading || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loadNextPage, hasMore, isLoading, isFetchingNextPage]);

  if (isLoading) return <PageLoader className="h-[30vh]" />;

  if (error) {
    return (
      <div
        className="mb-4 flex border border-red-200 bg-red-50 p-4 text-sm text-red-800 rounded-xl transition-none! dark:border-red-900 dark:bg-gray-800 dark:text-red-400"
        role="alert"
      >
        <AlertCircle className="me-3 inline h-5 w-5 shrink-0" />
        <div>
          <span className="font-medium">Catalog Error:</span> {error}
        </div>
      </div>
    );
  }

  if (filteredBooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border border-gray-200 bg-white p-12 text-center rounded-xl transition-none! dark:border-gray-700 dark:bg-gray-900/40">
        <Inbox className="mb-3 h-12 w-12 text-gray-400" />
        <p className="text-lg font-bold text-gray-900 dark:text-white">
          No books found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            isFavorite={book.isFavorite}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDeleteBook}
            onAuthorClick={(author: string) =>
              catalogDispatch({
                type: 'SET_ADVANCED_FILTERS',
                payload: { authorSearch: author },
              })
            }
            onYearClick={(year: string) =>
              catalogDispatch({
                type: 'SET_ADVANCED_FILTERS',
                payload: { yearSearch: year },
              })
            }
          />
        ))}
      </div>

      <div
        ref={observerTargetRef}
        className="flex h-10 w-full items-center justify-center"
      >
        {isFetchingNextPage && (
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600 transition-none! dark:border-slate-700 dark:border-t-indigo-400" />
        )}
      </div>
    </div>
  );
}
