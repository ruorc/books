import { Link } from 'react-router-dom';
import { ROUTES } from '@/router/routes';

/**
 * Universal Fallback Error Presentation View.
 * Renders a semantic operational message boundary when the application routing network
 * encounters an unregistered destination path pattern.
 * Manages responsive structural layouts, dark theme topography adaptations,
 * and handles safe keyboard focus indicators during fallback home redirection.
 */
export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="animate-pulse text-9xl font-black text-sky-500">404</h1>

      <p className="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-50 sm:text-3xl">
        Page Not Found
      </p>

      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400 sm:text-base">
        Unfortunately, the page you are looking for does not exist or has been
        moved to a different address.
      </p>

      <Link
        to={ROUTES.HOME}
        className="mt-6 rounded-xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-sky-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
      >
        Return to Home
      </Link>
    </div>
  );
};
