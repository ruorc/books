import type { SORT_FIELDS, SORT_DIRECTIONS } from '@/constants/ui';

/**
 * Type representation of the allowed fields available for collection sorting.
 */
export type SortField = (typeof SORT_FIELDS)[keyof typeof SORT_FIELDS];

/**
 * Type representation of the allowed sorting direction vectors (e.g., ascending or descending).
 */
export type SortDirection =
  (typeof SORT_DIRECTIONS)[keyof typeof SORT_DIRECTIONS];

/**
 * Structured state definition capturing all advanced query and sorting metrics.
 */
export interface AdvancedFiltersState {
  /** A global plaintext keyword used for matching across all available text attributes. */
  globalSearch: string;
  /** A specific plaintext keyword used strictly for filtering items by their title attribute. */
  titleSearch: string;
  /** A specific plaintext keyword used strictly for filtering items by their author's name. */
  authorSearch: string;
  /** A specific calendar year filter criterion represented as a string token. */
  yearSearch: string;
  /** The specific model field configuration currently selected to dictate collection order. */
  sortField: SortField;
  /** The direction matrix vector determining how the sorted field collection is ordered. */
  sortDirection: SortDirection;
}
