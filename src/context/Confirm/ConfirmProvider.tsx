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
 * Injects a singular portal-ready instance of the accessible ConfirmModal to preserve memory allocations.
 * Manages mutable promise resolver references internally to intercept user choice vectors seamlessly.
 * Fully optimized under React 19 context rendering constraints and free from tag descriptors.
 */
export function ConfirmProvider({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState<ConfirmOptions>({
    title: '',
    description: '',
  });

  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const showConfirm = useCallback(
    (options: ConfirmOptions): Promise<boolean> => {
      setModalOptions(options);
      setIsOpen(true);

      return new Promise<boolean>((resolve) => {
        resolveRef.current = resolve;
      });
    },
    []
  );

  const handleConfirm = useCallback(() => {
    setIsOpen(false);

    if (resolveRef.current) {
      resolveRef.current(true);
      resolveRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);

    if (resolveRef.current) {
      resolveRef.current(false);
      resolveRef.current = null;
    }
  }, []);

  const contextValue = useMemo(() => ({ showConfirm }), [showConfirm]);

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
