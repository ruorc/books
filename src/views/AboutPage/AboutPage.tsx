import { useAppMode } from '@/context/AppMode/AppModeProvider';
import { useProjectTheme } from '@/providers/ProjectThemeProvider';
import { Code2, Terminal, Palette, Sliders } from 'lucide-react';
import { MODES } from '@/constants/mode';
import { THEMES, THEME_LABELS } from '@/constants/theme';

import { AboutCard } from './AboutCard';
import { AboutHeader } from './AboutHeader';
import { AboutTechStack } from './AboutTechStack';
import { AboutSecurity } from './AboutSecurity';

export default function AboutPage() {
  const { mode } = useAppMode();
  const { theme, isDark } = useProjectTheme();

  // Engine configuration logic synchronized with updated MODES constants
  const isFunctional = mode === MODES.FUNCTIONAL;
  const engineTitle = isFunctional ? 'Functional (Hooks)' : 'Class Components';
  const EngineIcon = isFunctional ? Code2 : Terminal;
  const engineColorClass = isFunctional
    ? 'bg-sky-500/10 text-sky-500'
    : 'bg-amber-500/10 text-amber-500';
  const engineDescription = isFunctional
    ? 'The catalog is currently driven by functional components, useEffect hooks, and custom logic.'
    : 'The catalog is currently rendered via JavaScript classes using componentDidMount and componentDidUpdate methods.';

  // Theme configuration logic using central source of truth
  const activeSystemThemeLabel = isDark
    ? THEME_LABELS[THEMES.DARK]
    : THEME_LABELS[THEMES.LIGHT];
  const themeValue =
    theme === THEMES.SYSTEM
      ? `${THEME_LABELS[THEMES.SYSTEM]} (${activeSystemThemeLabel})`
      : `${THEME_LABELS[theme]} Theme`;

  return (
    <div className="mx-auto max-w-4xl space-y-12">
      {/* 1. Header & Introduction */}
      <AboutHeader />

      {/* 2. Technologies badges */}
      <AboutTechStack />

      {/* 3. Live Settings Cards Dashboard */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-200">
          <Sliders className="h-5 w-5 text-indigo-500" />
          Current App Settings
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AboutCard
            title="Rendering Engine"
            value={engineTitle}
            icon={EngineIcon}
            iconColorClass={engineColorClass}
            description={engineDescription}
          />

          <AboutCard
            title="Visual Style"
            value={themeValue}
            icon={Palette}
            iconColorClass={
              isDark
                ? 'bg-purple-500/10 text-purple-500'
                : 'bg-orange-500/10 text-orange-500'
            }
            description={`Active preference: ${theme}. The inline anti-flicker script efficiently prevents any unstyled content flashes upon page reload.`}
          />
        </div>
      </section>

      {/* 4. Security Advisory Footer */}
      <AboutSecurity />
    </div>
  );
}
