import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '@/layout/Layout';
import BooksLayout from '@/routers/layouts/BooksLayout';
import PageLoader from '@/components/PageLoader';
import { ROUTES } from '@/routers/routes'; // Normalized to absolute alias path

// Standard chunk-splitting code isolation bundles
const AboutPage = lazy(() => import('@/views/AboutPage/AboutPage'));
const BooksPage = lazy(() => import('@/views/BooksPage/BooksPage'));
const NotFoundPage = lazy(() => import('@/views/NotFoundPage'));

/**
 * Centered routing array scheme matrix map defining the application typography view layout nodes.
 * Isolated outside the main hook/component execution path to prevent redundant configuration thrashing.
 */
const routesConfiguration = [
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
            // Asynchronously load both the component and its data methods together to eliminate waterfall requests
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
];

/**
 * Core application Router Component wrapper.
 * Exclusively exports a singular React component node to satisfy Fast Refresh compiler rules perfectly.
 *
 * @returns The fully marshaled declarative RouterProvider configuration view tree.
 */
export default function AppRouter() {
  // Creating the router instance internally anchors it correctly within the component context tree boundaries
  const router = createBrowserRouter(routesConfiguration);

  return <RouterProvider router={router} />;
}
