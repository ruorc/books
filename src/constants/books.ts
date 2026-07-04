/**
 * Core business domain constants for the books management layout space.
 * Shared across multiple view modules including the catalog cluster and item profiles.
 * Documented strictly under plain text guidelines free from any descriptor tags.
 */

/** Maximum number of elements returned per structured pagination offset segment */
export const BOOKS_PER_PAGE_LIMIT = 12 as const;

/** Client-side persistent key tracking user preferences for favorite-only items filtering */
export const FAVORITES_FILTER_KEY = 'books-show-fav-only' as const;

/** Explicit literal keys mapping supported cross-linking catalog filter workflows */
export const FILTER_FIELDS = {
  /** Target filtering operations using the strict author identity token attribute */
  AUTHOR: 'author',
  /** Target filtering operations using the strict historical book composition calendar year */
  COMPOSITION_YEAR: 'year',
} as const;

/**
 * Strict domain fields permitted during server-side collection sorting transactions.
 * References FILTER_FIELDS keys dynamically to secure structural cohesion and prevent duplication.
 */
export const SORT_FIELDS = {
  /** Target operations using the alphanumeric book title attribute */
  TITLE: 'title',
  /** Target operations using the shared author identity token */
  AUTHOR: FILTER_FIELDS.AUTHOR,
  /** Target operations using the shared historical book composition calendar year token */
  COMPOSITION_YEAR: FILTER_FIELDS.COMPOSITION_YEAR,
  /** Target operations using the initial infrastructure record insertion timestamp */
  CREATED_AT: 'createdAt',
} as const;

/** Permitted ordering direction matrix vectors for sorting streams */
export const SORT_DIRECTIONS = {
  /** Orders assets in ascending order from lowest to highest values */
  ASC: 'asc',
  /** Orders assets in descending order from highest to lowest values */
  DESC: 'desc',
} as const;
