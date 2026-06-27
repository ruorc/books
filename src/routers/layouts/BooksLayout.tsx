import { Outlet, ScrollRestoration } from 'react-router-dom';
import { BooksCatalogProvider } from '@/views/BooksPage/context/BooksCatalogContext';

/**
 * Books Domain Layout Boundary.
 * Encapsulates the state machine for filters, pagination, and data streaming
 * specifically for books views, and automatically cleans up memory upon exit.
 */
export default function BooksLayout() {
  return (
    <BooksCatalogProvider>
      {/* Enables browser viewport position logging for all nested components inside the books domain scope */}
      <ScrollRestoration />
      <Outlet />
    </BooksCatalogProvider>
  );
}
