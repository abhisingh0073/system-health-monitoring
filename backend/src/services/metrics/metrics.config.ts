
export const METRICS_RANGE_CONFIG = {
    "1h": {
        duration: "1 hour",
        bucket: "1 minute",
    },

    "6h": {
        duration: "6 hour",
        bucket: "5 minutes",
    },

    "24h": {
        duration: "24 hour",
        bucket: "5 minute",
    },

    "7d": {
        duration: "7 days",
        bucket: "1 hour",
    },

    "30d": {
        duration: "30 days",
        bucket: "6 hour",
    }
} as const;

export type MetricsRange = keyof typeof METRICS_RANGE_CONFIG;