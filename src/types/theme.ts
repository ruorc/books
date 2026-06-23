import type { THEMES } from '@/constants/theme';

// Derive the compile-time type from the runtime constant object
export type Theme = typeof THEMES[keyof typeof THEMES];
