import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  debug: false,
  beforeSend(event) {
    // Add server-side context
    event.tags = {
      ...event.tags,
      server: true,
    };

    return event;
  },
});
