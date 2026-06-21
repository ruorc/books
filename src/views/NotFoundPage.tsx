import { Link } from 'react-router-dom';
import { ROUTES } from '@/router/routes';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <h1 className="text-9xl font-black text-sky-500 animate-pulse">404</h1>
      <p className="mt-4 text-2xl font-bold text-slate-200 sm:text-3xl">
        Page Not Found
      </p>
      <p className="mt-2 text-slate-400 max-w-md">
        Unfortunately, the page you are looking for does not exist or has been
        moved to a different address.
      </p>
      <Link
        to={ROUTES.HOME}
        className="mt-6 rounded-lg bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-sky-400 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
      >
        Return to Home
      </Link>
    </div>
  );
}
