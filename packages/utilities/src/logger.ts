export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogContext {
  orgId?: string;
  locationId?: string;
  transactionId?: string;
  userId?: string;
  [key: string]: any;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: LogContext;
  timestamp: Date;
  error?: Error;
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = LogLevel.INFO;
  private context: LogContext = {};

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  setContext(context: LogContext): void {
    this.context = { ...this.context, ...context };
  }

  clearContext(): void {
    this.context = {};
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const level = LogLevel[entry.level];
    const contextStr =
      Object.keys(entry.context || {}).length > 0
        ? ` [${JSON.stringify(entry.context)}]`
        : "";

    return `[${timestamp}] ${level}${contextStr}: ${entry.message}`;
  }

  private log(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error,
  ): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      context: { ...this.context, ...context },
      timestamp: new Date(),
      error,
    };

    const formattedMessage = this.formatMessage(entry);

    // In a real implementation, you might send logs to a service like Sentry
    // For now, we'll use console methods
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, error);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, error);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, error);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, error);
        break;
    }

    // Send to external logging service if configured
    this.sendToExternalService(entry);
  }

  private sendToExternalService(entry: LogEntry): void {
    // This would integrate with services like Sentry, LogRocket, etc.
    // For now, it's a no-op
  }

  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: LogContext, error?: Error): void {
    this.log(LogLevel.WARN, message, context, error);
  }

  error(message: string, context?: LogContext, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  // Convenience methods for common logging patterns
  logTransaction(
    transactionId: string,
    message: string,
    context?: LogContext,
  ): void {
    this.info(message, { ...context, transactionId });
  }

  logUserAction(userId: string, action: string, context?: LogContext): void {
    this.info(`User action: ${action}`, { ...context, userId });
  }

  logApiCall(
    endpoint: string,
    method: string,
    duration?: number,
    context?: LogContext,
  ): void {
    const message = duration
      ? `API ${method} ${endpoint} completed in ${duration}ms`
      : `API ${method} ${endpoint}`;
    this.info(message, context);
  }

  logError(error: Error, context?: LogContext): void {
    this.error(error.message, context, error);
  }
}

// Export singleton instance
export const logger = Logger.getInstance();
