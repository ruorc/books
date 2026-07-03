import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  readonly isOpen: boolean;
  readonly title: string;
  readonly description: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly onConfirm: () => void;
  readonly onClose: () => void;
  readonly isDanger?: boolean;
}

/**
 * Base layout formatting classes applied to the root container overlay.
 */
const OVERLAY_STYLE =
  'fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto' as const;

/**
 * Backdrop backdrop mask overlay background blending layout classes.
 */
const BACKDROP_STYLE =
  'fixed inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-slate-950/60' as const;

/**
 * Centered modal structural card dialog presentation styles matrix wrapper.
 */
const MODAL_CARD_STYLE =
  'relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 transition-colors duration-200 z-10' as const;

/**
 * Generic control style applied to the top dimensional interactive close icon.
 */
const CLOSE_BUTTON_STYLE =
  'absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 rounded-lg transition-colors cursor-pointer' as const;

/**
 * Cancel controller button background and border design theme presentation layout classes.
 */
const CANCEL_BUTTON_STYLE =
  'rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-900 transition-all cursor-pointer' as const;

/**
 * Common baseline layout classes shared across all confirmation action triggers.
 */
const CONFIRM_BUTTON_BASE_STYLE =
  'rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus-offset-slate-900 transition-all cursor-pointer' as const;

/**
 * Local variant mapping dictionary isolating icon wrapping decorations.
 */
const ICON_WRAPPER_VARIANTS = {
  danger: 'p-3 rounded-xl shrink-0 bg-rose-500/10 text-rose-500',
  standard: 'p-3 rounded-xl shrink-0 bg-indigo-500/10 text-indigo-500',
} as const;

/**
 * Local variant mapping dictionary isolating confirm button themes.
 */
const CONFIRM_BUTTON_VARIANTS = {
  danger: 'bg-rose-500 hover:bg-rose-600 focus:ring-rose-500',
  standard: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
} as const;

/**
 * Universal Imperative Asynchronous Confirm Modal Component.
 * Intercepts user focus matrices and captures browser navigation keystrokes natively.
 * Fully compatible with React 19 concurrent paradigms and modern Tailwind CSS v4 design boundaries.
 *
 * Follows strict constraints from AGENTS.md: zero inline comments in JSX,
 * English-only documentation, absolute alignment properties, and structured variant mapping.
 *
 * @param props - Explicit presentation layout attributes and interaction dispatchers.
 * @returns The declarative overlay portal layout or null context.
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
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();

        return;
      }

      if (e.key === 'Tab') {
        const focusableElements: (HTMLElement | null)[] = [
          closeButtonRef.current,
          cancelButtonRef.current,
          confirmButtonRef.current,
        ];
        const activeIndex = focusableElements.indexOf(
          document.activeElement as HTMLElement
        );

        if (e.shiftKey) {
          if (activeIndex === 0) {
            confirmButtonRef.current?.focus();
            e.preventDefault();
          }
        } else {
          if (activeIndex === focusableElements.length - 1) {
            closeButtonRef.current?.focus();
            e.preventDefault();
          }
        }
      }
    };

    const focusTimeout = setTimeout(
      () => confirmButtonRef.current?.focus(),
      50
    );

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimeout);
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const severityKey = isDanger ? 'danger' : 'standard';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={OVERLAY_STYLE}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={BACKDROP_STYLE}
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
            className={MODAL_CARD_STYLE}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className={CLOSE_BUTTON_STYLE}
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
                ref={cancelButtonRef}
                type="button"
                onClick={onClose}
                className={CANCEL_BUTTON_STYLE}
              >
                {cancelLabel}
              </button>

              <button
                ref={confirmButtonRef}
                type="button"
                onClick={onConfirm}
                className={`${CONFIRM_BUTTON_BASE_STYLE} ${CONFIRM_BUTTON_VARIANTS[severityKey]}`}
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
