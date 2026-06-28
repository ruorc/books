import { useLoaderData, useNavigation } from 'react-router-dom';
import { ArrowLeft, Heart, Calendar, User, Edit3 } from 'lucide-react';
import { FILTER_TYPES } from '@/constants/ui';
import { booksService } from '@/services/booksDataServiceMockApi';
import { useBookDetailPageLogic } from './hooks/useBookDetailPageLogic';
import { BookActionModal } from './BookActionModal';
import type { Book } from '@/types/book';

/**
 * Native React Router v7 Data Loader.
 */
export async function bookDetailLoader({
  params,
}: {
  params: Record<string, string | undefined>;
}) {
  const { id } = params;
  if (!id)
    throw new Error(
      'Critical Configuration Failure: Missing mandatory book identifier parameter.'
    );
  return await booksService.getById(id);
}

/**
 * Modern React Router v7 Form Action handler.
 */
export async function bookDetailAction({
  request,
  params,
}: {
  request: Request;
  params: Record<string, string | undefined>;
}) {
  const { id } = params;
  if (!id)
    throw new Error(
      'Critical Action Failure: Missing mandatory book identifier parameter.'
    );

  const formData = await request.formData();

  const updatedFields = {
    title: String(formData.get('title')).trim(),
    author: String(formData.get('author')).trim(),
    year: String(formData.get('year')).trim(),
    description: String(formData.get('description')).trim(),
    coverImage: String(formData.get('coverImage')).trim(),
  };

  await booksService.update(id, updatedFields);
  return { success: true };
}

export default function BookDetailPage() {
  const initialBook = useLoaderData() as Book;

  const navigation = useNavigation();
  const isFormSubmitting = navigation.state === 'submitting';

  // Extract the coordinated localBook state profile from our custom orchestrator hook
  const {
    localBook,
    isEditModalOpen,
    setIsEditModalOpen,
    handleBackToCatalog,
    handleFilterRedirect,
    handleToggleFavorite,
  } = useBookDetailPageLogic(initialBook);

  return (
    <div className="mx-auto min-h-[70vh] max-w-5xl space-y-6">
      <div>
        <button
          type="button"
          onClick={handleBackToCatalog}
          className="inline-flex items-center gap-2 py-0.5 text-sm font-medium text-gray-600 transition-colors hover:text-indigo-600 focus:outline-none dark:text-gray-400 dark:hover:text-indigo-400 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Catalog
        </button>
      </div>

      <div className="flex flex-col items-start gap-8 md:flex-row">
        {/* Sticky Book Cover Box Container */}
        <div className="aspect-3/4 w-full shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm transition-colors duration-200 md:sticky md:top-6 md:w-1/3 dark:border-gray-700 dark:bg-gray-900/40">
          <img
            src={localBook.coverImage}
            alt={`${localBook.title} cover`}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Primary Content Stream Box */}
        <div className="w-full flex-1 space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-xs transition-colors duration-200 md:p-8 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 md:text-4xl dark:text-white">
              {localBook.title}
            </h1>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 hover:scale-105 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
                title="Edit book details"
              >
                <Edit3 className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={handleToggleFavorite}
                className={`p-2.5 rounded-xl border hover:scale-105 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer ${
                  localBook.isFavorite
                    ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-200/60 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-400'
                    : 'bg-white border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                }`}
              >
                <Heart
                  className={`h-5 w-5 ${localBook.isFavorite ? 'fill-red-600 dark:fill-red-400' : ''}`}
                />
              </button>
            </div>
          </div>

          {/* Metadata Interactivity Controls Row */}
          <div className="flex flex-wrap gap-3 text-sm">
            <button
              type="button"
              onClick={() =>
                handleFilterRedirect(FILTER_TYPES.AUTHOR, localBook.author)
              }
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-1.5 font-medium text-indigo-800 transition-colors hover:bg-indigo-100 focus:outline-none dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60 cursor-pointer"
            >
              <User className="h-4 w-4 text-indigo-500" /> by {localBook.author}
            </button>

            <button
              type="button"
              onClick={() =>
                handleFilterRedirect(FILTER_TYPES.YEAR, localBook.year)
              }
              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-50 px-3 py-1.5 font-medium text-purple-800 transition-colors hover:bg-purple-100 focus:outline-none dark:bg-purple-950/40 dark:text-purple-300 dark:hover:bg-purple-900/60 cursor-pointer"
            >
              <Calendar className="h-4 w-4 text-purple-500" /> Written in{' '}
              {localBook.year}
            </button>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700/60" />

          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              About this book
            </h2>
            <p className="text-base leading-relaxed text-gray-600 whitespace-pre-line dark:text-gray-300">
              {localBook.description ||
                'No descriptive overview available for this specific catalog book record entry.'}
            </p>
          </div>
        </div>
      </div>

      {/* Embedded Poly-decoupled Router Form Modal View */}
      <BookActionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        book={localBook}
        isSubmitting={isFormSubmitting}
      />
    </div>
  );
}
