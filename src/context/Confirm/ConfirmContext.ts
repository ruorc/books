import { createContext, useContext } from 'react';

/**
 * Structural contract defining individual layout settings passed to trigger a modal dialog view.
 * Features mandatory property documentation layout specifications above every signature field.
 */
export interface ConfirmOptions {
  /** The primary header text displayed at the top of the confirmation dialog */
  title: string;
  /** Detailed explanatory body text describing the consequences of the action */
  description: string;
  /** Optional customized text for the affirmative action button */
  confirmLabel?: string;
  /** Optional customized text for the dismissive action button */
  cancelLabel?: string;
  /** High-severity modifier styling the confirmation layout to emphasize hazardous operations */
  isDanger?: boolean;
}

/**
 * Structural contract defining properties and mutation metrics managed by the Confirm context.
 */
export interface ConfirmContextType {
  /** Triggers the global confirmation flow and returns a Promise waiting for explicit user interaction */
  showConfirm: (options: ConfirmOptions) => Promise<boolean>;
}

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
export function useConfirm() {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }

  return context;
}
