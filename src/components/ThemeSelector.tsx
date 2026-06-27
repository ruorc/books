import { Sun, Moon, Monitor } from 'lucide-react';
import { THEME_LABELS, THEMES } from '@/constants/theme';
import { useProjectTheme } from '@/providers/ProjectThemeProvider';
import { SegmentedControl } from './SegmentedControl';
import type { Theme } from '@/types/theme';

/**
 * Options list bound to runtime THEMES constants to eliminate magic strings.
 * Explicitly typed to maintain strict alignment with the global theme definitions.
 */
const themeOptions = [
  { id: THEMES.LIGHT, label: THEME_LABELS[THEMES.LIGHT], icon: Sun },
  { id: THEMES.DARK, label: THEME_LABELS[THEMES.DARK], icon: Moon },
  { id: THEMES.SYSTEM, label: THEME_LABELS[THEMES.SYSTEM], icon: Monitor },
] as const;

export function ThemeSelector() {
  const { theme, setTheme } = useProjectTheme();

  return (
    <SegmentedControl
      id="app-theme" // Unique scope ID isolates Framer Motion animations from ModeSelector
      options={themeOptions}
      value={theme}
      onChange={(value) => setTheme(value as Theme)}
    />
  );
}
