import { NavLink } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { ROUTES } from '@/router/routes';
import { ModeSelector } from '@/components/ModeSelector';
import { ThemeSelector } from '@/components/ThemeSelector';
import { useAppMode } from '@/providers/AppModeProvider';

// Shared navigation link styling function
const linkStyles = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-semibold transition-colors duration-200 focus:outline-none ${
    isActive
      ? 'text-indigo-600 dark:text-indigo-400 cursor-default pointer-events-none'
      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 cursor-pointer'
  }`;

// Click interceptor to prevent rerenders when clicking on an already active route
const handlePreventActiveClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
  const link = e.currentTarget;
  if (link.classList.contains('active') || link.getAttribute('aria-current') === 'page') {
    e.preventDefault();
  }
};

export default function Header() {
  const { mode, setMode, isModeLoading } = useAppMode();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left side: Logo and Route Navigation */}
        <div className="flex items-center gap-8">
          <NavLink
            to={ROUTES.HOME}
            onClick={handlePreventActiveClick}
            className={({ isActive }) => 
              `flex items-center gap-2 text-slate-900 dark:text-slate-50 font-bold text-lg tracking-tight focus:outline-none ${
                isActive ? 'cursor-default pointer-events-none' : 'cursor-pointer'
              }`
            }
          >
            <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">BookSPA</span>
          </NavLink>

          <nav className="flex items-center gap-6">
            <NavLink 
              to={ROUTES.HOME} 
              className={linkStyles}
              onClick={handlePreventActiveClick}
            >
              About
            </NavLink>
            <NavLink 
              to={ROUTES.BOOKS} 
              className={linkStyles}
              onClick={handlePreventActiveClick}
            >
              Books
            </NavLink>
          </nav>
        </div>

        {/* Right side: Mode and Theme interactive controllers */}
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
