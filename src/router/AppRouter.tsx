import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '@/layout/Layout';
// import { BooksLayout } from '@/views/BooksDomain/layouts/BooksLayout';
import { PageLoader } from '@/components/PageLoader';
import { ROUTES } from '@/router/routes';

/**
 * Route bundle factories for code splitting and dynamic chunk resolution.
 * React Router expects dynamic route modules to export properties like Component, loader, action, etc.
 * Named exports from page modules are explicitly mapped to the Component property.
 */
const loadAboutPage = async () => {
  const { AboutPage } = await import('@/views/AboutPage');

  return { Component: AboutPage };
};
/* 
const loadBooksPage = async () => {
  const { default: BooksPage } = await import('@/views/BooksPage');

  return { Component: BooksPage };
};

const loadBookDetailPage = async () => {
  const { BookDetailPage, bookDetailLoader, bookDetailAction } =
    await import('@/views/BookDetailPage');

  return {
    Component: BookDetailPage,
    loader: bookDetailLoader,
    action: bookDetailAction,
  };
};
 */
const loadNotFoundPage = async () => {
  const { NotFoundPage } = await import('@/views/NotFoundPage');

  return { Component: NotFoundPage };
};

/**
 * Core application route configuration hierarchy tree mapping routes to specific page components.
 * The root route handles the global loader state during code-splitting bundle resolution via HydrateFallback.
 */
const routesConfiguration = [
  {
    path: '/',
    element: <Layout />,
    HydrateFallback: () => <PageLoader className="h-screen" />,
    children: [
      {
        path: ROUTES.HOME,
        lazy: loadAboutPage,
      },
      /* {
        element: <BooksLayout />,
        children: [
          {
            path: ROUTES.BOOKS,
            lazy: loadBooksPage,
          },
          {
            path: ROUTES.BOOK_DETAIL,
            lazy: loadBookDetailPage,
          },
        ],
      }, */
      {
        path: ROUTES.NOT_FOUND,
        lazy: loadNotFoundPage,
      },
    ],
  },
];

/**
 * Single stable router instance instantiated outside the component lifecycle.
 * Prevents redundant configuration re-initialization and route tree thrashing on component re-renders.
 */
const router = createBrowserRouter(routesConfiguration);

/**
 * Application Router root wrapper node infrastructure.
 * Clean functional wrapper passing the static router instance to the provider layer.
 */
export function AppRouter(): React.JSX.Element {
  return <RouterProvider router={router} />;
}
