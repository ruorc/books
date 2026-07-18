import { createContext, useContext } from 'react';

import type { Snack } from './types/snack';

/**
 * Structural contract defining properties and mutation metrics managed by the Snack notification context.
 */
export interface SnackContextType {
  /**
   * Triggers a transient notification message overlay banner on the user interface.
   * Accepts the visible text description content and an optional severity category style configuration.
   */
  readonly showSnack: (message: string, type?: Snack) => void;
}

/**
 * React context storing the active client-side transient notification alerts dispatchers.
 */
export const SnackContext = createContext<SnackContextType | undefined>(
  undefined
);

/**
 * Safe consumer hook providing direct type-safe access to the global notification system stream.
 */
export function useSnack(): SnackContextType {
  const context = useContext(SnackContext);

  if (!context) {
    throw new Error('useSnack must be used within a SnackProvider');
  }

  return context;
}
