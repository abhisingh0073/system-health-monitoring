import type { ServerStatus } from "@/types/server";

interface StatusBadgeProps {
  status: ServerStatus;
  showDot?: boolean;
}

const config: Record<ServerStatus, { label: string; dot: string; bg: string; text: string }> = {
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
};

export function StatusBadge({ status, showDot = true }: StatusBadgeProps) {
  const c = config[status] ?? config.unknown;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${c.dot} ${
            status === "online" ? "animate-pulse" : ""
          }`}
        />
      )}
      {c.label}
    </span>
  );
}
