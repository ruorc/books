import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Plus, Heart, X } from 'lucide-react';
import { useAppMode } from '@/providers/AppModeProvider';
import { FAVORITES_FILTER_KEY } from '@/constants/ui';
import { MODES } from '@/constants/mode';
import PageLoader from '@/components/PageLoader';
import { FuncCatalog } from './FuncCatalog';

interface RouterLocationState {
  filterType?: 'author' | 'year';
  filterValue?: string;
}

export default function BooksPage() {
  const { mode, isModeLoading } = useAppMode();

  // Restored clean standalone state management hooks
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(() => {
    const saved = localStorage.getItem(FAVORITES_FILTER_KEY);
    return saved === 'true';
  });

  // Intercept incoming filter events passed through the router history state layer
  useEffect(() => {
    const routerState = location.state as RouterLocationState;
    if (!routerState || !routerState.filterType || !routerState.filterValue)
      return;

    const { filterType, filterValue } = routerState;

    if (filterType === 'author') {
      setSelectedAuthor(filterValue);
      setSearchQuery('');
    } else if (filterType === 'year') {
      setSelectedYear(filterValue);
      setSearchQuery('');
    }

    navigate(location.pathname, { replace: true, state: {} });
  }, [location, navigate]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_FILTER_KEY, String(showFavoritesOnly));
  }, [showFavoritesOnly]);

  const handleOpenAddModal = () => {
    console.log('Add Book Modal triggered');
  };

  return (
    <div className="space-y-6">
      {/* 1. Action Top Bar */}
      <div className="flex flex-col gap-4 border border-gray-200 bg-white p-4 rounded-xl md:flex-row md:items-center md:justify-between dark:border-gray-700 dark:bg-gray-800">
        {/* Search Input Control */}
        <div className="relative max-w-md grow">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books by title or author..."
            className="block w-full rounded-xl border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
          />
        </div>

        {/* Action Buttons Group */}
        <div className="flex w-full flex-col items-center justify-end gap-3 sm:flex-row md:w-auto">
          <button
            type="button"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-4 sm:w-auto cursor-pointer ${
              showFavoritesOnly
                ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 focus:ring-red-200/50 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/60'
                : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50 focus:ring-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-650 dark:focus:ring-gray-700'
            }`}
          >
            <Heart
              className={`h-4 w-4 ${showFavoritesOnly ? 'fill-red-500 dark:fill-red-400' : ''}`}
            />
            <span>
              {showFavoritesOnly ? 'Showing Favorites' : 'Show Favorites'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 sm:w-auto cursor-pointer dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-800"
          >
            <Plus className="h-4 w-4" />
            <span>Add Book</span>
          </button>
        </div>
      </div>

      {/* 1.5 Active Filtering Badges Track Layer */}
      {(selectedAuthor || selectedYear) && (
        <div className="flex flex-wrap items-center gap-2 px-1">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Active filters:
          </span>

          {selectedAuthor && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/60 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-800 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
              Author: {selectedAuthor}
              <button
                type="button"
                onClick={() => setSelectedAuthor('')}
                className="rounded-full p-0.5 text-indigo-600 transition-colors hover:bg-indigo-200 dark:text-indigo-400 dark:hover:bg-indigo-800 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          )}

          {selectedYear && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200/60 bg-purple-50 px-3 py-1 text-sm font-medium text-purple-800 dark:border-indigo-900/60 dark:bg-purple-950/40 dark:text-purple-300">
              Year: {selectedYear}
              <button
                type="button"
                onClick={() => setSelectedYear('')}
                className="rounded-full p-0.5 text-purple-600 transition-colors hover:bg-purple-200 dark:text-purple-400 dark:hover:bg-purple-800 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* 2. Dynamic Catalog Engine Wrapper */}
      <div className="relative min-h-[40vh]">
        {isModeLoading ? (
          <PageLoader className="h-[40vh]" />
        ) : mode === MODES.FUNCTIONAL ? (
          <FuncCatalog
            search={searchQuery}
            favOnly={showFavoritesOnly}
            selectedAuthor={selectedAuthor}
            selectedYear={selectedYear}
            onSelectAuthor={setSelectedAuthor}
            onSelectYear={setSelectedYear}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-gray-700 p-8 text-center text-gray-400">
            ClassCatalog Placeholder (Search: "{searchQuery}", FavOnly:{' '}
            {String(showFavoritesOnly)})
          </div>
        )}
      </div>
    </div>
  );
}
