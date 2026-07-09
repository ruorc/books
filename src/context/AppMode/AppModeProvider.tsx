import {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';
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
 * Introduces synthetic debounced transition windows to prevent micro-frontend runtime trashing.
 * Manages atomic lifecycle refs to shield asynchronous state dispatches against memory leakage.
 * Fully optimized under React 19 context rendering constraints and free from tag descriptors.
 */
export function AppModeProvider({ children }: AppModeProviderProps) {
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

  const setMode = useCallback(
    (newMode: AppMode) => {
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
    },
    [mode, isModeLoading]
  );

  const contextValue = useMemo(
    () => ({
      mode,
      setMode,
      isModeLoading,
    }),
    [mode, setMode, isModeLoading]
  );

  return <AppModeContext value={contextValue}>{children}</AppModeContext>;
}
