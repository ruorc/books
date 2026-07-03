import { createContext, useContext } from 'react';
import { MODES } from '@/constants/mode';
import type { AppMode } from '@/types/mode';

export interface AppModeContextType {
  /** The current active application paradigm architecture execution strategy mode. */
  mode: AppMode;
  /** Initiates a delayed transaction transition to a fresh layout strategy architecture engine. */
  setMode: (mode: AppMode) => void;
  /** Indicates whether the layout mode is undergoing an asynchronous paradigm switch transition. */
  isModeLoading: boolean;
}

export const AppModeContext = createContext<AppModeContextType | undefined>(
  undefined
);

/**
 * Type guard validation verifying if a raw storage string exactly matches permitted AppMode literal constraints.
 *
 * @param value - The raw string value pulled from localStorage layout state.
 * @returns Boolean affirmation declaring type compatibility.
 */
export const isValidAppMode = (value: string | null): value is AppMode => {
  if (!value) return false;

  return Object.values(MODES).includes(value as AppMode);
};

/**
 * Custom hook providing direct, type-safe access to the global AppMode context transaction space.
 *
 * @returns The active AppMode layout values and transaction modifiers.
 * @throws {Error} If consumed outside a structurally sound AppModeProvider tree node.
 */
export function useAppMode() {
  const context = useContext(AppModeContext);

  if (context === undefined) {
    throw new Error('useAppMode must be used within an AppModeProvider');
  }

  return context;
}
