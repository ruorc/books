import { THEMES } from '@/context/Theme/constants/themeConstants';

/**
 * Compile-time union type extracted directly from the runtime THEMES constants.
 * Resolves strictly to explicitly defined user interface rendering themes.
 * Controls global CSS variable injection, design tokens, and style strategy mapping.
 */
export type Theme = (typeof THEMES)[keyof typeof THEMES];
