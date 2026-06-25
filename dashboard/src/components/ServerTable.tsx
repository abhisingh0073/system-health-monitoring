import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Server } from "@/types/server";
import { StatusBadge } from "@/components/StatusBadge";
import { formatLastSeen } from "@/services/utils";
import { MetricBadge } from "./MetricBadge";
// import { serverService } from "@/services/server.service";

interface ServerTableProps {
  servers: readonly Server[];
}

export function ServerTable({ servers }: ServerTableProps) {
  if (servers.length === 0) {
    return (
      <div
        className="rounded-lg text-center py-16"
        style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
      >
        <p className="text-[var(--text-secondary)] text-sm">No servers registered yet.</p>
        <p className="text-[var(--text-muted)] text-xs mt-1">
          Start the agent on a machine to see it appear here.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
    >
      {/* Table header */}
      <div
        className="grid text-xs font-medium uppercase tracking-wider px-4 py-3"
        style={{
          gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr 1.5fr 40px",
          borderBottom: "1px solid var(--border)",
          color: "var(--text-muted)",
          background: "var(--surface-2)",
        }}
      >
        <span>Hostname</span>
        <span>IP Address</span>
        <span>Status</span>
        <span>CPU</span>
        <span>Memory</span>
        <span>Disk</span>
        <span>Last Seen</span>
        {/* <span /> */}
      </div>

      {/* Rows */}
      <div className="divide-y" style={{ borderColor: "var(--border)" }}>
        {servers.map((server) => (
          <Link
            key={server.id}
            href={`/servers/${server.id}`}
            className="grid items-center px-4 py-3 transition-colors hover:bg-[var(--surface-2)] group"
            style={{ gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr 1.5fr 40px" }}
          >
            <span className="font-mono text-sm text-[var(--text-primary)] font-medium">
              {server.hostname}
            </span>
            <span className="font-mono text-sm text-[var(--text-secondary)]">
              {server.ip_address}
            </span>
            <span>
              <StatusBadge status={server.status} />
            </span>
            <span><MetricBadge value={server.cpu_usage ?? 0}/></span>
            
            <span><MetricBadge value={server.memory_usage ?? 0}/></span>
            
            <span><MetricBadge value={server.disk_usage ?? 0}/></span>
            <span className="text-sm text-[var(--text-secondary)]">
              {formatLastSeen(server.last_seen)}
            </span>
            <span className="flex justify-end">
              <ChevronRight
                size={14}
                className="text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors"
              />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
