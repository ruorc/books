import type { SNACK_TYPES } from '@/constants/snack';

/**
 * Compile-time union type extracted directly from the runtime SNACK_TYPES constants.
 * Governs the visual presentation state and severity level of a notification block.
 */
export type SnackType = (typeof SNACK_TYPES)[keyof typeof SNACK_TYPES];

/**
 * Interface blueprint tracking transient notification messages within the global queue pipeline.
 */
export interface Snack {
  /** Unique identifier automatically generated to target and clear this specific alert. */
  id: string;
  /** The plaintext notification description or warning message visible to the user. */
  message: string;
  /** The specific category type mapping structural design palettes and iconography tokens. */
  type: SnackType;
}
