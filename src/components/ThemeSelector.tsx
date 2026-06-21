import { Sun, Moon, Monitor } from 'lucide-react';
import { useProjectTheme } from '@/providers/ProjectThemeProvider';
import { SegmentedControl, type SegmentedOption } from './SegmentedControl';

type Theme = 'light' | 'dark' | 'system';

const themeOptions: readonly SegmentedOption<Theme>[] = [
  { id: 'light', label: 'light', icon: Sun },
  { id: 'dark', label: 'dark', icon: Moon },
  { id: 'system', label: 'system', icon: Monitor },
] as const;

export function ThemeSelector() {
  const { theme, setTheme } = useProjectTheme();

  return (
    <SegmentedControl
      options={themeOptions}
      value={theme}
      onChange={setTheme}
    />
  );
}
