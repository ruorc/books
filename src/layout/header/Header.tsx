import { NavLink } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { ROUTES } from '@/router/routes';
import { useAppMode } from '@/context/AppMode';
import { ModeSelector } from './components/ModeSelector';
import { ThemeSelector } from './components/ThemeSelector';

/**
 * Pure stable styling engine for generic navigation links.
 */
const getLinkStyles = ({ isActive }: { readonly isActive: boolean }): string =>
  `text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg px-2 py-1 ${
    isActive
      ? 'text-indigo-600 dark:text-indigo-400 cursor-default pointer-events-none'
      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 cursor-pointer'
  }`;

/**
 * Pure stable styling engine for the brand logo block.
 */
const getLogoStyles = ({ isActive }: { readonly isActive: boolean }): string =>
  `flex items-center gap-2 text-slate-900 dark:text-slate-50 font-bold text-lg tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1 ${
    isActive ? 'cursor-default pointer-events-none' : 'cursor-pointer'
  }`;

/**
 * Click interceptor to prevent rerenders and network stack triggers when clicking on an already active route.
 */
const handlePreventActiveClick = (
  e: React.MouseEvent<HTMLAnchorElement>
): void => {
  const link = e.currentTarget;

  if (
    link.classList.contains('active') ||
    link.getAttribute('aria-current') === 'page'
  ) {
    e.preventDefault();
  }
};

/**
 * Global Header Component rendering the primary application navigation bar.
 * Handles configuration switches for application theme selection and core runtime paradigm engines.
 * Manages sticky positioning layout, backdrop blurs, responsive utility menus, and strict screen reader contexts.
 */
export const Header: React.FC = () => {
  const { mode, setMode, isModeLoading } = useAppMode();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <NavLink
            to={ROUTES.HOME}
            onClick={handlePreventActiveClick}
            className={getLogoStyles}
            aria-label="BookSPA Home"
          >
            <BookOpen
              aria-hidden="true"
              className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
            />
            <span className="hidden sm:inline">BookSPA</span>
          </NavLink>

          <nav className="flex items-center gap-6" aria-label="Main navigation">
            <NavLink
              to={ROUTES.HOME}
              className={getLinkStyles}
              onClick={handlePreventActiveClick}
            >
              About
            </NavLink>
            <NavLink
              to={ROUTES.BOOKS}
              className={getLinkStyles}
              onClick={handlePreventActiveClick}
            >
              Books
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <ModeSelector
              mode={mode}
              onChange={setMode}
              isLoading={isModeLoading}
            />
          </div>
          <ThemeSelector />
        </div>
      </div>
    </header>
  );
};
