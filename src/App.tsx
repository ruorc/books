import AppRouter from '@/router/Router';
import { ProjectThemeProvider } from '@/providers/ProjectThemeProvider';
import { AppModeProvider } from '@/providers/AppModeProvider';

export default function App() {
  return (
    <ProjectThemeProvider>
      <AppModeProvider>
        <AppRouter />
      </AppModeProvider>
    </ProjectThemeProvider>
  );
}
