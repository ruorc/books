/**
 * Allowed application logging severity levels.
 * These constants represent the supported architectural logging levels
 * used for system observability, event routing, and metric filtering.
 */
export const LOG_LEVELS = {
  /** Tracks telemetry operational milestones or execution checkpoints. */
  INFO: { id: 'info', weight: 1 },
  /** Records recoverable application degradation signals or anomalies. */
  WARN: { id: 'warn', weight: 2 },
  /** Captures critical system state exceptions and failures. */
  ERROR: { id: 'error', weight: 3 },
} as const;

/**
 * Inferred union type of all allowed application logging severity levels.
 */
export type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS]['id'];

/**
 * High-performance flat dictionary mapping log level IDs to their numeric priorities.
 * Provides O(1) weight lookups to avoid analytical array iterations at runtime.
 */
export const LEVEL_WEIGHTS: Record<LogLevel, number> = {
  [LOG_LEVELS.INFO.id]: LOG_LEVELS.INFO.weight,
  [LOG_LEVELS.WARN.id]: LOG_LEVELS.WARN.weight,
  [LOG_LEVELS.ERROR.id]: LOG_LEVELS.ERROR.weight,
};

/**
 * Configuration schema for global application parameters.
 */
export interface AppConfig {
  /** Flag indicating if the current target environment is production. */
  readonly isProduction: boolean;
  /** The active minimum log filtering severity boundary. */
  readonly logLevel: LogLevel;
}

/**
 * Centered configuration instance mapping environment variables to application parameters.
 */
export const appConfig: AppConfig = {
  isProduction: import.meta.env.PROD,
  logLevel:
    (import.meta.env.VITE_LOG_LEVEL as LogLevel) ||
    (import.meta.env.PROD ? LOG_LEVELS.WARN.id : LOG_LEVELS.INFO.id),
};
