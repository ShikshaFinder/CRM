/**
 * Simple logging utility
 * In production, consider using a proper logging service (e.g., Winston, Pino, or a cloud service)
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

function formatLog(entry: LogEntry): string {
  const { level, message, timestamp, metadata } = entry;
  const metaStr = metadata ? ` ${JSON.stringify(metadata)}` : '';
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
}

export const logger = {
  info(message: string, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      metadata,
    };
    console.log(formatLog(entry));
  },

  warn(message: string, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      metadata,
    };
    console.warn(formatLog(entry));
  },

  error(message: string, error?: Error | any, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      metadata: {
        ...metadata,
        error: error?.message || error,
        stack: error?.stack,
      },
    };
    console.error(formatLog(entry));
  },

  debug(message: string, metadata?: Record<string, any>) {
    if (process.env.NODE_ENV === 'development') {
      const entry: LogEntry = {
        level: 'debug',
        message,
        timestamp: new Date().toISOString(),
        metadata,
      };
      console.debug(formatLog(entry));
    }
  },
};

