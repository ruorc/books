import { useState, useRef, type ReactNode } from 'react';
import { ConfirmModal } from './components/ConfirmModal';
import { ConfirmContext } from './ConfirmContext';

import type { ConfirmOptions } from './types/confirm';

/**
 * Structural contract defining properties expected by the global confirmation lifecycle coordinator.
 */
interface ConfirmProviderProps {
  /** The composite React element node children nested within the global confirm state pipeline */
  readonly children: ReactNode;
}

/**
 * Context Provider managing a centralized asynchronous confirmation lifecycle pipeline.
 * Injects a singular portal-ready instance of the accessible ConfirmModal to preserve memory allocations.
 * Manages mutable promise resolver references internally to intercept user choice vectors seamlessly.
 */
export function ConfirmProvider({
  children,
}: ConfirmProviderProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState<ConfirmOptions>({
    title: '',
    description: '',
  });

  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const showConfirm = (options: ConfirmOptions): Promise<boolean> => {
    setModalOptions(options);
    setIsOpen(true);

    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  };

  const handleConfirm = (): void => {
    setIsOpen(false);

    if (resolveRef.current) {
      resolveRef.current(true);
      resolveRef.current = null;
    }
  };

  const handleClose = (): void => {
    setIsOpen(false);

    if (resolveRef.current) {
      resolveRef.current(false);
      resolveRef.current = null;
    }
  };

  const contextValue = { showConfirm };

  return (
    <ConfirmContext value={contextValue}>
      {children}

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
    </ConfirmContext>
  );
}
