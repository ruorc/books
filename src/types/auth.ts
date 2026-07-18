/**
 * Core domain contract managing generic credentials retrieval and session recovery mechanisms across any transport protocol.
 */
export interface AuthInterceptor {
  /**
   * Resolves authentication credentials required to authorize secure egress gateway transactions.
   */
  readonly getAccessToken: () => Promise<string | null> | string | null;

  /**
   * Recovers dead session states contextually before pipeline failures collapse active layout streams.
   */
  readonly refreshSession: () => Promise<boolean>;
}
