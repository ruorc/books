import { useAppMode } from '@/providers/AppModeProvider';
import { useProjectTheme } from '@/providers/ProjectThemeProvider';
import { Code2, Terminal, Palette, Sliders } from 'lucide-react';

import { AboutCard } from './AboutCard';
import { AboutHeader } from './AboutHeader';
import { AboutTechStack } from './AboutTechStack';
import { AboutSecurity } from './AboutSecurity';

export default function AboutPage() {
  const { mode } = useAppMode();
  const { theme, isDark } = useProjectTheme();

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* 1. Header & Introduction */}
      <AboutHeader />

      {/* 2. Technologies badges */}
      <AboutTechStack />

      {/* 3. Live Settings Cards Dashboard */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Sliders className="h-5 w-5 text-indigo-500" />
          Current App Settings
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AboutCard
            title="Rendering Engine"
            value={
              mode === 'function' ? 'Functional (Hooks)' : 'Class Components'
            }
            icon={mode === 'function' ? Code2 : Terminal}
            iconColorClass={
              mode === 'function'
                ? 'bg-sky-500/10 text-sky-500'
                : 'bg-amber-500/10 text-amber-500'
            }
            description={
              mode === 'function'
                ? 'The catalog is currently driven by functional components, useEffect hooks, and custom logic.'
                : 'The catalog is currently rendered via JavaScript classes using componentDidMount and componentDidUpdate methods.'
            }
          />

          <AboutCard
            title="Visual Style"
            value={
              theme === 'system'
                ? `System (${isDark ? 'Dark' : 'Light'})`
                : `${theme} Theme`
            }
            icon={Palette}
            iconColorClass={
              isDark
                ? 'bg-purple-500/10 text-purple-500'
                : 'bg-orange-500/10 text-orange-500'
            }
            description={`Active preference: ${theme}. The head inline script efficiently prevents any unstyled content flashes upon page reload.`}
          />
        </div>
      </section>

      {/* 4. Security Advisory Footer */}
      <AboutSecurity />
    </div>
  );
}
