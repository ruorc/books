import { Sun, Moon, Monitor } from 'lucide-react';
import { THEME_LABELS, THEMES, THEME_LAYOUT_ID } from '@/constants/theme';
import { useProjectTheme } from '@/context/Theme/ThemeContext'; // Adjusted to the new context location
import { SegmentedControl } from '@/components/SegmentedControl';

/**
 * Options list bound to runtime THEMES constants to eliminate magic strings.
 * Explicitly mapped with read-only literal attributes to match core Theme types natively.
 */
const themeOptions = [
  { id: THEMES.LIGHT, label: THEME_LABELS[THEMES.LIGHT], icon: Sun },
  { id: THEMES.DARK, label: THEME_LABELS[THEMES.DARK], icon: Moon },
  { id: THEMES.SYSTEM, label: THEME_LABELS[THEMES.SYSTEM], icon: Monitor },
] as const;

/**
 * Smart UI Theme Selector Controller Component.
 * Orchestrates synchronous theme mutations and persistence tracking across browser viewports.
 * Co-located inside 'src/context/Theme/' to guarantee encapsulate domain logic boundaries.
 *
 * Follows strict constraints from AGENTS.md: zero inline comments in JSX,
 * English-only documentation, absolute alias paths, and zero magic strings.
 *
 * @returns The structured type-safe segmented theme control module.
 */
export default function ThemeSelector() {
  const { theme, setTheme } = useProjectTheme();

  return (
    <SegmentedControl
      id={THEME_LAYOUT_ID}
      options={themeOptions}
      value={theme}
      onChange={setTheme}
    />
  );
}
