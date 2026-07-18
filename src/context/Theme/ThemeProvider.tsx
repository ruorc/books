import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react';
import { THEME_KEY, DEFAULT_THEME, THEMES } from './constants/themeConstants';
import { ThemeContext, isValidTheme } from './ThemeContext';

import type { Theme } from './types/theme';

/**
 * Structural contract defining properties expected by the global application theme coordinator.
 */
interface ThemeProviderProps {
  /** The composite React element node children nested within the visual theme boundary tree */
  readonly children: ReactNode;
}

/**
 * Context Provider encapsulating color palette theme management, hardware preferences, and storage tracking.
 * Restores persisted configurations, listens to operating system media preferences, and synchronizes cross-tab events.
 */
export function ThemeProvider({
  children,
}: ThemeProviderProps): React.JSX.Element {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem(THEME_KEY);

    return isValidTheme(saved) ? saved : DEFAULT_THEME;
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const isDark =
    theme === THEMES.SYSTEM ? systemPrefersDark : theme === THEMES.DARK;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useLayoutEffect(() => {
    document.documentElement.classList.toggle(THEMES.DARK, isDark);
  }, [isDark]);

  useEffect(() => {
    if (theme === THEMES.SYSTEM) {
      localStorage.removeItem(THEME_KEY);
    } else {
      localStorage.setItem(THEME_KEY, theme);
    }
  }, [theme]);

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

  const setTheme = (newTheme: Theme): void => {
    setThemeState((prevTheme) =>
      newTheme === prevTheme ? prevTheme : newTheme
    );
  };

  const contextValue = {
    theme,
    setTheme,
    isDark,
  };

  return <ThemeContext value={contextValue}>{children}</ThemeContext>;
}
