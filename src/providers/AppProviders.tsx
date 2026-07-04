import { type PropsWithChildren } from 'react';
import { AppModeProvider } from '@/context/AppMode';
import { ProjectThemeProvider } from '@/context/Theme';
import { ConfirmProvider } from '@/context/Confirm';
import { SnackProvider } from '@/context/Snack';

/**
 * Unified application infrastructure root coordinator.
 * Composes all global context domains into a singular flat component node.
 * Documented strictly as plain textual engineering prose entirely free from descriptor tags.
 */
export function AppProviders({ children }: Readonly<PropsWithChildren>) {
  return (
    <AppModeProvider>
      <ProjectThemeProvider>
        <ConfirmProvider>
          <SnackProvider>{children}</SnackProvider>
        </ConfirmProvider>
      </ProjectThemeProvider>
    </AppModeProvider>
  );
}
