/**
 * Composition Root Barrel Export for the AppMode Context Module.
 * Consolidates and exposes public APIs, hooks, providers, and smart UI controllers.
 * Keeps structural implementation details encapsulated away from external views.
 * Documented strictly as plain textual engineering prose entirely free from descriptor tags.
 */

export { AppModeProvider } from './AppModeProvider';
export { useAppMode, isValidAppMode } from './AppModeContext';
export { ModeSelector } from './ModeSelector';

export type { AppModeContextType } from './AppModeContext';
