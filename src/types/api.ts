export interface RetryOptions {
  retries?: number;
  delay?: number;
  signal?: AbortSignal;
}

/**
 * Universal dictionary payload for HTTP query string parameters filtering operations.
 * Supports optional generic type mapping for strict fields selection workflows.
 */
export interface QueryFilters<T = any> {
  search?: string;
  isFavorite?: boolean | string; // Adjusted to natively support serialized storage lookups
  author?: string;
  year?: string;

  /**
   * Array of specific entity keys requested from the backend infrastructure.
   * If T is provided, enforces compilation-level safety for field naming.
   */
  select?: Array<keyof T>;

  /**
   * Index signature allowing fallback definitions for specialized service layers.
   * Restructured to perfectly match generic object traversal methods like Object.entries.
   */
  [key: string]: any;
}
