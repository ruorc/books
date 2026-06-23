import AppRouter from '@/router/Router';
import { ProjectThemeProvider } from '@/providers/ProjectThemeProvider';
import { AppModeProvider } from '@/providers/AppModeProvider';
import { SnackProvider } from '@/providers/SnackProvider';
import { ConfirmProvider } from '@/providers/ConfirmProvider';

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
