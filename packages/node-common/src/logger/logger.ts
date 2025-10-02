import pino from 'pino';
const base = pino({ level: process.env.LOG_LEVEL ?? 'debug' });

// ----- overloads (so both orders compile) -----
export interface Logger {
  error(message: string, details?: unknown): void;
  error(details: unknown, message?: string): void;

  warn(message: string, details?: unknown): void;
  warn(details: unknown, message?: string): void;

  info(message: string, details?: unknown): void;
  info(details: unknown, message?: string): void;

  debug(message: string, details?: unknown): void;
  debug(details: unknown, message?: string): void;
}

type Level = 'error' | 'warn' | 'info' | 'debug';

function write(level: Level, a: unknown, b?: unknown): void {
  if (typeof a === 'string') {
    const msg = a; const details = b;
    if (details instanceof Error) base[level]({ err: details }, msg);
    else if (details !== undefined) base[level]({ details }, msg);
    else base[level](msg);
    return;
  }
  // a is details, b may be message
  const details = a; const msg = typeof b === 'string' ? b : undefined;
  if (details instanceof Error) {
    msg ? base[level](details, msg) : base[level](details); // pino err-first
  } else if (details !== undefined) {
    msg ? base[level]({ details }, msg) : base[level]({ details });
  } else {
    msg ? base[level](msg) : base[level](''); // fallback
  }
}

// concrete functions with a wide implementation signature
function _error(a: unknown, b?: unknown) { write('error', a, b); }
function _warn(a: unknown, b?: unknown)  { write('warn',  a, b); }
function _info(a: unknown, b?: unknown)  { write('info',  a, b); }
function _debug(a: unknown, b?: unknown) { write('debug', a, b); }

// cast to the overloaded interface
export const logger: Logger = {
  error: _error as Logger['error'],
  warn:  _warn  as Logger['warn'],
  info:  _info  as Logger['info'],
  debug: _debug as Logger['debug'],
};
