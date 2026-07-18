import { useEffect, useState, useRef, type ReactNode } from 'react';
import {
  MODE_KEY,
  DEFAULT_MODE,
  MODE_SWITCH_DELAY,
} from './constants/modeConstants';
import { AppModeContext, isValidAppMode } from './AppModeContext';

import type { AppMode } from './types/mode';

/**
 * Structural contract defining properties expected by the global application mode coordinator.
 */
interface AppModeProviderProps {
  /** The composite React element node children nested within the context boundary tree */
  readonly children: ReactNode;
}

/**
 * Global application paradigm state coordinator provider component.
 * Restores persisted architecture configuration profiles from local storage dynamically upon initialization.
 * Introduces synthetic debounced transition windows to manage runtime simulation switches safely.
 */
export function AppModeProvider({
  children,
}: AppModeProviderProps): React.JSX.Element {
  const [mode, setModeState] = useState<AppMode>(() => {
    const savedMode = localStorage.getItem(MODE_KEY);

    return isValidAppMode(savedMode) ? savedMode : DEFAULT_MODE;
  });

  const [isModeLoading, setIsModeLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(MODE_KEY, mode);
  }, [mode]);

  const setMode = (newMode: AppMode): void => {
    if (newMode === mode || isModeLoading) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsModeLoading(true);

    timeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setModeState(newMode);
        setIsModeLoading(false);
      }

      timeoutRef.current = null;
    }, MODE_SWITCH_DELAY);
  };

  const contextValue = {
    mode,
    setMode,
    isModeLoading,
  };

  return <AppModeContext value={contextValue}>{children}</AppModeContext>;
}
