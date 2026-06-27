import type { MODES } from '@/constants/mode';

/**
 * Compile-time union type extracted directly from the runtime MODES constants.
 * Resolves to explicitly defined architecture paradigm selection states.
 */
export type AppMode = (typeof MODES)[keyof typeof MODES];
