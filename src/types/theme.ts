import type { THEMES } from '@/constants/theme';

/**
 * Compile-time union type extracted directly from the runtime THEMES constants.
 * Resolves to explicitly defined user interface rendering themes.
 */
export type Theme = (typeof THEMES)[keyof typeof THEMES];
