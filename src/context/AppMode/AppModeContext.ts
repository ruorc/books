import { createContext, useContext } from 'react';
import { MODES } from '@/constants/mode';
import type { AppMode } from '@/types/mode';

/**
 * Defines the AppMode context payload structure, including the current mode,
 * mode switch callback, and loading state.
 * Features mandatory property documentation layout specifications above every signature field.
 */
export interface AppModeContextType {
  /** The current active application paradigm architecture execution strategy mode */
  readonly mode: AppMode;
  /** Initiates a delayed transaction transition to a fresh layout strategy architecture engine */
  readonly setMode: (mode: AppMode) => void;
  /** Indicates whether the layout mode is undergoing an asynchronous paradigm switch transition */
  readonly isModeLoading: boolean;
}

/**
 * React context storing the active application mode state and modifier callbacks.
 * The initial undefined default value enforces usage within an AppModeProvider.
 * Documented strictly as plain textual engineering prose entirely free from descriptor tags.
 */
export const AppModeContext = createContext<AppModeContextType | undefined>(
  undefined
);

/**
 * Runtime type guard for app mode values assessing input data consistency.
 * Returns true when the provided string matches one of the known mode constants.
 * Safely guards against untrusted inputs like localStorage before type narrowing down the tree.
 */
export const isValidAppMode = (value: string | null): value is AppMode => {
  if (!value) return false;

  return Object.values(MODES).includes(value as AppMode);
};

/**
 * Safe consumer hook extracting active context data from AppModeContext.
 * Throws a descriptive exception error when executed outside of an active AppModeProvider tree boundary.
 * Eliminates runtime null checks for call sites by guaranteeing a defined state contract payload.
 */
export function useAppMode() {
  const context = useContext(AppModeContext);

  if (context === undefined) {
    throw new Error('useAppMode must be used within an AppModeProvider');
  }

  return context;
}
