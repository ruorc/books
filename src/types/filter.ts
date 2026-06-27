import type { FILTER_TYPES } from '@/constants/ui';

/**
 * Compile-time union type extracted directly from runtime FILTER_TYPES constants.
 * Resolves strictly to supported catalog cross-linking fields ('author' | 'year').
 */
export type CatalogFilterType =
  (typeof FILTER_TYPES)[keyof typeof FILTER_TYPES];
