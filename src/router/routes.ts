/**
 * Application routing configuration serving as a single source of truth for all paths.
 */
export const ROUTES = {
  /** The primary dashboard, landing page, or catalog entry view */
  HOME: '/',
  /** The complete collection catalog viewing space */
  BOOKS: '/books',
  /** The abstract template route path targeting a single book entity profile */
  BOOK_DETAIL: '/books/:id',
  /** The catch-all fallback route pattern handling unknown destination paths */
  NOT_FOUND: '*',
} as const;

/**
 * Type safety helper representing any valid layout route definition template from the ROUTES object.
 * Resolves to the raw path patterns used strictly during route registration.
 */
export type AppRoutePattern = (typeof ROUTES)[keyof typeof ROUTES];

/**
 * Dynamic route path utility generators to prevent manual string interpolation across components.
 * Guarantees valid URI pattern outputs for direct application navigation consumption.
 */
export const routeHelpers = {
  /**
   * Generates a valid absolute path string for a specific book detail profile view.
   * Accepts a strict unique non-nullable string identifier matching the core Book domain entity id contract.
   * Produces a fully qualified destination route path format string like forward slash books forward slash id.
   */
  bookDetail: (id: string): string => `/books/${id}`,
} as const;
