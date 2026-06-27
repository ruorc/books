/**
 * Pure immutable UI layer layout constants managing pagination bounds.
 */
export const BOOKS_PER_PAGE_LIMIT = 12 as const;

/**
 * Persistent UI state client-side storage tracking key for favorite filtering.
 */
export const FAVORITES_FILTER_KEY = 'books-show-fav-only' as const;

/**
 * Explicit literal keys for book metadata sorting and cross-linking workflows.
 */
export const FILTER_TYPES = {
  AUTHOR: 'author',
  YEAR: 'year',
} as const;

/**
 * Human-readable presentation labels representing system architecture engines.
 */
export const ENGINE_LABELS = {
  FUNCTIONAL: 'Functional Components (Hooks)',
  CLASS: 'Class Components (Lifecycle)',
} as const;
