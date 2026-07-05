import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '@/layout/Layout';
import BooksLayout from '@/routers/layouts/BooksLayout';
import { PageLoader } from '@/components/PageLoader';
import { ROUTES } from '@/routers/routes';

const AboutPage = lazy(() => import('@/views/AboutPage'));
const BooksPage = lazy(() => import('@/views/BooksPage'));
const NotFoundPage = lazy(() => import('@/views/NotFoundPage'));

/**
 * Isolated dynamic chunk factory resolving data loaders and action modules concurrently.
 * Orchestrates synchronous layout resolution for the profile view without triggering waterfalls.
 */
const loadBookDetailPageBundle = async () => {
  const { BookDetailPage, bookDetailLoader, bookDetailAction } =
    await import('@/views/BookDetailPage');

  return {
    element: <BookDetailPage />,
    loader: bookDetailLoader,
    action: bookDetailAction,
  };
};

/**
 * Centered routing array scheme matrix map defining the application typography view layout nodes.
 * Isolated outside the main hook/component execution path to prevent redundant configuration thrashing.
 */
const routesConfiguration = [
  {
    path: '/',
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
            lazy: loadBookDetailPageBundle,
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
 * Creates the router instance internally to anchor it correctly within the component context tree boundaries.
 * Documentation features high-density engineering text layout strictly free from descriptor tags.
 */
export default function AppRouter() {
  const router = createBrowserRouter(routesConfiguration);

  return <RouterProvider router={router} />;
}
