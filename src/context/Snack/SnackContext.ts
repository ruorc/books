import { createContext, useContext } from 'react';
import type { SnackType } from '@/types/snack';

/**
 * Structural contract defining properties and mutation metrics managed by the Snack notification context.
 * Features mandatory property documentation layout specifications above every signature field.
 */
export interface SnackContextType {
  /**
   * Triggers a transient notification message overlay banner on the user interface.
   * Accepts the visible text description content and an optional severity category style configuration.
   */
  showSnack: (message: string, type?: SnackType) => void;
}

/**
 * React context storing the active client-side transient notification alerts dispatchers.
 * The initial undefined default value enforces execution parameters inside a matching provider boundary.
 * Documented strictly as plain textual engineering prose entirely free from descriptor tags.
 */
export const SnackContext = createContext<SnackContextType | undefined>(
  undefined
);

/**
 * Safe consumer hook providing direct type-safe access to the global notification system stream.
 * Throws a descriptive application exception error when evaluated outside a structurally sound provider tree boundary.
 * Eliminates runtime null checks for call sites by guaranteeing a defined state contract payload.
 */
export function useSnack() {
  const context = useContext(SnackContext);

  if (!context) {
    throw new Error('useSnack must be used within a SnackProvider');
  }

  return context;
}
