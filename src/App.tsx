import AppRouter from '@/routers/Router';
import { AppProviders } from '@/providers/AppProviders';

/**
 * Root Application Component.
 * Establishes the global execution pipeline by structuring layout context boundaries,
 * snackbar notification pipelines, modal confirmation trees, and micro-frontend routing layers.
 */
export default function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
