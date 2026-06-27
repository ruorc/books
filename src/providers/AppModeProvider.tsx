import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
  type PropsWithChildren,
} from 'react';
import { MODE_KEY, DEFAULT_MODE, MODE_SWITCH_DELAY } from '@/constants/mode';
import type { AppMode } from '@/types/mode';

interface AppModeContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  isModeLoading: boolean;
}

const AppModeContext = createContext<AppModeContextType | undefined>(undefined);

export function AppModeProvider({ children }: PropsWithChildren) {
  const [mode, setModeState] = useState<AppMode>(() => {
    const savedMode = localStorage.getItem(MODE_KEY);
    return (savedMode as AppMode) || DEFAULT_MODE;
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

export function useAppMode() {
  const context = useContext(AppModeContext);
  if (context === undefined) {
    throw new Error('useAppMode must be used within an AppModeProvider');
  }
  return context;
}
