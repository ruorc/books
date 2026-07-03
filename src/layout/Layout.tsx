import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppMode } from '@/context/AppMode';
import { useProjectTheme } from '@/context/Theme';
import { useSnack } from '@/context/Snack';
import { SNACK_TYPES } from '@/constants/snack';
import { THEME_LABELS } from '@/constants/theme';
import { ENGINE_LABELS } from '@/constants/ui';
import { MODES } from '@/constants/mode';
import PageLoader from '@/components/PageLoader';
import Footer from './footer/Footer';
import Header from './header/Header';
import Main from './main/Main';

/**
 * Root Application Layout Wrapper Component.
 * Establishes the core grid, header, footer, and shell structure of the system.
 *
 * Intercepts theme and rendering mode state modifications to dispatch localized,
 * transient notification alert logs via the Snack pipeline.
 *
 * @returns The main container view embedding sub-routes dynamically inside the Main region.
 */
export default function Layout() {
  const { isModeLoading, mode } = useAppMode();
  const { theme } = useProjectTheme();
  const { showSnack } = useSnack();

  // Store the previously evaluated values to compare against strict runtime state
  const previousModeRef = useRef(mode);
  const previousThemeRef = useRef(theme);

  // 1. Reactively monitor mode changes without triggering parent tree rerenders
  useEffect(() => {
    // If the mode hasn't actually changed from the last render, it's the initial setup
    if (previousModeRef.current === mode) return;

    previousModeRef.current = mode;

    // Fully aligned with the updated MODES.FUNCTIONAL constant schema
    const modeLabel =
      mode === MODES.FUNCTIONAL
        ? ENGINE_LABELS.FUNCTIONAL
        : ENGINE_LABELS.CLASS;

    showSnack(
      `Switched rendering architecture engine to: ${modeLabel}`,
      SNACK_TYPES.INFO
    );
  }, [mode, showSnack]);

  // 2. Reactively monitor theme changes without triggering parent tree rerenders
  useEffect(() => {
    // If the theme hasn't actually changed from the last render, it's the initial setup
    if (previousThemeRef.current === theme) return;

    previousThemeRef.current = theme;

    showSnack(
      `Theme preference updated to: ${THEME_LABELS[theme]}`,
      SNACK_TYPES.INFO
    );
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
}
