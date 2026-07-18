import { NETWORK_CONFIG } from '@/config/network';
import { HttpServiceError } from './HttpServiceError';

/**
 * Functional predicate signature evaluating whether a captured unknown failure
 * meets the systemic or environmental criteria required to trigger a retry.
 */
export type RetryPredicate = (error: unknown) => boolean;

/**
 * Visual strategy evaluator guarding application pipelines against transient server failure states.
 */
export const shouldRetryRequest: RetryPredicate = (error: unknown): boolean => {
  if (error instanceof HttpServiceError) {
    return (error.status >= 500 && error.status < 600) || error.status === 429;
  }

  return true;
};

/**
 * Fault-tolerant execution container orchestrating progressive backoff transactions.
 * Mitigates cloud gateway synchronization crashes by flattening traffic spikes using full jitter scheduling,
 * while protecting underlying execution runtimes from stack trace exhaustion and thread blockages.
 */
export async function runWithRetry<R>(
  fn: () => Promise<R>,
  retries: number,
  delay: number,
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

      await new Promise<void>((resolve, reject) => {
        const cleanup = (): void => {
          signal?.removeEventListener('abort', handleAbort);
        };

        const handleAbort = (): void => {
          clearTimeout(timer);
          cleanup();
          reject(signal?.reason || new Error('Aborted'));
        };

        const timer = setTimeout(() => {
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
