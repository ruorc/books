import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '@/layout/Layout';
import BooksLayout from '@/routers/layouts/BooksLayout';
import PageLoader from '@/components/PageLoader';
import { ROUTES } from './routes';

// Import loader along with the view directly to execute non-blocking layout route pre-fetching
import BookDetailPage, {
  bookDetailLoader,
} from '@/views/BookDetailPage/BookDetailPage';

// Standard chunk-splitting code isolation bundles
const AboutPage = lazy(() => import('@/views/AboutPage/AboutPage'));
const BooksPage = lazy(() => import('@/views/BooksPage/BooksPage'));
const NotFoundPage = lazy(() => import('@/views/NotFoundPage'));

const router = createBrowserRouter([
  {
    path: '/',
    // Protected by a root Suspense context guarding initial chunks assembly drops
    element: (
      <Suspense fallback={<PageLoader className="h-screen" />}>
        <Layout />
      </Suspense>
    ),
    children: [
      {
        path: ROUTES.HOME,
        element: <AboutPage />,
      },
      {
        element: <BooksLayout />,
        children: [
          {
            path: ROUTES.BOOKS,
            element: <BooksPage />,
          },
          {
            path: ROUTES.BOOK_DETAIL,
            element: <BookDetailPage />,
            // Linking the declarative data stream loader straight into the routing node mapping
            loader: bookDetailLoader,
          },
        ],
      },
      {
        path: ROUTES.NOT_FOUND,
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
