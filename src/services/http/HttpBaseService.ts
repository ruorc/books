import { NETWORK_CONFIG } from '@/config/network';
import { formatServerError } from './HttpErrorFormatter';
import { HttpServiceError } from './HttpServiceError';
import { BaseUrlManager } from '../BaseUrlManager';

import type { AuthInterceptor } from '@/types/auth';

/**
 * Lightweight low-level HTTP client managing transport, timeouts, and authorization lifecycles.
 */
export abstract class HttpBaseService {
  /**
   * Immutable engine coordinating protocol checks, validation rules, and safe dynamic route segment resolution.
   */
  protected readonly urlManager: BaseUrlManager;

  /**
   * Optional abstraction layers driving token evaluation, credential formatting, and token refresh challenges.
   */
  protected readonly authInterceptor?: AuthInterceptor;

  /**
   * Registers network destinations and binds optional authorization interceptor engines.
   */
  constructor(endpointUrl: string, authInterceptor?: AuthInterceptor) {
    this.urlManager = new BaseUrlManager(endpointUrl, this.constructor.name, [
      'http:',
      'https:',
    ]);
    this.authInterceptor = authInterceptor;
  }

  /**
   * Returns the fully serialized base URL string stripped of any trailing slashes.
   */
  public get url(): string {
    return this.urlManager.url;
  }

  /**
   * Returns the isolated URL pathname string stripped of any trailing slashes.
   */
  public get path(): string {
    return this.urlManager.path;
  }

  /**
   * Dispatches unified network payloads across egress application boundaries.
   * Intercepts stale authentication signals to transparently trigger credentials recovery tasks before pipeline failure.
   */
  protected async request<R>(
    url: string,
    options?: RequestInit,
    isRetryAttempt = false
  ): Promise<R> {
    const combinedSignal = this.createTimeoutSignal(
      options?.signal ?? undefined
    );
    const headers = new Headers(options?.headers);

    if (this.authInterceptor) {
      const token = await this.authInterceptor.getAccessToken();

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        signal: combinedSignal,
        headers,
      });

      if (response.ok) {
        return response.status === 204 ? ({} as R) : await response.json();
      }

      const error = new HttpServiceError(response.status, response);

      if (response.status === 401 && !isRetryAttempt && this.authInterceptor) {
        const isRecovered = await this.authInterceptor.refreshSession();

        if (isRecovered) {
          return await this.request<R>(url, options, true);
        }
      }

      throw error;
    } catch (error) {
      if (error instanceof Error && error.name === 'TimeoutError') {
        throw new Error(`Request timed out after ${NETWORK_CONFIG.TIMEOUT}ms`, {
          cause: error,
        });
      }

      throw error;
    }
  }

  /**
   * Resolves raw transport crashes and extracts descriptive feedback payloads from upstream diagnostics logs.
   */
  protected async handleError(
    error: unknown,
    contextMessage: string
  ): Promise<Error> {
    if (
      error instanceof Error &&
      (error.name === 'AbortError' || error.name === 'TimeoutError')
    ) {
      return error;
    }

    let errorMessage = 'Unknown network failure';

    if (error instanceof HttpServiceError) {
      errorMessage = await formatServerError(error.response);
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return new Error(`${contextMessage}: ${errorMessage}`, { cause: error });
  }

  /**
   * Combines execution cancellation contexts to enforce absolute resource protection against hanging connections.
   */
  private createTimeoutSignal(userSignal?: AbortSignal): AbortSignal {
    const timeoutSignal = AbortSignal.timeout(NETWORK_CONFIG.TIMEOUT);

    return userSignal
      ? AbortSignal.any([userSignal, timeoutSignal])
      : timeoutSignal;
  }
}
