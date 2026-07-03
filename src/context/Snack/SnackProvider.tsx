import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  type PropsWithChildren,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { SNACK_TYPES, SNACK_AUTOHIDE_DURATION } from '@/constants/snack';
import { SnackContext } from './SnackContext';
import type { Snack, SnackType } from '@/types/snack';
import { generateRuntimeId } from '@/config/crypto';

/**
 * Common baseline layout classes applied to every individual snack card.
 * Kept local and immutable to secure performance and typography cohesion.
 */
const SNACK_BASE_STYLE =
  'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg bg-white dark:bg-slate-900 transition-colors duration-200' as const;

/**
 * Strict reactive variant mapping for semantic boundary alerts.
 * Fully compliant with the updated AGENTS.md local layout exception guidelines.
 */
const SNACK_VARIANT_STYLES = {
  [SNACK_TYPES.SUCCESS]: 'border-emerald-200 dark:border-emerald-900/50',
  [SNACK_TYPES.ERROR]: 'border-rose-200 dark:border-rose-900/50',
  [SNACK_TYPES.INFO]: 'border-slate-200 dark:border-slate-800',
} as const;

/**
 * Context Provider managing a coordinated floating notification alert queue.
 * Handles automatic background garbage collection and safe runtime unique id seeding.
 *
 * Follows strict constraints from AGENTS.md: zero inline comments in JSX,
 * English-only documentation, full screen-reader support, and clean Tailwind layout abstraction.
 *
 * @param props - Standard React context properties containing layout children nodes.
 * @returns The structured contextual notification tree enclosing child elements.
 */
export function SnackProvider({ children }: PropsWithChildren) {
  const [snacks, setSnacks] = useState<Snack[]>([]);

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
    (message: string, type: SnackType = SNACK_TYPES.INFO) => {
      // Take the raw generated string as a stable structural key
      const id = generateRuntimeId();

      setSnacks((prev) => [...prev, { id, message, type }]);

      const timer = setTimeout(() => {
        removeSnack(id);
      }, SNACK_AUTOHIDE_DURATION);

      timersRef.current.set(id, timer);
    },
    [removeSnack]
  );

  const contextValue = useMemo(() => ({ showSnack }), [showSnack]);

  return (
    <SnackContext.Provider value={contextValue}>
      {children}

      <div
        role="region"
        aria-label="Notifications"
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none"
      >
        <AnimatePresence>
          {snacks.map((snack) => {
            const isSuccess = snack.type === SNACK_TYPES.SUCCESS;
            const isError = snack.type === SNACK_TYPES.ERROR;

            return (
              <motion.div
                key={snack.id}
                layout
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                className={`${SNACK_BASE_STYLE} ${SNACK_VARIANT_STYLES[snack.type]}`}
              >
                <div className="shrink-0 mt-0.5">
                  {isSuccess && (
                    <CheckCircle2
                      aria-hidden="true"
                      className="h-5 w-5 text-emerald-500"
                    />
                  )}
                  {isError && (
                    <AlertCircle
                      aria-hidden="true"
                      className="h-5 w-5 text-rose-500"
                    />
                  )}
                  {!isSuccess && !isError && (
                    <Info
                      aria-hidden="true"
                      className="h-5 w-5 text-blue-500"
                    />
                  )}
                </div>

                <p className="grow text-sm font-medium text-slate-800 dark:text-slate-200 leading-normal wrap-break-words">
                  {snack.message}
                </p>

                <button
                  type="button"
                  onClick={() => removeSnack(snack.id)}
                  className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-lg transition-colors cursor-pointer"
                  aria-label="Dismiss notification"
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </SnackContext.Provider>
  );
}
