import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  beforeSend(event) {
    // Add organization context if available
    const orgId = localStorage.getItem("orgId");
    const locationId = localStorage.getItem("locationId");

    if (orgId) {
      event.tags = { ...event.tags, orgId };
    }

    if (locationId) {
      event.tags = { ...event.tags, locationId };
    }

    return event;
  },
});
