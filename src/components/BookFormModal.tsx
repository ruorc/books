import { useEffect, useState, type SyntheticEvent } from 'react'; // Swapped FormEvent to SyntheticEvent
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, PlusCircle } from 'lucide-react';
import type { Book, BookPayload } from '@/types/book';
import { generateStablePicsumUrl } from '@/constants/ui';

interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<BookPayload, 'isFavorite'>) => Promise<void>;
  initialData?: Book | null;
  isLoading?: boolean;
}

export function BookFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
}: BookFormModalProps) {
  // Individual controlled inputs states management
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');

  // Sync internal state flags whenever initialData changes (Edit Mode injection)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setAuthor(initialData.author);
      setYear(initialData.year);
      setDescription(initialData.description);
      setCoverImage(initialData.coverImage);
    } else {
      // Clear input fields for baseline creation workflows
      setTitle('');
      setAuthor('');
      setYear('');
      setDescription('');
      setCoverImage('');
    }
  }, [initialData, isOpen]);

  // Updated to explicit generic React 19 type evaluation contract
  const handleFormSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !year.trim()) return;

    // Build unified sanitized payload stripped from redundant trailing spaces
    const payload: Omit<BookPayload, 'isFavorite'> = {
      title: title.trim(),
      author: author.trim(),
      year: year.trim(),
      description: description.trim(),
      // Fallback placeholder image if no cover URL is specified by the user
      coverImage: coverImage.trim() || generateStablePicsumUrl(),
    };

    await onSubmit(payload);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop Overlay Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-slate-950/60"
          />

          {/* Modal Container Content Box */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl z-10 transition-colors dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Upper Action Dismiss Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-lg cursor-pointer dark:hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Title Identity Layout Header */}
            <div className="mb-4 flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-indigo-500" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                {initialData
                  ? 'Edit Book Specifications'
                  : 'Register New Catalog Entry'}
              </h3>
            </div>

            {/* Controlled HTML Action Form Pipeline */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  Book Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., The Great Gatsby"
                  className="block w-full rounded-xl border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g., F. Scott Fitzgerald"
                    className="block w-full rounded-xl border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    Written Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="e.g., 1925"
                    className="block w-full rounded-xl border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://example.com"
                  className="block w-full rounded-xl border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  Description / Synopsis
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write a brief overview regarding this literary piece..."
                  className="block w-full rounded-xl border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 resize-none"
                />
              </div>

              {/* Action Controls Row */}
              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-900 transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {initialData ? 'Save Changes' : 'Create Entry'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
