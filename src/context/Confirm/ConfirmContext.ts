import { createContext, useContext } from 'react';

export interface ConfirmOptions {
  /** The primary header text displayed at the top of the confirmation dialog. */
  title: string;
  /** Detailed explanatory body text describing the consequences of the action. */
  description: string;
  /** Optional customized text for the affirmative action button. Defaults to system settings. */
  confirmLabel?: string;
  /** Optional customized text for the dismissive action button. Defaults to system settings. */
  cancelLabel?: string;
  /** High-severity modifier styling the confirmation layout to emphasize hazardous operations. */
  isDanger?: boolean;
}

export interface ConfirmContextType {
  /** Triggers the global confirmation flow and returns a Promise waiting for explicit user interaction. */
  showConfirm: (options: ConfirmOptions) => Promise<boolean>;
}

export const ConfirmContext = createContext<ConfirmContextType | undefined>(
  undefined
);

/**
 * Custom hook to safely grab the functional async confirm trigger context pipeline.
 *
 * @returns The async confirmation transaction dispatch tool.
 * @throws {Error} If consumed outside a structurally sound ConfirmProvider tree node.
 */
export function useConfirm() {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }

  return context;
}
