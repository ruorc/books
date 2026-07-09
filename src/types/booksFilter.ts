import {
  FILTER_FIELDS,
  SORT_FIELDS,
  SORT_DIRECTIONS,
} from '@/views/BooksDomain/constants/booksConstants';

/**
 * Compile-time union type extracted directly from runtime FILTER_FIELDS constants.
 * Resolves strictly to supported model fields permitted for targeted catalog filtration.
 * Used to orchestrate deep-linking and state routing across catalog views.
 * Documented strictly as plain textual prose entirely free from descriptor tags.
 */
export type BookFilterField =
  (typeof FILTER_FIELDS)[keyof typeof FILTER_FIELDS];

/**
 * Type representation of the allowed model attributes available for collection sorting.
 * Resolves to the specific literal values defined within the books sorting constants.
 */
export type SortField = (typeof SORT_FIELDS)[keyof typeof SORT_FIELDS];

/**
 * Type representation of the allowed sorting direction vectors like ascending or descending.
 * Controls the vector sequencing flow applied to sorted data streams.
 */
export type SortDirection =
  (typeof SORT_DIRECTIONS)[keyof typeof SORT_DIRECTIONS];

/**
 * Dynamic map representing all targeted search fields mapped explicitly from BookFilterField keys.
 * Automatically expands if new fields are appended to the core FILTER_FIELDS constant registry.
 */
export type TargetedFiltersState = Readonly<Record<BookFilterField, string>>;

/**
 * Structured state definition capturing all multidimensional query and sorting metrics.
 * Combines global search primitives, targeted domain field filters, and sorting configurations.
 * Features mandatory property documentation layout specifications above every signature field.
 */
export interface AdvancedFiltersState extends TargetedFiltersState {
  /** A global plaintext keyword used for matching across all available text attributes */
  readonly globalSearch: string;
  /** A specific plaintext keyword used strictly for filtering items by their title attribute */
  readonly titleSearch: string;
  /** The specific model field configuration currently selected to dictate collection order */
  readonly sortField: SortField;
  /** The direction matrix vector determining how the sorted field collection is ordered */
  readonly sortDirection: SortDirection;
}
