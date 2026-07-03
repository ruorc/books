import type { FILTER_TYPES } from '@/constants/ui';

/**
 * Compile-time union type extracted directly from runtime FILTER_TYPES constants.
 * Resolves strictly to supported catalog cross-linking fields (e.g., 'author' | 'year').
 * Used to orchestrate deep-linking and state routing across catalog views.
 */
export type CatalogFilterType =
  (typeof FILTER_TYPES)[keyof typeof FILTER_TYPES];
