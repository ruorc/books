import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '@/layout/Layout';
import PageLoader from '@/components/PageLoader';
import { ROUTES } from './routes';

const AboutPage = lazy(() => import('@/views/AboutPage/AboutPage'));
const BooksPage = lazy(() => import('@/views/BooksPage/BooksPage'));
const BookDetailPage = lazy(
  () => import('@/views/BookDetailPage/BookDetailPage')
);
const NotFoundPage = lazy(() => import('@/views/NotFoundPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoader />}>
        <Layout />
      </Suspense>
    ),
    children: [
      {
        path: ROUTES.HOME,
        element: <AboutPage />,
      },
      {
        path: ROUTES.BOOKS,
        element: <BooksPage />,
      },
      {
        path: ROUTES.BOOK_DETAIL,
        element: <BookDetailPage />,
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
