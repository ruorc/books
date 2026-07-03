import {
  useEffect,
  useState,
  useMemo,
  useCallback,
  type PropsWithChildren,
} from 'react';
import { THEME_KEY, DEFAULT_THEME, THEMES } from '@/constants/theme';
import { ThemeContext, isValidTheme } from './ThemeContext';
import type { Theme } from '@/types/theme';

/**
 * Context Provider encapsulating color palette theme management, hardware preferences, and storage tracking.
 * Exclusively exports the React component node layout to satisfy Fast Refresh compiler rules.
 */
export function ProjectThemeProvider({ children }: PropsWithChildren) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem(THEME_KEY);

    // Explicitly validate storage values against known invariants to maintain runtime safety
    return isValidTheme(saved) ? saved : DEFAULT_THEME;
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
        const newValue = e.newValue;

        setThemeState(isValidTheme(newValue) ? newValue : DEFAULT_THEME);
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
