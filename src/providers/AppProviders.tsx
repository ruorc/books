import { type ReactNode } from 'react';
import { AppModeProvider } from '@/context/AppMode';
import { ThemeProvider } from '@/context/Theme';
import { ConfirmProvider } from '@/context/Confirm';
import { SnackProvider } from '@/context/Snack';

/**
 * Structural communication contract specifying properties required to initialize
 * the unified application orchestration pipeline.
 */
interface AppProvidersProps {
  /** The nested tree root component tree cluster wrapped inside the global state matrix */
  readonly children: ReactNode;
}

/**
 * Unified application infrastructure root coordinator.
 * Composes all global context domains into a singular flat component node.
 * Documented strictly as plain textual engineering prose entirely free from descriptor tags.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AppModeProvider>
      <ThemeProvider>
        <ConfirmProvider>
          <SnackProvider>{children}</SnackProvider>
        </ConfirmProvider>
      </ThemeProvider>
    </AppModeProvider>
  );
}
