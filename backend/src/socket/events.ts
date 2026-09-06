export const SOCKET_EVENTS = {
  CONNECTION: "connection",

  METRICS_UPDATED: "metricsUpdated",

  SERVICES_UPDATED: "servicesUpdated",

  SERVER_OFFLINE: "serverOffline",

  ALERT_CREATED: "alertCreated",

  ALERT_RESOLVED: "alertResolved",
} as const;