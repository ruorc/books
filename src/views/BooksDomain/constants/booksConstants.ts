/**
 * Core business domain constants for the books management layout space.
 * Shared across multiple view modules including the catalog cluster and item profiles.
 */

/** Maximum number of elements returned per structured pagination offset segment */
export const BOOKS_PER_PAGE_LIMIT = 12 as const;

/** Client-side persistent key tracking user preferences for favorite-only items filtering */
export const FAVORITES_FILTER_KEY = 'books-show-fav-only' as const;

/**
 * Universal data dictionary mapping layout filter field identifiers.
 * Governs active route parameters and network payload keys for catalog querying.
 */
export const FILTER_FIELDS = {
  /** Target filtering operations using the strict author identity token attribute */
  AUTHOR: 'author',
  /** Target filtering operations using the strict historical book writing calendar year */
  WRITING_YEAR: 'year',
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
  /** Target operations using the shared historical book writing calendar year token */
  WRITING_YEAR: FILTER_FIELDS.WRITING_YEAR,
  /** Target operations using the initial infrastructure record insertion timestamp */
  CREATED_AT: 'createdAt',
} as const;

/**
 * Structural vector configuration mapping permitted ordering layout directions.
 * Dictates whether backend query streams organize metrics in increasing or decreasing scale.
 */
export const SORT_DIRECTIONS = {
  /** Orders assets in ascending order from lowest to highest values */
  ASC: 'asc',
  /** Orders assets in descending order from highest to lowest values */
  DESC: 'desc',
} as const;

/** Default database model attribute applied to order query records when no explicit user layout override exists */
export const DEFAULT_SORT_FIELD = SORT_FIELDS.TITLE;

/** Default directional vector matrix applied to order query records when no explicit user layout override exists */
export const DEFAULT_SORT_DIRECTION = SORT_DIRECTIONS.ASC;
