import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { SNACKS, SNACK_DISPLAY_DURATION } from './constants/snackConstants';
import { SnackContext } from './SnackContext';
import { generateRuntimeId } from '@/utils/crypto';

import type { SnackItem, Snack } from './types/snack';

/**
 * Structural contract defining properties expected by the global snack notification coordinator.
 */
interface SnackProviderProps {
  /** The composite React element node children nested within the visual alert system tree */
  readonly children: ReactNode;
}

const SNACK_VARIANT_STYLES = {
  [SNACKS.SUCCESS]: 'border-emerald-200 dark:border-emerald-900/50',
  [SNACKS.ERROR]: 'border-rose-200 dark:border-rose-900/50',
  [SNACKS.INFO]: 'border-slate-200 dark:border-slate-800',
  [SNACKS.WARNING]: 'border-amber-200 dark:border-amber-900/50',
} as const;

const SNACK_ICON_VARIANTS = {
  [SNACKS.SUCCESS]: {
    Component: CheckCircle2,
    className: 'h-5 w-5 text-emerald-500',
  },
  [SNACKS.ERROR]: {
    Component: AlertCircle,
    className: 'h-5 w-5 text-rose-500',
  },
  [SNACKS.INFO]: {
    Component: Info,
    className: 'h-5 w-5 text-blue-500',
  },
  [SNACKS.WARNING]: {
    Component: AlertCircle,
    className: 'h-5 w-5 text-amber-500',
  },
} as const;

/**
 * Context Provider managing a coordinated floating notification alert queue.
 * Restores state tracking arrays and hooks garbage collection micro-tasks via timeouts.
 * Handles automatic background cleanup and safe runtime unique identifier seeding.
 * Fully optimized under React 19 context rendering constraints and free from tag descriptors.
 */
export function SnackProvider({ children }: SnackProviderProps) {
  const [snacks, setSnacks] = useState<readonly SnackItem[]>([]);

  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  useEffect(() => {
    const currentTimers = timersRef.current;

    return () => {
      currentTimers.forEach((timer) => clearTimeout(timer));
      currentTimers.clear();
    };
  }, []);

  const removeSnack = useCallback((id: string) => {
    setSnacks((prev) => prev.filter((snack) => snack.id !== id));

    const pendingTimer = timersRef.current.get(id);

    if (pendingTimer) {
      clearTimeout(pendingTimer);
      timersRef.current.delete(id);
    }
  }, []);

  const showSnack = useCallback(
    (message: string, type: Snack = SNACKS.INFO) => {
      const id = generateRuntimeId();

      setSnacks((prev) => [...prev, { id, message, type }]);

      const timer = setTimeout(() => {
        removeSnack(id);
      }, SNACK_DISPLAY_DURATION);

      timersRef.current.set(id, timer);
    },
    [removeSnack]
  );

  const contextValue = useMemo(() => ({ showSnack }), [showSnack]);

  return (
    <SnackContext value={contextValue}>
      {children}

      <div
        role="region"
        aria-label="Notifications"
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none"
      >
        <AnimatePresence>
          {snacks.map((snack) => {
            const iconConfig = SNACK_ICON_VARIANTS[snack.type];
            const IconComponent = iconConfig.Component;

            return (
              <motion.div
                key={snack.id}
                layout
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg bg-white dark:bg-slate-900 transition-colors duration-200 ${SNACK_VARIANT_STYLES[snack.type]}`}
              >
                <div className="shrink-0 mt-0.5">
                  <IconComponent
                    aria-hidden="true"
                    className={iconConfig.className}
                  />
                </div>

                <p className="grow text-sm font-medium text-slate-800 dark:text-slate-200 leading-normal wrap-break-words">
                  {snack.message}
                </p>

                <button
                  type="button"
                  onClick={() => removeSnack(snack.id)}
                  className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-lg transition-colors cursor-pointer"
                  aria-label="Dismiss notification"
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </SnackContext>
  );
}
