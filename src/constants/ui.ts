/**
 * Pure immutable UI layer layout constants managing pagination bounds.
 */
export const BOOKS_PER_PAGE_LIMIT = 12 as const;

/**
 * Persistent UI state client-side storage tracking key for favorite filtering.
 */
export const FAVORITES_FILTER_KEY = 'books-show-fav-only' as const;
