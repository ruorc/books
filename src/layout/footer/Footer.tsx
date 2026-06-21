import { useAppMode } from '@/providers/AppModeProvider';
import { Code2, Terminal } from 'lucide-react';

export default function Footer() {
  const { mode } = useAppMode();

  return (
    <footer className="w-full border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row text-center sm:text-left">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            <p className="font-medium text-slate-700 dark:text-slate-300">
              SPA Book Catalog &copy; {new Date().getFullYear()}
            </p>
            <p className="mt-1 text-xs">
              Demonstration of Class vs. Functional Components approaches in
              React + TS
            </p>
          </div>

          <div className="flex flex-col items-center gap-1.5 sm:items-end">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Engine
            </span>

            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
              {mode === 'function' ? (
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
