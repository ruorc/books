import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '@/layout/Layout';
import { ROUTES } from './routes';

// Lazy loading views to split the bundle and optimize initial load time
const AboutPage = lazy(() => import('@/views/AboutPage/AboutPage'));
const BooksPage = lazy(() => import('@/views/BooksPage/BooksPage'));
const BookDetailPage = lazy(() => import('@/views/BookDetailPage/BookDetailPage'));
const NotFoundPage = lazy(() => import('@/views/NotFoundPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // Header and Footer will now stay persistent across navigation
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
