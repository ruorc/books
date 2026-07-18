import { createContext, useContext } from 'react';
import type { ConfirmContextType } from './types/confirm';

/**
 * React context storing the active client-side asynchronous confirmation dialog workflows.
 */
export const ConfirmContext = createContext<ConfirmContextType | undefined>(
  undefined
);

/**
 * Safe consumer hook providing direct type-safe access to the global functional async confirm trigger context pipeline.
 */
export function useConfirm(): ConfirmContextType {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }

  return context;
}
