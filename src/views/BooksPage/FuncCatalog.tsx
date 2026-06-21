import { AlertCircle, Inbox } from 'lucide-react';
import { BookCard } from '@/components/BookCard';
import PageLoader from '@/components/PageLoader';
import { useBooksCatalog } from '@/views/BooksPage/hooks/useBooksCatalog';

interface FuncCatalogProps {
  search: string;
  favOnly: boolean;
}

export function FuncCatalog({ search, favOnly }: FuncCatalogProps) {
  const {
    filteredBooks,
    isLoading,
    error,
    favorites,
    handleDeleteBook,
    handleToggleFavorite,
  } = useBooksCatalog({ search, favOnly });

  if (isLoading) return <PageLoader className="h-[30vh]" />;

  if (error) {
    return (
      <div
        className="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 border border-red-200"
        role="alert"
      >
        <AlertCircle className="shrink-0 inline w-5 h-5 me-3" />
        <div>
          <span className="font-medium">Catalog Error:</span> {error}
        </div>
      </div>
    );
  }

  if (filteredBooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900/40">
        <Inbox className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-lg font-bold text-gray-900 dark:text-white">
          No books found
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredBooks.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          isFavorite={favorites.includes(book.id)}
          onToggleFavorite={handleToggleFavorite}
          onDelete={handleDeleteBook}
        />
      ))}
    </div>
  );
}
