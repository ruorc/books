import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppMode } from '@/providers/AppModeProvider';
import { useProjectTheme } from '@/providers/ProjectThemeProvider';
import { useSnack } from '@/providers/SnackProvider';
import { SNACK_TYPES } from '@/constants/snack';
import { THEME_LABELS } from '@/constants/theme';
import { MODES } from '@/constants/mode';
import PageLoader from '@/components/PageLoader';
import Footer from './footer/Footer';
import Header from './header/Header';
import Main from './main/Main';

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
        ? 'Functional Components (Hooks)'
        : 'Class Components (Lifecycle)';

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
        {/* Safe layout viewport tracking with calculation adjustment */}
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
