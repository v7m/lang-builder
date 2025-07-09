import dotenv from 'dotenv';

dotenv.config();

type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'success';

type LogIndentOptions = {
  indent?: number;
};

const DEFAULT_LOG_LEVEL: LogLevel = 'info';
const INDENT_STRING = '  ';
const RESET_COLOR = '\x1b[0m';
const TIMESTAMP_COLOR = '\x1b[90m'; // purple

const LOG_LEVEL_COLORS: Record<LogLevel, string> = {
  info: '\x1b[36m',    // cyan
  warn: '\x1b[33m',    // yellow
  error: '\x1b[31m',   // red
  debug: '\x1b[90m',   // gray
  success: '\x1b[32m', // green
};

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  success: 2,
  info: 3,
  debug: 4,
};

const EMOJIS: Record<LogLevel, string> = {
  info: 'ℹ️',
  warn: '⚠️',
  error: '❌',
  debug: '🐛',
  success: '✅',
};

const currentLevel: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) || DEFAULT_LOG_LEVEL;

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] <= LEVEL_PRIORITY[currentLevel];
}

function getIndent(level: number = 0): string {
  return INDENT_STRING.repeat(level);
}

function formatTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');

  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1);
  const year = now.getFullYear();
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function log(level: LogLevel, ...args: unknown[]): void {
  if (!shouldLog(level)) return;

  let indentLevel = 0;

  const lastArg = args[args.length - 1];
  if (
    typeof lastArg === 'object' &&
    lastArg !== null &&
    !(lastArg instanceof Error) &&
    'indent' in lastArg
  ) {
    indentLevel = (lastArg as LogIndentOptions).indent ?? 0;
    args.pop(); // remove options object
  }

  const timestamp = formatTimestamp();
  const color = LOG_LEVEL_COLORS[level];
  const emoji = EMOJIS[level];
  const timestampColor = `${TIMESTAMP_COLOR}${timestamp}${RESET_COLOR}`;
  const label = `${emoji} [${color}${level.toUpperCase()}${RESET_COLOR}] [${timestampColor}]`;
  const indent = getIndent(indentLevel);

  switch (level) {
    case 'info':
      console.info(`${color}${indent}${label}${RESET_COLOR}`, ...args);
      break;
    case 'warn':
      console.warn(`${color}${indent}${label}${RESET_COLOR}`, ...args);
      break;
    case 'error':
      console.error(`${color}${indent}${label}${RESET_COLOR}`, ...args);
      break;
    case 'debug':
      console.debug(`${color}${indent}${label}${RESET_COLOR}`, ...args);
      break;
    default:
      console.log(`${color}${indent}${label}${RESET_COLOR}`, ...args);
  }
}

export const logger = {
  info: (...args: unknown[]) => log('info', ...args),
  warn: (...args: unknown[]) => log('warn', ...args),
  error: (...args: unknown[]) => log('error', ...args),
  debug: (...args: unknown[]) => log('debug', ...args),
  success: (...args: unknown[]) => log('success', ...args),
};
