import type { ServerStatus } from "@/types/server";
import type { ServiceStatus } from "@/types/service";

type AnyStatus = ServerStatus | ServiceStatus;

interface StatusBadgeProps {
  status: AnyStatus;
  showDot?: boolean;
}

const config: Record<AnyStatus, { label: string; dot: string; bg: string; text: string }> = {
  // Server statuses
  online: {
    label: "Online",
    dot: "bg-[var(--green)]",
    bg: "bg-[var(--green-subtle)]",
    text: "text-[var(--green)]",
  },
  offline: {
    label: "Offline",
    dot: "bg-[var(--red)]",
    bg: "bg-[var(--red-subtle)]",
    text: "text-[var(--red)]",
  },
  unknown: {
    label: "Unknown",
    dot: "bg-[var(--yellow)]",
    bg: "bg-[var(--yellow-subtle)]",
    text: "text-[var(--yellow)]",
  },
  // Service statuses
  running: {
    label: "Running",
    dot: "bg-[var(--green)]",
    bg: "bg-[var(--green-subtle)]",
    text: "text-[var(--green)]",
  },
  stopped: {
    label: "Stopped",
    dot: "bg-[var(--red)]",
    bg: "bg-[var(--red-subtle)]",
    text: "text-[var(--red)]",
  },
  not_installed: {
    label: "Not Installed",
    dot: "bg-[var(--text-muted)]",
    bg: "bg-[var(--surface-2)]",
    text: "text-[var(--text-muted)]",
  },
};

export function StatusBadge({ status, showDot = true }: StatusBadgeProps) {
  const c = config[status] ?? config.unknown;
  const pulse = status === "online" || status === "running";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${c.dot} ${pulse ? "animate-pulse" : ""}`}
        />
      )}
      {c.label}
    </span>
  );
}
