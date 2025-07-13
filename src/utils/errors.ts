import { logger } from '@/services/logger';

/**
 * Logs an error with a custom message and throws it.
 * Useful for adding context to errors while preserving the original error object.
 * 
 * @param message - Custom message to log with the error
 * @param error - The error object to log and throw
 * @throws The original error object
 */
export function logAndThrowError(message: string, error: Error): never {
  logger.error(message, error.message);
  throw error;
}

/**
 * Creates a new error with a custom message while preserving the original error as cause.
 * Useful for adding domain-specific context to lower-level errors.
 * 
 * @param message - New error message
 * @param cause - The original error that caused this error
 * @returns A new error with the original error as its cause
 */
export function createError(message: string, cause: Error): Error {
  return new Error(message, { cause });
}
