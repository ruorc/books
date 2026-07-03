import { generateRuntimeId } from '@/config/crypto';

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
  /** Filter collection results strictly by the author's identifier or name. */
  AUTHOR: 'author',
  /** Filter collection results strictly by a specific publication year. */
  YEAR: 'year',
} as const;

/**
 * Universal fields available for strict sorting operations.
 */
export const SORT_FIELDS = {
  /** Sort collection records by their title attribute. */
  TITLE: 'title',
  /** Sort collection records by their author's name attribute. */
  AUTHOR: 'author',
  /** Sort collection records by their publication year attribute. */
  YEAR: 'year',
  /** Sort collection records chronologically by their creation timestamp. */
  CREATED_AT: 'createdAt',
} as const;

/**
 * Sort direction parameters.
 */
export const SORT_DIRECTIONS = {
  /** Sort records in ascending order (A-Z, 0-9). */
  ASC: 'asc',
  /** Sort records in descending order (Z-A, 9-0). */
  DESC: 'desc',
} as const;

/**
 * Human-readable presentation labels representing system architecture engines.
 */
export const ENGINE_LABELS = {
  /** Display label for the modern functional component paradigm. */
  FUNCTIONAL: 'Functional Components (Hooks)',
  /** Display label for the legacy class-based component paradigm. */
  CLASS: 'Class Components (Lifecycle)',
} as const;

/**
 * Generates a completely static, immutable asset URL using a unique runtime string seed.
 * This guarantees the image remains consistent across all subsequent component renders
 * when assigned to a stable state variable during initialization.
 *
 * @returns A fully qualified immutable Picsum placeholder image URL string.
 */
export const generateStablePicsumUrl = (): string => {
  const rawId = generateRuntimeId();
  // Safely extract the first structural block regardless of the underlying generation engine
  const uniqueSeed = rawId.split('-')[0] || 'fallback-seed';

  return `https://picsum.photos/seed/${uniqueSeed}/200/300`;
};

/**
 * Global accessible fallback text announced by screen readers during async page chunks loading.
 */
export const LOADER_ACCESSIBILITY_TEXT = 'Loading page content...' as const;
