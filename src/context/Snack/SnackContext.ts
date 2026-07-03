import { createContext, useContext } from 'react';
import type { SnackType } from '@/types/snack';

export interface SnackContextType {
  /**
   * Triggers a transient notification message overlay on the user interface.
   *
   * @param message - The text content to display within the active notification card.
   * @param type - The severity category style configuration ('success' | 'error' | 'info').
   */
  showSnack: (message: string, type?: SnackType) => void;
}

export const SnackContext = createContext<SnackContextType | undefined>(
  undefined
);

/**
 * Custom hook providing direct, type-safe access to the global notification stream.
 *
 * @returns The interface methods allowed to dispatch snack notification banners.
 * @throws {Error} If consumed outside a structurally sound SnackProvider tree node.
 */
export function useSnack() {
  const context = useContext(SnackContext);

  if (!context) {
    throw new Error('useSnack must be used within a SnackProvider');
  }

  return context;
}
