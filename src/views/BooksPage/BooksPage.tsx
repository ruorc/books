import { useEffect, useState } from 'react';
import { Search, Plus, Heart, X } from 'lucide-react';
import { useAppMode } from '@/providers/AppModeProvider';
import { FAVORITES_FILTER_KEY } from '@/constants/ui';
import PageLoader from '@/components/PageLoader';
import { FuncCatalog } from './FuncCatalog';

// 2. Keep ONLY the Class placeholder until we build it
/* const ClassCatalog = ({
  search,
  favOnly,
}: {
  search: string;
  favOnly: boolean;
}) => (
  <div className="text-center p-8 border border-dashed border-gray-700 rounded-xl text-gray-400">
    ClassCatalog Placeholder (Search: "{search}", FavOnly: {String(favOnly)})
  </div>
); */

export default function BooksPage() {
  const { mode, isModeLoading } = useAppMode();
  const [searchQuery, setSearchQuery] = useState('');
  
  // States to keep track of concrete author/year constraints triggered from a card
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(() => {
    const saved = localStorage.getItem(FAVORITES_FILTER_KEY);
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_FILTER_KEY, String(showFavoritesOnly));
  }, [showFavoritesOnly]);

  const handleOpenAddModal = () => {
    console.log('Add Book Modal triggered');
  };

  return (
    <div className="space-y-6">
      {/* 1. Action Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
        {/* Search Input Control */}
        <div className="relative grow max-w-md">
          <div className="absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books by title or author..."
            className="block w-full p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
          />
        </div>

        {/* Action Buttons Group */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`w-full sm:w-auto font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center justify-center gap-2 border transition-colors cursor-pointer focus:outline-none focus:ring-4 ${
              showFavoritesOnly
                ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 focus:ring-red-100 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/60'
                : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50 focus:ring-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700'
            }`}
          >
            <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-red-500 dark:fill-red-400' : ''}`} />
            <span>{showFavoritesOnly ? 'Showing Favorites' : 'Show Favorites'}</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="w-full sm:w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Book</span>
          </button>
        </div>
      </div>

      {/* 1.5 Active Filtering Badges Track Layer (Flowbite Style Clearable Tags) */}
      {(selectedAuthor || selectedYear) && (
        <div className="flex flex-wrap items-center gap-2 px-1">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mr-1">Active filters:</span>
          
          {selectedAuthor && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium text-blue-800 bg-blue-150 rounded-full dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Author: {selectedAuthor}
              <button onClick={() => setSelectedAuthor('')} className="p-0.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {selectedYear && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium text-purple-800 bg-purple-100 rounded-full dark:bg-purple-900/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              Year: {selectedYear}
              <button onClick={() => setSelectedYear('')} className="p-0.5 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 text-purple-600 dark:text-purple-400 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* 2. Dynamic Catalog Engine Wrapper */}
      <div className="relative min-h-[40vh]">
        {isModeLoading ? (
          <PageLoader className="h-[40vh]" />
        ) : mode === 'function' ? (
          <FuncCatalog 
            search={searchQuery} 
            favOnly={showFavoritesOnly} 
            selectedAuthor={selectedAuthor}
            selectedYear={selectedYear}
            onSelectAuthor={setSelectedAuthor}
            onSelectYear={setSelectedYear}
          />
        ) : (
          <div className="text-center p-8 border border-dashed border-gray-700 rounded-xl text-gray-400">
            ClassCatalog Placeholder (Search: "{searchQuery}", FavOnly: {String(showFavoritesOnly)})
          </div>
        )}
      </div>
    </div>
  );
}