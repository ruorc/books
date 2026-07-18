import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppMode } from '@/context/AppMode';
import { useTheme } from '@/context/Theme';
import { useSnack } from '@/context/Snack';
import { SNACKS } from '@/context/Snack/constants/snackConstants';
import { THEME_LABELS } from '@/context/Theme/constants/themeConstants';
import { ENGINE_LABELS } from '@/context/AppMode/constants/modeConstants';
import { PageLoader } from '@/components/PageLoader';

import { Header } from './Header/Header';
import { Main } from './Main/Main';
import { Footer } from './Footer/Footer';

/**
 * Root Application Layout Wrapper Component establishing the system frame scaffolding.
 * Orchestrates global viewport grids, sticky navigation headers, and flexible footer positioning.
 * Dispatches synchronization push notifications when application rendering parameters or visual themes change.
 */
export const Layout = (): React.JSX.Element => {
  const { isModeLoading, mode } = useAppMode();
  const { theme } = useTheme();
  const { showSnack } = useSnack();

  const previousModeRef = useRef(mode);
  const previousThemeRef = useRef(theme);

  useEffect(() => {
    if (previousModeRef.current === mode) return;

    previousModeRef.current = mode;

    const modeLabel = ENGINE_LABELS[mode];

    showSnack(
      `Switched rendering architecture engine to: ${modeLabel}`,
      SNACKS.INFO
    );
  }, [mode, showSnack]);

  useEffect(() => {
    if (previousThemeRef.current === theme) return;

    previousThemeRef.current = theme;

    const themeLabel = THEME_LABELS[theme];

    showSnack(`Theme preference updated to: ${themeLabel}`, SNACKS.INFO);
  }, [theme, showSnack]);

  return (
    <div className="flex flex-col min-h-full bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <Header />
      <Main>
        {isModeLoading ? (
          <PageLoader className="h-[calc(100vh-8rem)]" />
        ) : (
          <Outlet />
        )}
      </Main>
      <Footer />
    </div>
  );
};
