import { Heart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Book } from '@/types/book';

interface BookCardProps {
  book: Book;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export function BookCard({
  book,
  isFavorite,
  onToggleFavorite,
  onDelete,
}: BookCardProps) {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-xs dark:bg-gray-800 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200 group">
      {/* 1. Book Cover Container (Flowbite-style image card top) */}
      <div className="relative aspect-3/4 bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <img
          src={book.cover}
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

          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 line-clamp-1">
            by {book.author}
          </p>
        </div>

        {/* 3. Bottom Meta and Action Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800">
            Year: {book.year}
          </span>

          {/* Delete Button (Flowbite light destructive style) */}
          <button
            onClick={() => onDelete(book.id)}
            className="text-gray-400 hover:text-white border border-gray-200 hover:bg-red-600 hover:border-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:border-gray-600 dark:text-gray-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 transition-colors cursor-pointer"
            aria-label="Delete book"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
