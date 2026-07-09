import { AppRouter } from '@/router/AppRouter';
import { AppProviders } from '@/providers/AppProviders';

/**
 * Root Application Component.
 * Establishes the global execution pipeline by structuring layout context boundaries,
 * snackbar notification pipelines, modal confirmation trees, and micro-frontend routing layers.
 */
export const App: React.FC = () => {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
};
