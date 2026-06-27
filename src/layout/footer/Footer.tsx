import { Code2, Terminal } from 'lucide-react';
import { MODES } from '@/constants/mode';
import { useAppMode } from '@/providers/AppModeProvider';

// Static year constant for maximum performance and zero runtime overhead
const STATIC_YEAR = 2026 as const;

export default function Footer() {
  const { mode } = useAppMode();

  return (
    <footer className="w-full border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          {/* Left section: App branding and description */}
          <div className="text-sm text-slate-500 dark:text-slate-400">
            <p className="font-medium text-slate-700 dark:text-slate-300">
              SPA Book Catalog &copy; {STATIC_YEAR}
            </p>
            <p className="mt-1 text-xs">
              Demonstration of Class vs. Functional Components approaches in
              React + TS
            </p>
          </div>

          {/* Right section: Selected application mode indicator */}
          <div className="flex flex-col items-center gap-1.5 sm:items-end">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Engine
            </span>

            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/50 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700/50 dark:bg-slate-800 dark:text-slate-300">
              {mode === MODES.FUNCTIONAL ? (
                <>
                  <Code2 className="h-3.5 w-3.5 text-sky-500" />
                  <span>Functional Components</span>
                </>
              ) : (
                <>
                  <Terminal className="h-3.5 w-3.5 text-amber-500" />
                  <span>Class Components</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
