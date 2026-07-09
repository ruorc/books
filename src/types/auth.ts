/**
 * Core domain contract managing generic credentials retrieval and session recovery mechanisms across any transport protocol.
 */
export interface AuthInterceptor {
  /**
   * Retrieves the current access token string from state or storage.
   */
  readonly getAccessToken: () => Promise<string | null> | string | null;

  /**
   * Triggers session credential renewal operations and returns true if recovery was successful.
   */
  readonly refreshSession: () => Promise<boolean>;
}
