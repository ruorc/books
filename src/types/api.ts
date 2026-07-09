/**
 * Structural contract defining configuration rules for automated transaction retry logic.
 */
export interface RetryOptions {
  /** The maximum number of automated retry attempts after a failed request */
  readonly retries?: number;
  /** The delay duration in milliseconds between consecutive retry attempts */
  readonly delay?: number;
  /** The maximum delay duration in milliseconds between consecutive retry attempts */
  readonly maxDelay?: number;
  /** An AbortSignal instance allowing the operation to be cancelled mid-flight */
  readonly signal?: AbortSignal;
}

/**
 * Baseline filtration contract hosting default criteria attributes used across network services.
 * Features compile-time model mapping constraints to validate field selection boundaries.
 */
export interface BaseQueryFilters<T = Record<string, unknown>> {
  /** A plaintext keyword used for global text or title matching queries */
  readonly search?: string;
  /** Indicates favorite items selection matching boolean or serialized storage string states */
  readonly isFavorite?: boolean | string;
  /** Filters the results by the specific identifier or name of the author */
  readonly author?: string;
  /** Filters the results by a specific calendar year */
  readonly year?: string;
  /** Array of specific entity attributes requested from the backend infrastructure validated against model T */
  readonly select?: Array<keyof T>;
}

/**
 * Strict dictionary specification mapping primitive dynamic query indicators.
 * Fully eliminates any usage types to ensure static analysis verification during path formatting.
 */
export type CustomParams = Record<
  string,
  string | number | boolean | undefined
>;

/**
 * Universal composite contract for HTTP query parameters filtering operations.
 * Intersects baseline selection fields with flexible primitive signatures securely.
 * Leverages generic structure parameters to maintain type safety down the execution tree.
 */
export type QueryFilters<T = Record<string, unknown>> = BaseQueryFilters<T> &
  CustomParams;
