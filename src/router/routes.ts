export const ROUTES = {
  HOME: '/',
  BOOKS: '/books',
  BOOK_DETAIL: '/books/:id',
  NOT_FOUND: '*',
} as const;

// Type safety so TypeScript knows all available paths
export type AppRoutes = (typeof ROUTES)[keyof typeof ROUTES];
