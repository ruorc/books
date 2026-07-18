/**
 * Custom error class capturing the original server response and status code without extracting the payload stream prematurely.
 */
export class HttpServiceError extends Error {
  /** Enables immediate non-blocking status evaluation and error routing down the execution tree */
  public readonly status: number;

  /** Preserves the unread server payload stream for lazy downstream diagnostic logging */
  public readonly response: Response;

  /**
   * Initializes the diagnostic tracking token with essential telemetry boundaries.
   * Couples network failure vectors directly to application crash recovery layers.
   */
  constructor(status: number, response: Response) {
    super(`HTTP error. Status: ${status}`);
    this.name = 'HttpServiceError';
    this.status = status;
    this.response = response;
  }
}
