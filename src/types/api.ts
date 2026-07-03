export interface RetryOptions {
  /** The maximum number of automated retry attempts after a failed request. */
  retries?: number;
  /** The delay duration in milliseconds between consecutive retry attempts. */
  delay?: number;
  /** An AbortSignal instance allowing the operation to be cancelled mid-flight. */
  signal?: AbortSignal;
}

/**
 * Known baseline filtering properties available across standard service definitions.
 * @template T - The model type used to strictly validate the 'select' fields. Defaults to a generic object record.
 */
export interface BaseQueryFilters<T = Record<string, unknown>> {
  /** A plaintext keyword used for global text or title matching queries. */
  search?: string;
  /** Indicates favorite items. String option supports serialized storage values like "true"/"false". */
  isFavorite?: boolean | string;
  /** Filters the results by the specific identifier or name of the author. */
  author?: string;
  /** Filters the results by a specific calendar year. */
  year?: string;
  /**
   * Array of specific entity keys requested from the backend infrastructure.
   * Enforces compile-time validation against the provided model type T.
   */
  select?: Array<keyof T>;
}

/**
 * Strict record definition for arbitrary, primitive custom query parameters.
 * Eliminates 'any' to ensure type safety during object validation and traversal.
 */
export type CustomParams = Record<
  string,
  string | number | boolean | undefined
>;

/**
 * Universal dictionary payload for HTTP query string parameters filtering operations.
 * Merges baseline fields with type-safe index signatures via type intersection.
 *
 * @template T - The core model entity type, defaults to a generic object record.
 */
export type QueryFilters<T = Record<string, unknown>> = BaseQueryFilters<T> &
  CustomParams;
