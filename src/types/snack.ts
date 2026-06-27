import type { SNACK_TYPES } from '@/constants/snack';

/**
 * Compile-time union type extracted directly from the runtime SNACK_TYPES constants.
 */
export type SnackType = (typeof SNACK_TYPES)[keyof typeof SNACK_TYPES];

/**
 * Interface blueprint tracking transient notification messages within the global queue pipeline.
 */
export interface Snack {
  id: string;
  message: string;
  type: SnackType;
}
