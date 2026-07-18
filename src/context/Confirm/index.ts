/**
 * Composition Root Barrel Export for the Confirm Context Module.
 * Consolidates and exposes public APIs, hooks, providers, and shared interfaces.
 * Keeps structural implementation details encapsulated away from external views.
 */

export { useConfirm } from './ConfirmContext';
export { ConfirmProvider } from './ConfirmProvider';

export type { ConfirmOptions, ConfirmContextType } from './types/confirm';
