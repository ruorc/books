import { createContext, useContext, useState, useCallback, useRef, type PropsWithChildren } from 'react';
import { ConfirmModal } from '@/components/ConfirmModal';

interface ConfirmOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
}

interface ConfirmContextType {
  showConfirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmProvider({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState<ConfirmOptions>({ title: '', description: '' });
  
  // Store the resolver function of the Promise to execute it upon user action
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const showConfirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    setModalOptions(options);
    setIsOpen(true);
    
    // Return a promise that will be resolved when the user clicks confirm or cancel
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

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

  return (
    <ConfirmContext.Provider value={{ showConfirm }}>
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

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
}
