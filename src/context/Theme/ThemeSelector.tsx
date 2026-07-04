import { Sun, Moon, Monitor } from 'lucide-react';
import { THEME_LABELS, THEMES, THEME_LAYOUT_ID } from '@/constants/theme';
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
 * Co-located inside 'src/context/Theme/' to guarantee encapsulate domain logic boundaries.
 * Leverages read-only literal option attributes to match core theme types natively and eliminate magic strings.
 * Follows strict constraints from AGENTS.md: zero inline comments in JSX and plain tagless engineering text.
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
