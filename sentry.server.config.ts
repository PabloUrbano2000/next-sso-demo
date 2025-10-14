import { envs } from '@/config/envs'
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: envs.SENTRY_DNS,
  environment: envs.NODE_ENV
  // tracesSampleRate: 1.0 // ajusta en prod
})
