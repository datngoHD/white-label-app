import { environment } from '../config/environment.config';
import { LogLevel } from '../types';

type LogMethod = (...args: unknown[]) => void;

interface Logger {
  debug: LogMethod;
  info: LogMethod;
  warn: LogMethod;
  error: LogMethod;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel = LOG_LEVELS[environment.logLevel];

const shouldLog = (level: LogLevel): boolean => {
  return LOG_LEVELS[level] >= currentLevel;
};

const formatMessage = (level: string, _args: unknown[]): string => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}]`;
};

const createLogMethod = (level: LogLevel, consoleFn: LogMethod): LogMethod => {
  return (...args: unknown[]) => {
    if (shouldLog(level)) {
      consoleFn(formatMessage(level, args), ...args);
    }
  };
};

export const logger: Logger = {
  debug: createLogMethod('debug', console.debug),
  info: createLogMethod('info', console.info),
  warn: createLogMethod('warn', console.warn),
  error: createLogMethod('error', console.error),
};

export const setLogContext = (_context: Record<string, unknown>): void => {
  // This can be extended to add context to all log messages
  // Useful for Sentry breadcrumbs or structured logging
};
