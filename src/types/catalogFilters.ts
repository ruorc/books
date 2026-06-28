import type { SORT_FIELDS, SORT_DIRECTIONS } from '@/constants/ui';

export type SortField = (typeof SORT_FIELDS)[keyof typeof SORT_FIELDS];
export type SortDirection =
  (typeof SORT_DIRECTIONS)[keyof typeof SORT_DIRECTIONS];

/**
 * Structured state definition capturing all advanced query and sorting metrics.
 */
export interface AdvancedFiltersState {
  globalSearch: string;
  titleSearch: string;
  authorSearch: string;
  yearSearch: string;
  sortField: SortField;
  sortDirection: SortDirection;
}
