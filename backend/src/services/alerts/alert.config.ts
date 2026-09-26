export const ALERT_CONFIG = {
    HIGH_CPU:{
        threshold: 80,
        severity: "warning",
    },

    HIGH_MEMORY: {
        threshold: 80,
        severity: "warning",
    },

    HIGH_DISK: {
        threshold: 85,
        severity: "warning",
    },

    SERVICE_DOWN: {
        severity: "critical",
    },

    SERVER_OFFLINE: {
        severity: "critical",
    },
} as const;