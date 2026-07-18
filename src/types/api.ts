/**
 * Structural contract defining configuration rules for automated transaction retry logic.
 */
export interface RetryOptions {
  /** Governs defensive network policies when dealing with fragile remote microservices */
  readonly retries?: number;
  /** Controls exponential or static scheduling intervals between sequential connection attempts */
  readonly delay?: number;
  /** Prevents throttling penalties by capping maximum timeout intervals during progressive backoff sequences */
  readonly maxDelay?: number;
  /** Connects mid-flight request lifecycles to global timeout trees or explicit view eviction hooks */
  readonly signal?: AbortSignal;
}

/**
 * Baseline filtration contract hosting default criteria attributes used across network services.
 * Constrains payload delivery mechanisms to prevent heavy data over-fetching.
 */
export interface BaseQueryFilters<T = Record<string, unknown>> {
  /** Matches partial text layout entries across broad non-specific resource descriptors */
  readonly search?: string;
  /** Filters the dataset collection to segment strictly user-bookmarked metadata assets */
  readonly isFavorite?: boolean | string;
  /** Restricts collection query streams to items bound to a singular unique author token */
  readonly author?: string;
  /** Constrains historical timeline operations using explicit chronological indexing boundaries */
  readonly year?: string;
  /** Optimizes payload bandwidth by extracting specific database attributes needed for immediate rendering */
  readonly select?: Array<keyof T>;
}

/**
 * Strict dictionary specification mapping primitive dynamic query indicators.
 */
export type CustomParams = Record<
  string,
  string | number | boolean | undefined
>;

/**
 * Universal composite contract for HTTP query parameters filtering operations.
 * Intersects baseline selection fields with flexible primitive signatures securely.
 */
export type QueryFilters<T = Record<string, unknown>> = BaseQueryFilters<T> &
  CustomParams;
