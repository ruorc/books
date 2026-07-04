import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { useFocusTrap } from '@/hooks/useFocusTrap';

/**
 * Structural communication contract defining all data properties
 * required to render the global confirmation interaction dialog window.
 * Features mandatory property documentation layout specifications above every signature field.
 */
interface ConfirmModalProps {
  /** Reactive state flag determining if the overlay view matrix is visible */
  readonly isOpen: boolean;
  /** Primary semantic text token rendered as the core structural header */
  readonly title: string;
  /** Deep textual explanation contextualizing the destructive or imperative action */
  readonly description: string;
  /** Optional interactive action title localized inside the execution trigger */
  readonly confirmLabel?: string;
  /** Optional cancellation layout title routed into the fallback trigger slot */
  readonly cancelLabel?: string;
  /** Direct resolution pipeline handler routing the confirmed operational callback */
  readonly onConfirm: () => void;
  /** Rejection overlay fallback handler driving modal closure state streams */
  readonly onClose: () => void;
  /** Visual theme vector flag routing layout styles to severe critical palettes */
  readonly isDanger?: boolean;
}

const ICON_WRAPPER_VARIANTS = {
  danger: 'p-3 rounded-xl shrink-0 bg-rose-500/10 text-rose-500',
  standard: 'p-3 rounded-xl shrink-0 bg-indigo-500/10 text-indigo-500',
} as const;

const CONFIRM_BUTTON_VARIANTS = {
  danger: 'bg-rose-500 hover:bg-rose-600 focus:ring-rose-500',
  standard: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
} as const;

/**
 * Universal Shared Asynchronous Confirm Modal Component.
 * Integrates an abstract custom focus trap utility hook to enforce perfect digital accessibility.
 * Embeds utility topography classes directly into the JSX stream to support utility-first isolation.
 * Follows strict constraints: zero inline comments in JSX, mandatory readonly flags, and tagless JSDoc.
 */
export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onClose,
  isDanger = false,
}: ConfirmModalProps) {
  const { firstRef, secondRef, thirdRef } = useFocusTrap({ isOpen, onClose });
  const severityKey = isDanger ? 'danger' : 'standard';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-slate-950/60"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 transition-colors duration-200 z-10"
          >
            <button
              ref={firstRef}
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 rounded-lg transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-4">
              <div className={ICON_WRAPPER_VARIANTS[severityKey]}>
                <AlertTriangle aria-hidden="true" className="h-6 w-6" />
              </div>

              <div className="space-y-1 grow">
                <h3
                  id="modal-title"
                  className="text-lg font-bold text-slate-900 dark:text-slate-50"
                >
                  {title}
                </h3>
                <p
                  id="modal-desc"
                  className="text-sm text-slate-500 dark:text-slate-400 leading-normal"
                >
                  {description}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                ref={secondRef}
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-900 transition-all cursor-pointer"
              >
                {cancelLabel}
              </button>

              <button
                ref={thirdRef}
                type="button"
                onClick={onConfirm}
                className={`rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus-offset-slate-900 transition-all cursor-pointer ${CONFIRM_BUTTON_VARIANTS[severityKey]}`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
