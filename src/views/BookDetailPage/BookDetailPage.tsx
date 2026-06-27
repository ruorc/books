import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Calendar, User, AlertCircle } from 'lucide-react';
import { ROUTES } from '@/routers/routes';
import { useBookDetail } from './hooks/useBookDetail';

export default function BookDetailPage() {
  const { book, isLoading, error, handleToggleFavorite } = useBookDetail();
  const navigate = useNavigate();

  // Clean declarative navigation directly to the main catalog route config
  const handleBackToCatalog = () => {
    navigate(ROUTES.BOOKS);
  };

  // FIXED: Re-implemented interactive metadata clicks passing explicit payloads into the router state history
  const handleFilterRedirect = (
    filterType: 'author' | 'year',
    value: string
  ) => {
    navigate(ROUTES.BOOKS, {
      state: {
        filterType,
        filterValue: value,
      },
    });
  };

  return (
    <div className="mx-auto min-h-[70vh] max-w-5xl space-y-6">
      {/* Persistent navigation controller layer boundary button */}
      <div>
        <button
          onClick={handleBackToCatalog}
          className="inline-flex items-center gap-2 py-0.5 text-sm font-medium text-gray-600 transition-colors hover:text-indigo-600 focus:outline-none dark:text-gray-400 dark:hover:text-indigo-400 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Catalog
        </button>
      </div>

      {/* --- Dynamic Content Mounting Block Execution Layer --- */}

      {/* 1. Structural Skeleton Loader Fallback View */}
      {isLoading && (
        <div className="flex flex-col items-start gap-8 md:flex-row animate-pulse">
          <div className="aspect-3/4 w-full shrink-0 rounded-xl border border-gray-200 bg-gray-50 shadow-sm md:w-1/3 dark:border-gray-700 dark:bg-gray-900/40" />
          <div className="w-full flex-1 space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-xs md:p-8 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-start justify-between gap-4">
              <div className="mt-1 h-8 w-3/4 rounded-md bg-gray-200 dark:bg-gray-700" />
              <div className="h-11 w-11 shrink-0 rounded-xl bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="flex gap-3">
              <div className="h-8 w-28 rounded-lg bg-gray-200 dark:bg-gray-700" />
              <div className="h-8 w-32 rounded-lg bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="border-t border-gray-100 dark:border-gray-700/60" />
            <div className="pt-1 space-y-2">
              <div className="mb-3 h-4 w-24 rounded-sm bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-full rounded-sm bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-full rounded-sm bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-4/5 rounded-sm bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      )}

      {/* 2. Destructive Empty / HTTP Error Boundary View */}
      {!isLoading && (error || !book) && (
        <div className="mx-auto max-w-md space-y-4 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Book Profile Not Found
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            The book record you are looking for might have been deleted or the
            link is invalid.
          </p>
          <button
            onClick={handleBackToCatalog}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Catalog
          </button>
        </div>
      )}

      {/* 3. Ultimate Entity Detail View Render Path Layout */}
      {!isLoading && !error && book && (
        <div className="flex flex-col items-start gap-8 md:flex-row">
          {/* Left Side: Sticky Book Cover Visual Box */}
          <div className="aspect-3/4 w-full shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm transition-colors duration-200 md:sticky md:top-6 md:w-1/3 dark:border-gray-700 dark:bg-gray-900/40">
            <img
              src={book.coverImage}
              alt={`${book.title} cover`}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Right Side: Primary Identity Content Typography Stream */}
          <div className="w-full flex-1 space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-xs transition-colors duration-200 md:p-8 dark:border-gray-700 dark:bg-gray-800">
            {/* Header Zone: Dynamic Header Title with interactive Favorite Switch */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 md:text-4xl dark:text-white">
                {book.title}
              </h1>
              <button
                onClick={handleToggleFavorite}
                className={`p-2.5 rounded-xl border transition-colors focus:outline-none focus:ring-4 cursor-pointer ${
                  book.isFavorite
                    ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 focus:ring-red-200/50 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/60'
                    : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
                aria-label={
                  book.isFavorite ? 'Remove from favorites' : 'Add to favorites'
                }
              >
                <Heart
                  className={`h-5 w-5 ${book.isFavorite ? 'fill-red-600 dark:fill-red-400' : ''}`}
                />
              </button>
            </div>

            {/* Metadata Badges Zone: Author and Creation Year made clickable again */}
            <div className="flex flex-wrap gap-3 text-sm">
              <button
                onClick={() => handleFilterRedirect('author', book.author)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-1.5 font-medium text-indigo-800 transition-colors hover:bg-indigo-100 focus:outline-none dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60 cursor-pointer"
                title={`Find more books written by ${book.author}`}
              >
                <User className="h-4 w-4 text-indigo-500" />
                by {book.author}
              </button>

              <button
                onClick={() => handleFilterRedirect('year', book.year)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-purple-50 px-3 py-1.5 font-medium text-purple-800 transition-colors hover:bg-purple-100 focus:outline-none dark:bg-purple-950/40 dark:text-purple-300 dark:hover:bg-purple-900/60 cursor-pointer"
                title={`Find more books written in ${book.year}`}
              >
                <Calendar className="h-4 w-4 text-purple-500" />
                Written in {book.year}
              </button>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700/60" />

            {/* Description Zone */}
            <div className="space-y-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                About this book
              </h2>
              <p className="text-base leading-relaxed text-gray-600 whitespace-pre-line dark:text-gray-300">
                {book.description ||
                  'No descriptive overview available for this specific catalog book record entry.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
