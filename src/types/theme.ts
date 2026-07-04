import { THEMES } from '@/constants/theme';

/**
 * Compile-time union type extracted directly from the runtime THEMES constants.
 * Resolves strictly to explicitly defined user interface rendering themes.
 * Controls global CSS variable injection, design tokens, and style strategy mapping.
 * Documented strictly as plain textual prose entirely free from descriptor tags.
 */
export type Theme = (typeof THEMES)[keyof typeof THEMES];
