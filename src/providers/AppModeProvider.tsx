import { createContext, useContext, useEffect, useState, useRef, type PropsWithChildren } from 'react';
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

  // 1. Persist the current mode to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(MODE_KEY, mode);
  }, [mode]);

  // 2. Clean up any pending timeout when the component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const setMode = (newMode: AppMode) => {
    if (newMode === mode || isModeLoading) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsModeLoading(true);

    timeoutRef.current = setTimeout(() => {
      setModeState(newMode);
      setIsModeLoading(false);
      timeoutRef.current = null;
    }, MODE_SWITCH_DELAY);
  };

  return (
    <AppModeContext.Provider value={{ mode, setMode, isModeLoading }}>
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
