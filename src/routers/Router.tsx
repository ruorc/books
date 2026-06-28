import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '@/layout/Layout';
import BooksLayout from '@/routers/layouts/BooksLayout';
import PageLoader from '@/components/PageLoader';
import { ROUTES } from './routes';

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
            // Asynchronously load both the component and its data methods together
            lazy: async () => {
              const {
                default: BookDetailPage,
                bookDetailLoader,
                bookDetailAction,
              } = await import('@/views/BookDetailPage/BookDetailPage');
              return {
                element: <BookDetailPage />,
                loader: bookDetailLoader,
                action: bookDetailAction,
              };
            },
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
