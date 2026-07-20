import {
  type AppConfig,
  type LogLevel,
  LOG_LEVELS,
  LEVEL_WEIGHTS,
  appConfig,
} from '@/config/app.config';

/**
 * Structured context and metadata envelope for diagnostic records.
 */
interface LogContext {
  /**
   * The name or identifier of the architectural module or service originating the entry.
   * Facilitates targeted filtering across application layers.
   */
  readonly module?: string;

  /**
   * Flat key-value dictionary of metrics used for rapid indexing.
   * Utilized for building analytical dashboards and real-time alerts in log aggregators.
   */
  readonly tags?: Record<string, string | number | boolean>;

  /**
   * Arbitrary additional properties captured during execution telemetry.
   */
  readonly [key: string]: unknown;
}

/**
 * Centered application observability and diagnostics gateway.
 * Abstracts execution environments and routes payloads to operational transport layers.
 */
class AppLogger {
  /**
   * Centralized application configuration object reference.
   */
  private readonly config: AppConfig;

  /**
   * Fallback message prefix used when JSON serialization fails in production.
   */
  private readonly serializationFailurePrefix: string =
    '[Serialization Failure] ';

  /**
   * Critical telemetry transmission failure warning message.
   */
  private readonly telemetryFailureMessage: string =
    'Telemetry transmission pipeline failure:';

  /**
   * Standard keys found on native Error objects to exclude from custom detail extraction.
   */
  private readonly standardErrorKeys: Set<string> = new Set([
    'name',
    'message',
    'stack',
  ]);

  /**
   * Initializes the logger with abstracted system configurations.
   *
   * config: The centralized environment configuration object.
   */
  constructor(config: AppConfig) {
    this.config = config;
  }

  /**
   * Tracks telemetry operational milestones, execution checkpoints, or diagnostic indicators.
   *
   * message: Verbal description of the recorded operational milestone.
   * context: Structural execution metadata or domain metrics.
   */
  public info(message: string, context?: LogContext): void {
    this.dispatch(LOG_LEVELS.INFO.id, message, context);
  }

  /**
   * Records recoverable application degradation signals or configuration anomalies.
   *
   * message: Notice detailing the non-breaking anomaly detected.
   * context: Architectural metadata helping isolate the runtime risk area.
   */
  public warn(message: string, context?: LogContext): void {
    this.dispatch(LOG_LEVELS.WARN.id, message, context);
  }

  /**
   * Captures critical system state exceptions and routes them to infrastructure quality gates.
   *
   * message: High-level operational context of the runtime failure.
   * error: The raw error payload caught (standard instance or custom runtime structure).
   * context: Contextual state parameters active when the disruption occurred.
   */
  public error(message: string, error?: unknown, context?: LogContext): void {
    this.dispatch(LOG_LEVELS.ERROR.id, message, {
      ...context,
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
              ...this.extractErrorDetails(error),
            }
          : error,
    });

    if (this.config.isProduction && error) {
      this.sendToExternalMonitoring(message, error, context);
    }
  }

  /**
   * Creates a bound, lightweight scope for a specific functional module.
   * Eliminates the need to manually pass the module parameter in subsequent calls.
   *
   * moduleName: The name of the structural layer or component.
   * returns: A localized logging interface with pre-filled module context.
   */
  public forModule(moduleName: string) {
    return {
      info: (message: string, context?: Omit<LogContext, 'module'>): void =>
        this.info(message, { module: moduleName, ...context }),
      warn: (message: string, context?: Omit<LogContext, 'module'>): void =>
        this.warn(message, { module: moduleName, ...context }),
      error: (
        message: string,
        error?: unknown,
        context?: Omit<LogContext, 'module'>
      ): void => this.error(message, error, { module: moduleName, ...context }),
    };
  }

  /**
   * Extracts un-enumerable and custom data properties added to custom Error instances.
   *
   * error: The source Error object to evaluate.
   * returns: Dynamic dictionary containing custom properties found on the object.
   */
  private extractErrorDetails(error: Error): Record<string, unknown> {
    const details: Record<string, unknown> = {};

    for (const key of Object.getOwnPropertyNames(error)) {
      if (!this.standardErrorKeys.has(key)) {
        details[key] = (error as unknown as Record<string, unknown>)[key];
      }
    }
    return details;
  }

  /**
   * Resolves structural environment targets and outputs diagnostic payloads.
   *
   * level: Severity evaluation level (info, warn, error).
   * message: Plain-text message string being written.
   * context: Omitted, plain, or deeply structured runtime diagnostic context.
   */
  private dispatch(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): void {
    const activeWeight = LEVEL_WEIGHTS[level] ?? 0;
    const thresholdWeight = LEVEL_WEIGHTS[this.config.logLevel] ?? 0;

    if (activeWeight < thresholdWeight) {
      return;
    }

    const timestamp = new Date().toISOString();
    const formattedPayload = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...(context && { context }),
    };

    if (!this.config.isProduction) {
      // eslint-disable-next-line no-console
      console[level](
        `[${timestamp}] [${level.toUpperCase()}] ${message}`,
        context ?? ''
      );
      return;
    }

    try {
      // eslint-disable-next-line no-console
      console.info(JSON.stringify(formattedPayload));
    } catch (serializeError) {
      // eslint-disable-next-line no-console
      console.info(
        JSON.stringify({
          timestamp,
          level: level.toUpperCase(),
          message: `${this.serializationFailurePrefix}${message}`,
          error:
            serializeError instanceof Error
              ? serializeError.message
              : String(serializeError),
        })
      );
    }
  }

  /**
   * External telemetry bridge execution layer (e.g., Sentry, Bugsnag, Datadog).
   *
   * _message: High-level contextual error summary message.
   * _error: Deserialized or raw error exception payload structure.
   * _context: Associated execution scopes and infrastructure metrics tracking.
   */
  private sendToExternalMonitoring(
    _message: string,
    _error: unknown,
    _context?: LogContext
  ): void {
    try {
      // Sentry.captureException(_error instanceof Error ? _error : new Error(_message));
    } catch (telemetryError) {
      // eslint-disable-next-line no-console
      console.info(this.telemetryFailureMessage, telemetryError);
    }
  }
}

export const sysLogger = new AppLogger(appConfig);
