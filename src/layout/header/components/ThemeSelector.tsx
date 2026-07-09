import { Sun, Moon, Monitor } from 'lucide-react';
import {
  THEME_LABELS,
  THEMES,
  THEME_LAYOUT_ID,
} from '@/context/Theme/constants/themeConstants';
import { useTheme } from '@/context/Theme/ThemeContext';
import { SegmentedControl } from '@/components/SegmentedControl';

const themeOptions = [
  { id: THEMES.LIGHT, label: THEME_LABELS[THEMES.LIGHT], icon: Sun },
  { id: THEMES.DARK, label: THEME_LABELS[THEMES.DARK], icon: Moon },
  { id: THEMES.SYSTEM, label: THEME_LABELS[THEMES.SYSTEM], icon: Monitor },
] as const;

/**
 * Smart UI Theme Selector Controller Component.
 * Orchestrates synchronous theme mutations and persistence tracking across browser viewports.
 * Placed strictly inside the header layout space to govern visual theme switching interactions.
 */
export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <SegmentedControl
      id={THEME_LAYOUT_ID}
      options={themeOptions}
      value={theme}
      onChange={setTheme}
    />
  );
}
