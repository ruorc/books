import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import type { AppMode } from '@/components/ModeSelector';

interface AppModeContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  isModeLoading: boolean;
}

const AppModeContext = createContext<AppModeContextType | undefined>(undefined);
const modeNameInLocalStorage = 'books-app-mode';

export function AppModeProvider({ children }: PropsWithChildren) {
  const [mode, setModeState] = useState<AppMode>(() => {
    const savedMode = localStorage.getItem(modeNameInLocalStorage) as AppMode;
    return savedMode || 'function';
  });

  const [isModeLoading, setIsModeLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(modeNameInLocalStorage, mode);
  }, [mode]);

  const setMode = (newMode: AppMode) => {
    setIsModeLoading(true);

    setTimeout(() => {
      setModeState(newMode);
      setIsModeLoading(false);
    }, 400);
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
