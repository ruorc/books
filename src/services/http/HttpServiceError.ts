/**
 * Custom error class capturing the original server response and status code without extracting the payload stream prematurely.
 */
export class HttpServiceError extends Error {
  /** The HTTP numeric status code returned by the remote server infrastructure */
  public readonly status: number;

  /** The raw native Web API Response object captured from the network fetch operation */
  public readonly response: Response;

  /**
   * Initializes the error instance with the status code and raw server response metadata.
   */
  constructor(status: number, response: Response) {
    super(`HTTP error. Status: ${status}`);
    this.name = 'HttpServiceError';
    this.status = status;
    this.response = response;
  }
}
