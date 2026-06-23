import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  isDanger?: boolean;
}

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

  // 1. Handle keyboard events for accessibility (A11y)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    // Automatically focus the primary action button when modal opens
    setTimeout(() => confirmButtonRef.current?.focus(), 50);

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        // Fixed full-screen container overlay
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          
          {/* Backdrop Blur Fade In */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-slate-950/60"
          />

          {/* Modal Content Box Zoom In */}
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
            {/* Top Close Button icon */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Layout content structure */}
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl shrink-0 ${
                isDanger ? 'bg-rose-500/10 text-rose-500' : 'bg-indigo-500/10 text-indigo-500'
              }`}>
                <AlertTriangle className="h-6 w-6" />
              </div>

              <div className="space-y-1 grow">
                <h3 id="modal-title" className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  {title}
                </h3>
                <p id="modal-desc" className="text-sm text-slate-500 dark:text-slate-400 leading-normal">
                  {description}
                </p>
              </div>
            </div>

            {/* Action controls row */}
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-900 transition-all cursor-pointer"
              >
                {cancelLabel}
              </button>
              
              <button
                ref={confirmButtonRef}
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-all cursor-pointer ${
                  isDanger
                    ? 'bg-rose-500 hover:bg-rose-600 focus:ring-rose-500'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                }`}
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
