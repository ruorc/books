import AppRouter from '@/routers/Router';
import { ProjectThemeProvider } from '@/providers/ProjectThemeProvider';
import { AppModeProvider } from '@/providers/AppModeProvider';
import { SnackProvider } from '@/providers/SnackProvider';
import { ConfirmProvider } from '@/providers/ConfirmProvider';

/**
 * Root Application Component.
 * Establishes the global execution pipeline by structuring layout context boundaries,
 * snackbar notification pipelines, modal confirmation trees, and micro-frontend routing layers.
 */
export default function App() {
  return (
    <ProjectThemeProvider>
      <AppModeProvider>
        <SnackProvider>
          <ConfirmProvider>
            <AppRouter />
          </ConfirmProvider>
        </SnackProvider>
      </AppModeProvider>
    </ProjectThemeProvider>
  );
}
