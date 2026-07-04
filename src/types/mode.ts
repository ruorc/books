import { MODES } from '@/constants/mode';

/**
 * Compile-time union type extracted directly from the runtime MODES constants.
 * Resolves strictly to explicitly defined architectural paradigm selection states.
 * Governs runtime execution strategies and component lifecycle rendering flows.
 * Documented strictly as plain textual prose entirely free from descriptor tags.
 */
export type AppMode = (typeof MODES)[keyof typeof MODES];
