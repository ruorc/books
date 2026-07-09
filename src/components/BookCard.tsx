import { Heart, Trash2, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Book } from '@/views/BooksDomain/types/book';

interface BookCardProps {
  book: Book;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onAuthorClick?: (author: string) => void;
  onYearClick?: (year: string) => void;
}

/**
 * Pure external date formatting engine to optimize garbage collection and CPU cycles.
 */
const formatDate = (isoString?: string): string | null => {
  if (!isoString) return null;
  const date = new Date(isoString);

  if (isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export function BookCard({
  book,
  isFavorite,
  onToggleFavorite,
  onDelete,
  onAuthorClick,
  onYearClick,
}: BookCardProps) {
  const formattedCreated = formatDate(book.createdAt);
  const formattedUpdatedRaw = formatDate(book.updatedAt);

  const hasUpdates =
    formattedUpdatedRaw &&
    formattedCreated &&
    formattedUpdatedRaw !== formattedCreated;
  const formattedUpdated = hasUpdates ? formattedUpdatedRaw : null;

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl shadow-xs dark:bg-gray-800 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200 group h-full">
      <Link
        to={`/books/${book.bookId}`}
        className="relative block aspect-3/4 bg-gray-50 dark:bg-gray-900/40 overflow-hidden cursor-pointer"
      >
        <img
          src={book.coverImage}
          alt={`${book.title} cover`}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      <div className="flex flex-col grow p-5">
        <div className="mb-3">
          <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2">
            {book.title}
          </h3>
        </div>

        <div className="flex items-end justify-between gap-4 mt-auto pt-2">
          <div className="flex flex-col space-y-0.5 text-sm font-medium text-gray-600 dark:text-gray-400 min-w-0">
            <span className="line-clamp-1">
              by{' '}
              <button
                type="button"
                onClick={() => onAuthorClick?.(book.author)}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline cursor-pointer transition-colors focus:outline-none focus:text-indigo-600 text-left font-medium"
                title={`Show all books by ${book.author}`}
              >
                {book.author}
              </button>
            </span>

            {book.writingYear && (
              <span className="text-gray-500 dark:text-gray-500 font-normal line-clamp-1">
                in{' '}
                <button
                  type="button"
                  onClick={() => onYearClick?.(book.writingYear)}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline cursor-pointer transition-colors text-left font-medium"
                  title={`Show all books published in ${book.writingYear}`}
                >
                  {book.writingYear}
                </button>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(book.bookId);
            }}
            className={`p-2 rounded-xl border transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
              isFavorite
                ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-400'
                : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500 dark:hover:bg-slate-700'
            }`}
            aria-label={
              isFavorite ? 'Remove from favorites' : 'Add to favorites'
            }
          >
            <Heart
              className={`h-4 w-4 ${isFavorite ? 'fill-red-500 dark:fill-red-400' : ''}`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between pt-3 mt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
            {formattedCreated && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>Added: {formattedCreated}</span>
              </div>
            )}
            {formattedUpdated && (
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-500">
                <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>Modified: {formattedUpdated}</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onDelete(book.bookId)}
            className="text-gray-400 hover:text-white border border-gray-200 hover:bg-red-600 hover:border-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-xl text-sm p-2 text-center inline-flex items-center dark:border-gray-700 dark:text-gray-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 transition-colors cursor-pointer shrink-0"
            aria-label="Delete book"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
