/**
 * Centralized error logger.
 *
 * In production, swap `logToService` with your monitoring provider:
 *   - Sentry: Sentry.captureException(error, { extra: context })
 *   - Axiom: client.ingest('errors', [{ error, ...context }])
 *   - Datadog: etc.
 *
 * Usage:
 *   import { logger } from '@/lib/logger'
 *   logger.error('[getProfile]', error, { userId })
 */

type LogContext = Record<string, unknown>

function logToService(level: 'error' | 'warn', message: string, error?: unknown, context?: LogContext) {
  // TODO: replace with Sentry.captureException or your monitoring provider
  // Example: Sentry.captureException(error, { extra: { message, ...context } })
  if (process.env.NODE_ENV === 'production') {
    // Production: structured JSON for log aggregators (Vercel, Datadog, etc.)
    console[level](JSON.stringify({ level, message, error: error instanceof Error ? error.message : error, ...context, ts: new Date().toISOString() }))
  } else {
    // Development: readable format
    console[level](`[${level.toUpperCase()}] ${message}`, error ?? '', context ?? '')
  }
}

export const logger = {
  error: (message: string, error?: unknown, context?: LogContext) =>
    logToService('error', message, error, context),
  warn: (message: string, context?: LogContext) =>
    logToService('warn', message, undefined, context),
}
