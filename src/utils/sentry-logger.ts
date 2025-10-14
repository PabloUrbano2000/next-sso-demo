import * as Sentry from '@sentry/nextjs'

interface SentryOptions {
  userId?: string
  email?: string
  tags?: Record<string, string>
  extras?: Record<string, unknown>
  level?: 'error' | 'warning' | 'info' | 'debug'
  error?: Error
  message?: string
}

export async function logToSentry(opts: SentryOptions) {
  Sentry.withScope((scope) => {
    if (opts.userId || opts.email) {
      scope.setUser({ id: opts.userId, email: opts.email })
    }

    if (opts.tags) {
      Object.entries(opts.tags).forEach(([k, v]) => scope.setTag(k, v))
    }

    if (opts.extras) {
      Object.entries(opts.extras).forEach(([k, v]) => scope.setExtra(k, v))
    }

    if (opts.error) {
      Sentry.captureException(opts.error)
    } else if (opts.message) {
      Sentry.captureMessage(
        opts.message,
        (opts.level || 'error') as Sentry.SeverityLevel
      )
    }
  })

  // Importante en serverless / lambdas
  await Sentry.flush(1000)
}
