import { MODES } from '../constants/modeConstants';

/**
 * Compile-time union type extracted directly from the runtime MODES constants.
 * Resolves strictly to explicitly defined architectural paradigm selection states.
 * Governs runtime execution strategies and component lifecycle rendering flows.
 */
export type AppMode = (typeof MODES)[keyof typeof MODES];
