/**
 * @fileoverview Composition Root Barrel Export for the Snack Context Module.
 * Consolidates and exposes public APIs, hooks, providers, and shared interfaces.
 * Keeps structural implementation details encapsulated away from external views.
 */

export { useSnack } from './SnackContext';
export { SnackProvider } from './SnackProvider';

export type { SnackContextType } from './SnackContext';
