import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  type PropsWithChildren,
} from 'react';
import { THEME_KEY, DEFAULT_THEME, THEMES } from '@/constants/theme';
import type { Theme } from '@/types/theme';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ProjectThemeProvider({ children }: PropsWithChildren) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return (saved as Theme) || DEFAULT_THEME;
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const isDark =
    theme === THEMES.SYSTEM ? systemPrefersDark : theme === THEMES.DARK;

  // 1. Listen for real-time system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) =>
      setSystemPrefersDark(e.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // 2. Synchronize dark mode state with HTML document element
  useEffect(() => {
    document.documentElement.classList.toggle(THEMES.DARK, isDark);
  }, [isDark]);

  // 3. Persist selected theme to LocalStorage
  useEffect(() => {
    if (theme === THEMES.SYSTEM) {
      localStorage.removeItem(THEME_KEY);
    } else {
      localStorage.setItem(THEME_KEY, theme);
    }
  }, [theme]);

  // 4. Synchronize theme state across multiple open browser tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === THEME_KEY) {
        setThemeState((e.newValue as Theme) || DEFAULT_THEME);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Memoize state mutation handler to secure stable reference pipeline
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState((prevTheme) =>
      newTheme === prevTheme ? prevTheme : newTheme
    );
  }, []);

  // Strict structural memoization preventing cascading tree-wide UI thrashing
  const contextValue = useMemo(
    () => ({
      theme,
      setTheme,
      isDark,
    }),
    [theme, setTheme, isDark]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useProjectTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(
      'useProjectTheme must be used within a ProjectThemeProvider'
    );
  }
  return context;
}
