import {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
  type PropsWithChildren,
} from 'react';
import { MODE_KEY, DEFAULT_MODE, MODE_SWITCH_DELAY } from '@/constants/mode';
import { AppModeContext, isValidAppMode } from './AppModeContext';
import type { AppMode } from '@/types/mode';

/**
 * Context Provider encapsulating paradigm-switching mechanics and storage tracking.
 * Exclusively exports the React component node layout to satisfy Fast Refresh compiler rules.
 */
export function AppModeProvider({ children }: PropsWithChildren) {
  const [mode, setModeState] = useState<AppMode>(() => {
    const savedMode = localStorage.getItem(MODE_KEY);

    // Explicitly validate storage values against known invariants to maintain runtime safety
    return isValidAppMode(savedMode) ? savedMode : DEFAULT_MODE;
  });

  const [isModeLoading, setIsModeLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep track of mount status to eliminate state mutations after unmount
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Persist the current mode to LocalStorage whenever it changes
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

  // Memoize context value payload to prevent redundant re-renders down the tree
  const contextValue = useMemo(
    () => ({
      mode,
      setMode,
      isModeLoading,
    }),
    [mode, setMode, isModeLoading]
  );

  return (
    <AppModeContext.Provider value={contextValue}>
      {children}
    </AppModeContext.Provider>
  );
}
