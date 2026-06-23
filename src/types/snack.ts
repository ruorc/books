import type { SNACK_TYPES } from '@/constants/snack';

export type SnackType = typeof SNACK_TYPES[keyof typeof SNACK_TYPES];

export interface Snack {
  id: string;
  message: string;
  type: SnackType;
}
