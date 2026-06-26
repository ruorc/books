import { useEffect, useRef } from 'react';
import { AlertCircle, Inbox } from 'lucide-react';
import { BookCard } from '@/components/BookCard';
import PageLoader from '@/components/PageLoader';
import { useBooksCatalog } from '@/views/BooksPage/hooks/useBooksCatalog';

// Update the interface to include new filter states and selection handlers
interface FuncCatalogProps {
  search: string;
  favOnly: boolean;
  selectedAuthor?: string; // Target filtered author state passed from parent
  selectedYear?: string;   // Target filtered publication year state passed from parent
  onSelectAuthor: (author: string) => void; // Handler to bubble up selected author
  onSelectYear: (year: string) => void;     // Handler to bubble up selected year
}

export function FuncCatalog({ 
  search, 
  favOnly, 
  selectedAuthor, // Destructure the missing properties safely here
  selectedYear, 
  onSelectAuthor, 
  onSelectYear 
}: FuncCatalogProps) {
  
  // Extract background pagination triggers, passing new filtering parameters down into the hook
  const {
    filteredBooks,
    isLoading,
    isFetchingNextPage,
    hasMore,
    error,
    loadNextPage,
    handleDeleteBook,
    handleToggleFavorite,
  } = useBooksCatalog({ search, favOnly, selectedAuthor, selectedYear });

  // Node reference hook to mount viewport intersections observer tracking
  const observerTargetRef = useRef<HTMLDivElement>(null);

  // Re-bind network events stream onto the scroll tracker element node
  useEffect(() => {
    const target = observerTargetRef.current;
    if (!target || !hasMore || isLoading) return;

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
  }, [loadNextPage, hasMore, isLoading]);

  // --- Clean Conditional Rendering Branches (Early Returns) ---

  // 1. Full screen primary load status spinner view blocker
  if (isLoading) return <PageLoader className="h-[30vh]" />;

  // 2. Error message fallback card presentation banner layout
  if (error) {
    return (
      <div 
        className="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 border border-red-200 dark:border-red-900 transition-none!" 
        role="alert"
      >
        <AlertCircle className="shrink-0 inline w-5 h-5 me-3" />
        <div>
          <span className="font-medium">Catalog Error:</span> {error}
        </div>
      </div>
    );
  }

  // 3. Clean fallback block triggered when server query matching results return empty data length
  if (filteredBooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900/40 transition-none!">
        <Inbox className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-lg font-bold text-gray-900 dark:text-white">
          No books found
        </p>
      </div>
    );
  }

  // 4. Ultimate data grid rendering pipeline path
  return (
    <div className="space-y-6">
      {/* Cards Adaptive Grid Layout Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            isFavorite={book.isFavorite}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDeleteBook}
            onAuthorClick={onSelectAuthor} // Bind bubbled clicks onto parent state modfiers
            onYearClick={onSelectYear}     // Bind bubbled clicks onto parent state modfiers
          />
        ))}
      </div>

      {/* Invisible Bottom Sentinel Layer + Background Pagination Activity Indicator Spinner */}
      <div ref={observerTargetRef} className="w-full h-10 flex items-center justify-center">
        {isFetchingNextPage && (
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        )}
      </div>
    </div>
  );
}
