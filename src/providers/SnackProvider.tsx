import {
  createContext,
  useContext,
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
import type { Snack, SnackType } from '@/types/snack';

interface SnackContextType {
  showSnack: (message: string, type?: SnackType) => void;
}

const SnackContext = createContext<SnackContextType | undefined>(undefined);

export function SnackProvider({ children }: PropsWithChildren) {
  const [snacks, setSnacks] = useState<Snack[]>([]);

  // Track active timers to secure clean garage collection upon infrastructure unmounts
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  // Clean up all pending macro-task timers when the provider gets unmounted
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  // Smoothly remove a specific snack from the active stack by ID and clear its timer
  const removeSnack = useCallback((id: string) => {
    setSnacks((prev) => prev.filter((snack) => snack.id !== id));

    const pendingTimer = timersRef.current.get(id);
    if (pendingTimer) {
      clearTimeout(pendingTimer);
      timersRef.current.delete(id);
    }
  }, []);

  // Public method to generate a new snack and trigger its auto-cleanup timer safely
  const showSnack = useCallback(
    (message: string, type: SnackType = SNACK_TYPES.INFO) => {
      const id = crypto.randomUUID();

      setSnacks((prev) => [...prev, { id, message, type }]);

      const timer = setTimeout(() => {
        removeSnack(id);
      }, SNACK_AUTOHIDE_DURATION);

      timersRef.current.set(id, timer);
    },
    [removeSnack]
  );

  // Freeze the public API surface area to block down-tree component thrashing
  const contextValue = useMemo(() => ({ showSnack }), [showSnack]);

  return (
    <SnackContext.Provider value={contextValue}>
      {children}

      {/* Floating fixed container holding the stack of snacks */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
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
                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg bg-white dark:bg-slate-900 transition-colors duration-200 ${
                  isSuccess
                    ? 'border-emerald-200 dark:border-emerald-900/50'
                    : isError
                      ? 'border-rose-200 dark:border-rose-900/50'
                      : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Dynamic Icon matching the notification status */}
                <div className="shrink-0 mt-0.5">
                  {isSuccess && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  )}
                  {isError && <AlertCircle className="h-5 w-5 text-rose-500" />}
                  {!isSuccess && !isError && (
                    <Info className="h-5 w-5 text-blue-500" />
                  )}
                </div>

                {/* Main informational text message */}
                <p className="grow text-sm font-medium text-slate-800 dark:text-slate-200 leading-normal wrap-break-words">
                  {snack.message}
                </p>

                {/* Manual dismiss button */}
                <button
                  type="button"
                  onClick={() => removeSnack(snack.id)}
                  className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-lg transition-colors cursor-pointer"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </SnackContext.Provider>
  );
}

export function useSnack() {
  const context = useContext(SnackContext);
  if (!context) {
    throw new Error('useSnack must be used within a SnackProvider');
  }
  return context;
}
