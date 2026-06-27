/**
 * Application routing configuration serving as a single source of truth for all paths.
 */
export const ROUTES = {
  HOME: '/',
  BOOKS: '/books',
  BOOK_DETAIL: '/books/:id',
  NOT_FOUND: '*',
} as const;

/**
 * Type safety helper representing any valid static route literal from the ROUTES object.
 */
export type AppRoutes = (typeof ROUTES)[keyof typeof ROUTES];

/**
 * Dynamic route path utility generators to prevent manual string interpolation across components.
 */
export const routeHelpers = {
  /**
   * Generates a valid path string for a specific book detail page.
   * @example routeHelpers.bookDetail('42') -> '/books/42'
   */
  bookDetail: (id: string | number): string => `/books/${id}`,
};
