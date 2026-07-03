import {
  useState,
  useCallback,
  useRef,
  useMemo,
  type PropsWithChildren,
} from 'react';
import { ConfirmModal } from '@/components/ConfirmModal';
import { ConfirmContext } from './ConfirmContext';
import type { ConfirmOptions } from './ConfirmContext';

/**
 * Context Provider managing a centralized asynchronous confirmation lifecycle pipeline.
 * Injects a singular portal-ready instance of the accessible ConfirmModal to preserve memory.
 */
export function ConfirmProvider({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState<ConfirmOptions>({
    title: '',
    description: '',
  });

  // Store the resolver function of the Promise to execute it upon user action
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  /**
   * Triggers the global confirmation flow and returns a Promise waiting for explicit user interaction.
   */
  const showConfirm = useCallback(
    (options: ConfirmOptions): Promise<boolean> => {
      setModalOptions(options);
      setIsOpen(true);

      // Return a promise that will be resolved when the user clicks confirm or cancel
      return new Promise<boolean>((resolve) => {
        resolveRef.current = resolve;
      });
    },
    []
  );

  /**
   * Resolves the pending transaction promise with true and resets the resolver reference.
   */
  const handleConfirm = useCallback(() => {
    setIsOpen(false);

    if (resolveRef.current) {
      resolveRef.current(true);
      resolveRef.current = null;
    }
  }, []);

  /**
   * Resolves the pending transaction promise with false upon rejection or backdrop closure.
   */
  const handleClose = useCallback(() => {
    setIsOpen(false);

    if (resolveRef.current) {
      resolveRef.current(false);
      resolveRef.current = null;
    }
  }, []);

  // Memoize the context pipeline payload to prevent redundant cascading re-renders down the tree
  const contextValue = useMemo(() => ({ showConfirm }), [showConfirm]);

  return (
    <ConfirmContext.Provider value={contextValue}>
      {children}

      {/* Single global instance of the accessible confirm modal */}
      <ConfirmModal
        isOpen={isOpen}
        title={modalOptions.title}
        description={modalOptions.description}
        confirmLabel={modalOptions.confirmLabel}
        cancelLabel={modalOptions.cancelLabel}
        isDanger={modalOptions.isDanger}
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    </ConfirmContext.Provider>
  );
}
