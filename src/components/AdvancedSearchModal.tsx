import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal, ArrowUpDown, RefreshCw } from 'lucide-react';
import { SORT_FIELDS, SORT_DIRECTIONS } from '@/constants/ui';
import type { AdvancedFiltersState } from '@/types/catalogFilters';

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: AdvancedFiltersState;
  onChange: (updated: Partial<AdvancedFiltersState>) => void;
}

export function AdvancedSearchModal({
  isOpen,
  onClose,
  filters,
  onChange,
}: AdvancedSearchModalProps) {
  const handleReset = () => {
    onChange({
      globalSearch: '',
      titleSearch: '',
      authorSearch: '',
      yearSearch: '',
      sortField: SORT_FIELDS.CREATED_AT,
      sortDirection: SORT_DIRECTIONS.DESC,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-slate-950/60"
          />

          <motion.div
            role="dialog"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl z-10 transition-colors dark:border-slate-800 dark:bg-slate-900"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 focus:outline-none dark:hover:text-slate-300 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2 text-indigo-500">
                <SlidersHorizontal className="h-5 w-5" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                  Search & Sort Filters
                </h3>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" /> Reset All
              </button>
            </div>

            <div className="space-y-4">
              {/* Text Search Channels */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Broad Global Search
                </label>
                <input
                  type="text"
                  value={filters.globalSearch}
                  onChange={(e) => onChange({ globalSearch: e.target.value })}
                  placeholder="Search anything by title or author..."
                  className="block w-full rounded-xl border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Targeted Title Search
                </label>
                <input
                  type="text"
                  value={filters.titleSearch}
                  onChange={(e) => onChange({ titleSearch: e.target.value })}
                  placeholder="Filter explicitly by title..."
                  className="block w-full rounded-xl border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Targeted Author Search
                  </label>
                  <input
                    type="text"
                    value={filters.authorSearch}
                    onChange={(e) => onChange({ authorSearch: e.target.value })}
                    placeholder="Filter explicitly by author..."
                    className="block w-full rounded-xl border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Targeted Written Year
                  </label>
                  <input
                    type="text"
                    value={filters.yearSearch}
                    onChange={(e) => onChange({ yearSearch: e.target.value })}
                    placeholder="Filter explicitly by year..."
                    className="block w-full rounded-xl border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Sorting Block Engine Controls */}
              <div className="border-t border-slate-100 pt-4 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <ArrowUpDown className="h-3.5 w-3.5" /> Sorting Metrics
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Sort Field Boundary
                    </label>
                    <select
                      value={filters.sortField}
                      onChange={(e) =>
                        onChange({ sortField: e.target.value as any })
                      }
                      className="block w-full rounded-xl border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value={SORT_FIELDS.TITLE}>Book Title</option>
                      <option value={SORT_FIELDS.AUTHOR}>Author Name</option>
                      <option value={SORT_FIELDS.YEAR}>Written Year</option>
                      <option value={SORT_FIELDS.CREATED_AT}>
                        Date Registered
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Sort Direction Pipeline
                    </label>
                    <select
                      value={filters.sortDirection}
                      onChange={(e) =>
                        onChange({ sortDirection: e.target.value as any })
                      }
                      className="block w-full rounded-xl border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value={SORT_DIRECTIONS.ASC}>
                        Ascending (A-Z / 0-9)
                      </option>
                      <option value={SORT_DIRECTIONS.DESC}>
                        Descending (Z-A / 9-0)
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 focus:outline-none transition-colors cursor-pointer text-center"
              >
                Apply active filters
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
