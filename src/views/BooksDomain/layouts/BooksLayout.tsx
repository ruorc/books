import { Outlet, ScrollRestoration } from 'react-router-dom';
import { BooksCatalogProvider } from '@/views/BooksPage/context/BooksCatalogContext';

/**
 * Books Domain Layout Boundary Component.
 * Encapsulates the state machine for filters, pagination, and data streaming
 * specifically for books views, and automatically cleans up memory upon exit.
 * Injects a singular instance of ScrollRestoration to enable native-like
 * browser viewport position logging across all nested components in the books scope.
 * Renders the structured contextual grid boundary enclosing child nested routes via Outlet.
 */
export const BooksLayout: React.FC = () => {
  return (
    <BooksCatalogProvider>
      <ScrollRestoration />
      <Outlet />
    </BooksCatalogProvider>
  );
};
