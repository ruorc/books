import { NETWORK_CONFIG } from '@/config/network';
import { HttpServiceError } from './HttpServiceError';

/**
 * Functional predicate signature evaluating whether a captured unknown failure
 * meets the systemic or environmental criteria required to trigger a retry.
 */
export type RetryPredicate = (error: unknown) => boolean;

/**
 * Evaluates whether a network error or specific HTTP status code qualifies for a retry attempt.
 */
export const shouldRetryRequest: RetryPredicate = (error: unknown): boolean => {
  if (error instanceof HttpServiceError) {
    return (error.status >= 500 && error.status < 600) || error.status === 429;
  }
  return true;
};

/**
 * Iterative runner that executes an asynchronous operation with exponential backoff and full jitter.
 * Safely handles memory clearance for abort listeners and prevents stack overflow.
 */
export async function runWithRetry<R>(
  fn: () => Promise<R>,
  retries: number,
  delay: number,
  contextName: string,
  signal?: AbortSignal,
  shouldRetry?: RetryPredicate,
  maxDelay: number = NETWORK_CONFIG.DEFAULT_MAX_DELAY
): Promise<R> {
  let attemptsLeft = retries;
  let currentDelay = delay;

  while (true) {
    try {
      return await fn();
    } catch (error) {
      if (signal?.aborted) {
        throw signal.reason || new Error('Aborted');
      }

      if (
        error instanceof Error &&
        (error.name === 'AbortError' || error.name === 'TimeoutError')
      ) {
        throw error;
      }

      if (shouldRetry && !shouldRetry(error)) {
        throw error;
      }

      if (attemptsLeft <= 0) {
        throw error;
      }

      const cappedDelay = Math.min(currentDelay, maxDelay);
      const jitteredDelay = Math.random() * cappedDelay;

      console.warn(
        `[${contextName}] Network failed. Retrying in ${Math.round(jitteredDelay)}ms (max interval: ${Math.round(cappedDelay)}ms)... (${attemptsLeft} attempts left)`
      );

      await new Promise<void>((resolve, reject) => {
        let timer: ReturnType<typeof setTimeout> | undefined;

        const handleAbort = () => {
          if (timer) clearTimeout(timer);
          cleanup();
          reject(signal?.reason || new Error('Aborted'));
        };

        const cleanup = () => {
          signal?.removeEventListener('abort', handleAbort);
        };

        timer = setTimeout(() => {
          cleanup();
          resolve();
        }, jitteredDelay);

        signal?.addEventListener('abort', handleAbort);
      });

      attemptsLeft--;
      currentDelay *= 1.5;
    }
  }
}
