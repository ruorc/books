import { NavLink, useLocation } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { ROUTES } from '@/router/routes';
import { ModeSelector } from '@/components/ModeSelector';
import { ThemeSelector } from '@/components/ThemeSelector';
import { useAppMode } from '@/providers/AppModeProvider';

export default function Header() {
  const { mode, setMode, isModeLoading } = useAppMode();
  const location = useLocation();
  const isHomePage = location.pathname === ROUTES.HOME;

  const linkStyles = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold transition-colors duration-200 ${
      isActive
        ? 'text-indigo-600 dark:text-indigo-400 cursor-default'
        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 cursor-pointer'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left side: Logo and Navigation */}
        <div className="flex items-center gap-8">
          <NavLink
            to={ROUTES.HOME}
            className={`flex items-center gap-2 text-slate-900 dark:text-slate-50 font-bold text-lg tracking-tight focus:outline-none ${
              isHomePage ? 'cursor-default' : 'cursor-pointer'
            }`}
          >
            <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">BookSPA</span>
          </NavLink>

          <nav className="flex items-center gap-6">
            <NavLink to={ROUTES.HOME} className={linkStyles}>
              About
            </NavLink>
            <NavLink to={ROUTES.BOOKS} className={linkStyles}>
              Books
            </NavLink>
          </nav>
        </div>

        {/* Right side: Interactive toggles */}
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
}
