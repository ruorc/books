import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const themeNameInLocalStorage = 'books-theme';

export function ProjectThemeProvider({ children }: PropsWithChildren) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(themeNameInLocalStorage) as Theme;
    return savedTheme || 'system';
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const isDark = theme === 'system' ? systemPrefersDark : theme === 'dark';

  // Effect 1: Monitor the system theme in real time
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) =>
      setSystemPrefersDark(e.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Effect 2: Synchronize with DOM and LocalStorage on any change
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', isDark);

    if (theme === 'system') {
      localStorage.removeItem(themeNameInLocalStorage);
    } else {
      localStorage.setItem(themeNameInLocalStorage, theme);
    }
  }, [theme, isDark]);

  // Effect 3: Synchronize the theme between open browser tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === themeNameInLocalStorage) {
        const newTheme = e.newValue as Theme;

        if (!newTheme) {
          setThemeState('system');
        } else {
          setThemeState(newTheme);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useProjectTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      'useProjectTheme must be used within a ProjectThemeProvider'
    );
  }
  return context;
}
