import { Palette, Sliders, Code2, Terminal } from 'lucide-react';
import {
  MODES,
  ENGINE_DESCRIPTORS,
} from '@/context/AppMode/constants/modeConstants';
import { THEMES, THEME_LABELS } from '@/context/Theme/constants/themeConstants';
import { useAppMode } from '@/context/AppMode';
import { useTheme } from '@/context/Theme';

import { AboutCard } from './components/AboutCard';
import { AboutHeader } from './components/AboutHeader';
import { AboutTechStack } from './components/AboutTechStack';
import { AboutSecurity } from './components/AboutSecurity';

const PALETTE_ICON_COLORS = {
  dark: 'bg-purple-500/10 text-purple-500',
  light: 'bg-orange-500/10 text-orange-500',
} as const;

/**
 * Technical demonstration index page.
 * Compares reactive rendering behaviors, architectural separation rules,
 * and tracks environment variables configurations in real-time.
 */
export const AboutPage = (): React.JSX.Element => {
  const { mode } = useAppMode();
  const { theme, isDark } = useTheme();

  const systemThemeLabel = isDark
    ? THEME_LABELS[THEMES.DARK]
    : THEME_LABELS[THEMES.LIGHT];

  const paletteColorClass = isDark
    ? PALETTE_ICON_COLORS.dark
    : PALETTE_ICON_COLORS.light;

  const resolvedThemeValue =
    theme === THEMES.SYSTEM
      ? `${THEME_LABELS[THEMES.SYSTEM]} (${systemThemeLabel})`
      : `${THEME_LABELS[theme]} Theme`;

  const themeDisplayDescription = `Active preference: ${theme}. The inline anti-flicker script efficiently prevents any unstyled content flashes upon page reload.`;

  const engineTitle =
    mode === MODES.FUNCTIONAL ? 'Functional (Hooks)' : 'Class Components';
  const engineColorClass =
    mode === MODES.FUNCTIONAL
      ? 'bg-sky-500/10 text-sky-500'
      : 'bg-amber-500/10 text-amber-500';
  const engineIcon = mode === MODES.FUNCTIONAL ? Code2 : Terminal;

  return (
    <div className="mx-auto max-w-4xl space-y-12">
      <AboutHeader />

      <AboutTechStack />

      <section className="space-y-4" aria-labelledby="settings-dashboard-title">
        <h2
          id="settings-dashboard-title"
          className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-200"
        >
          <Sliders aria-hidden="true" className="h-5 w-5 text-indigo-500" />
          <span>Current App Settings</span>
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AboutCard
            title="Rendering Engine"
            value={engineTitle}
            icon={engineIcon}
            iconColorClass={engineColorClass}
            description={ENGINE_DESCRIPTORS[mode]}
          />

          <AboutCard
            title="Visual Style"
            value={resolvedThemeValue}
            icon={Palette}
            iconColorClass={paletteColorClass}
            description={themeDisplayDescription}
          />
        </div>
      </section>

      <AboutSecurity />
    </div>
  );
};
