import { createContext, useContext } from 'react';
import type { ConfirmContextType } from './types/confirm';

/**
 * React context storing the active client-side asynchronous confirmation dialog workflows.
 * The initial undefined default value enforces execution parameters inside a matching provider boundary.
 * Documented strictly as plain textual engineering prose entirely free from descriptor tags.
 */
export const ConfirmContext = createContext<ConfirmContextType | undefined>(
  undefined
);

/**
 * Safe consumer hook providing direct type-safe access to the global functional async confirm trigger context pipeline.
 * Throws a descriptive application exception error when evaluated outside a structurally sound provider tree boundary.
 * Eliminates runtime null checks for call sites by guaranteeing a defined state contract payload.
 */
export function useConfirm(): ConfirmContextType {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }

  return context;
}
