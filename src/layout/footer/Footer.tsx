import { Code2, Terminal } from 'lucide-react';
import { MODES } from '@/context/AppMode/constants/modeConstants';
import { useAppMode } from '@/context/AppMode';

const STATIC_YEAR = 2026 as const;

/**
 * Strictly mapped architectural variant borders to keep the JSX layout clean and readable.
 * Abstracted safely within the local file boundary since styles change reactively based on mode.
 */
const BADGE_VARIANT_STYLES = {
  [MODES.FUNCTIONAL]: 'border-sky-200/50 dark:border-sky-700/50',
  [MODES.CLASS]: 'border-amber-200/50 dark:border-amber-700/50',
} as const;

/**
 * Global Footer Component rendering the platform baseline layout structure.
 * Provides copyright specifications, comparative architecture summaries, and
 * a live semantic visual badge tracking the active runtime strategy engine.
 */
export const Footer: React.FC = () => {
  const { mode } = useAppMode();

  return (
    <footer className="w-full border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            <p className="font-medium text-slate-700 dark:text-slate-300">
              SPA Book Catalog &copy; {STATIC_YEAR}
            </p>
            <p className="mt-1 text-xs">
              Demonstration of Class vs. Functional Components approaches in
              React + TS
            </p>
          </div>

          <div className="flex flex-col items-center gap-1.5 sm:items-end">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Engine
            </span>

            <div
              role="status"
              aria-live="polite"
              className={`inline-flex items-center gap-2 rounded-full border bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors duration-200 ${BADGE_VARIANT_STYLES[mode]}`}
            >
              {mode === MODES.FUNCTIONAL ? (
                <>
                  <Code2
                    aria-hidden="true"
                    className="h-3.5 w-3.5 text-sky-500"
                  />
                  <span>Functional Components</span>
                </>
              ) : (
                <>
                  <Terminal
                    aria-hidden="true"
                    className="h-3.5 w-3.5 text-amber-500"
                  />
                  <span>Class Components</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
