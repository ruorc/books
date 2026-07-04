import { Code2, Terminal, Palette, Sliders } from 'lucide-react';
import { MODES } from '@/constants/mode';
import { THEMES, THEME_LABELS } from '@/constants/theme';
import { useAppMode } from '@/context/AppMode';
import { useProjectTheme } from '@/context/Theme';

import { AboutCard } from './components/AboutCard';
import { AboutHeader } from './components/AboutHeader';
import { AboutTechStack } from './components/AboutTechStack';
import { AboutSecurity } from './components/AboutSecurity';

const PALETTE_ICON_COLORS = {
  dark: 'bg-purple-500/10 text-purple-500',
  light: 'bg-orange-500/10 text-orange-500',
} as const;

const ENGINE_METRICS = {
  [MODES.FUNCTIONAL]: {
    title: 'Functional (Hooks)',
    icon: Code2,
    color: 'bg-sky-500/10 text-sky-500',
    description:
      'The catalog is currently driven by functional components, useEffect hooks, and custom logic.',
  },
  [MODES.CLASS]: {
    title: 'Class Components',
    icon: Terminal,
    color: 'bg-amber-500/10 text-amber-500',
    description:
      'The catalog is currently rendered via JavaScript classes using componentDidMount and componentDidUpdate methods.',
  },
} as const;

/**
 * Dashboard Runtime Status View Component rendering the core application summary page.
 * Manages reactive evaluation of the visual style preferences and rendering strategies.
 * Provides high-density engineering prose documentation strictly free from any parameter tags.
 */
export default function AboutPage() {
  const { mode } = useAppMode();
  const { theme, isDark } = useProjectTheme();

  const activeEngine = ENGINE_METRICS[mode];
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
            value={activeEngine.title}
            icon={activeEngine.icon}
            iconColorClass={activeEngine.color}
            description={activeEngine.description}
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
}
