import Sentry from '@sentry/node'
import { SENTRY_DSN } from './config.js'

if (SENTRY_DSN) {
  Sentry.init({ dsn: SENTRY_DSN  })
}
