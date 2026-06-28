import { Plus, Heart, SlidersHorizontal, X } from 'lucide-react'; // Imported X icon
import { useAppMode } from '@/providers/AppModeProvider';
import { MODES } from '@/constants/mode';
import { BookFormModal } from '@/components/BookFormModal';
import { AdvancedSearchModal } from '@/components/AdvancedSearchModal';
import { useBooksPageLogic } from './hooks/useBooksPageLogic';
import PageLoader from '@/components/PageLoader';
import { FuncCatalog } from './FuncCatalog';

export default function BooksPage() {
  const { mode, isModeLoading } = useAppMode();

  const {
    catalogState,
    isAddModalOpen,
    setIsAddModalOpen,
    isSearchModalOpen,
    setIsSearchModalOpen,
    isSubmitting,
    handleCreateBookSubmit,
    handleUpdateAdvancedFilters,
    handleClearAllFilters,
  } = useBooksPageLogic();

  const isFiltersActive = !!(
    catalogState.globalSearch ||
    catalogState.titleSearch ||
    catalogState.authorSearch ||
    catalogState.yearSearch
  );

  return (
    <div className="space-y-6">
      {/* 1. Action Top Bar */}
      <div className="flex flex-col gap-4 border border-gray-200 bg-white p-4 rounded-xl sm:flex-row sm:items-center sm:justify-between dark:border-gray-700 dark:bg-gray-800">
        {/* Toggle Advanced Filters Button Controller Box */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsSearchModalOpen(true)}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all focus:outline-none sm:w-auto cursor-pointer ${
              isFiltersActive
                ? 'bg-indigo-50 border-indigo-300 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-900/60'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>
              {isFiltersActive
                ? 'Filters Active (Manage)'
                : 'Advanced Search & Sort'}
            </span>
          </button>

          {/* FIXED: Added direct on-panel reset controller button when search queries are active */}
          {isFiltersActive && (
            <button
              type="button"
              onClick={handleClearAllFilters}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-200/60 bg-red-50/50 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors focus:outline-none sm:w-auto cursor-pointer dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
              title="Clear all active search terms instantly"
            >
              <X className="h-3.5 w-3.5" />
              Reset Filters
            </button>
          )}
        </div>

        {/* Action Controls Button Group */}
        <div className="flex flex-col items-center gap-3 sm:flex-row w-full sm:w-auto">
          <button
            type="button"
            onClick={() =>
              handleUpdateAdvancedFilters({ favOnly: !catalogState.favOnly })
            }
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-4 sm:w-auto cursor-pointer ${
              catalogState.favOnly
                ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 focus:ring-red-200/50 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-400'
                : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400'
            }`}
          >
            <Heart
              className={`h-4 w-4 ${catalogState.favOnly ? 'fill-red-500 dark:fill-red-400' : ''}`}
            />
            <span>
              {catalogState.favOnly ? 'Showing Favorites' : 'Show Favorites'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none sm:w-auto cursor-pointer dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <Plus className="h-4 w-4" />
            <span>Add Book</span>
          </button>
        </div>
      </div>

      {/* 2. Dynamic Catalog Engine Wrapper */}
      <div className="relative min-h-[40vh]">
        {isModeLoading ? (
          <PageLoader className="h-[40vh]" />
        ) : mode === MODES.FUNCTIONAL ? (
          <FuncCatalog />
        ) : (
          <div className="rounded-xl border border-dashed border-gray-700 p-8 text-center text-gray-400">
            ClassCatalog Placeholder (Search: "{catalogState.globalSearch}",
            FavOnly: {String(catalogState.favOnly)})
          </div>
        )}
      </div>

      {/* Embedded Poly-decoupled Modals Context Layer Boundaries */}
      <BookFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateBookSubmit}
        isLoading={isSubmitting}
      />

      <AdvancedSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        filters={catalogState}
        onChange={handleUpdateAdvancedFilters}
      />
    </div>
  );
}
