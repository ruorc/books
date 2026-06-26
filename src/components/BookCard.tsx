import { Heart, Trash2, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Book } from '@/types/book';

interface BookCardProps {
  book: Book;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onAuthorClick?: (author: string) => void; 
  onYearClick?: (year: string) => void;     
}

export function BookCard({
  book,
  isFavorite,
  onToggleFavorite,
  onDelete,
  onAuthorClick,
  onYearClick,
}: BookCardProps) {
  // Format server ISO string dates safely using the user's runtime system locale
  const formatDate = (isoString?: string) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    
    // Check for invalid date strings returned from the server
    if (isNaN(date.getTime())) return null;

    // Passing undefined automatically detects and configures the active browser locale
    return new Intl.DateTimeFormat(undefined, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formattedCreated = formatDate(book.createdAt);
  const formattedUpdatedRaw = formatDate(book.updatedAt);
  
  // Render update timestamps conditionally only when formatted timestamps actually differ to ignore millisecond mismatches
  const hasUpdates = formattedUpdatedRaw && formattedCreated && formattedUpdatedRaw !== formattedCreated;
  const formattedUpdated = hasUpdates ? formattedUpdatedRaw : null;

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-xs dark:bg-gray-800 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200 group">
      {/* 1. Book Cover Container (Flowbite-style image card top) */}
      <div className="relative aspect-3/4 bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <img
          src={book.coverImage}
          alt={`${book.title} cover`}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
        />

        {/* Floating Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault(); // Prevents triggers Link navigation
            onToggleFavorite(book.id);
          }}
          className="absolute top-3 right-3 p-2 text-gray-500 bg-white/90 rounded-lg hover:text-red-600 dark:text-gray-400 dark:bg-gray-800/95 dark:hover:text-red-500 shadow-xs transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`h-4 w-4 ${isFavorite ? 'fill-red-600 text-red-600 dark:fill-red-500 dark:text-red-500' : ''}`}
          />
        </button>
      </div>

      {/* 2. Book Info Content (Flowbite Typography & Layout) */}
      <div className="flex flex-col grow p-5 space-y-3">
        <div className="grow space-y-1">
          {/* Book Title acting as a link */}
          <Link
            to={`/books/${book.id}`}
            className="block text-xl font-bold tracking-tight text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-500 line-clamp-2 transition-colors cursor-pointer"
          >
            {book.title}
          </Link>

          {/* Unified Author and Publication Year text element row segment */}
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 line-clamp-1">
            by{' '}
            <span
              onClick={() => onAuthorClick?.(book.author)}
              className="hover:text-blue-600 dark:hover:text-blue-500 hover:underline cursor-pointer transition-colors"
              title={`Show all books by ${book.author}`}
            >
              {book.author}
            </span>
            {book.year && (
              <>
                <span className="text-gray-400 dark:text-gray-600 mx-1.5">•</span>
                <span
                  onClick={() => onYearClick?.(book.year)}
                  className="text-gray-500 dark:text-gray-500 font-normal hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer transition-colors"
                  title={`Show all books published in ${book.year}`}
                >
                  {book.year}
                </span>
              </>
            )}
          </p>
        </div>

        {/* 3. Bottom Meta and Action Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          {/* Time Audits Logs Display Box Container */}
          <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
            {formattedCreated && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>Added: {formattedCreated}</span>
              </div>
            )}
            {formattedUpdated && (
              <div className="flex items-center gap-1 text-gray-450 dark:text-gray-500">
                <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>Modified: {formattedUpdated}</span>
              </div>
            )}
          </div>

          {/* Delete Button (Flowbite light destructive style) */}
          <button
            onClick={() => onDelete(book.id)}
            className="text-gray-400 hover:text-white border border-gray-200 hover:bg-red-600 hover:border-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:border-gray-600 dark:text-gray-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 transition-colors cursor-pointer shrink-0"
            aria-label="Delete book"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
