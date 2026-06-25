import type { Server } from "@/types/server";
import type {  Metric } from "@/types";
import { StatusBadge } from "@/components/StatusBadge";
import { MetricBar } from "@/components/MetricBar";
// import { serverService } from "@/services/server.service";
import { Monitor, Clock, Globe, Cpu } from "lucide-react";
import { formatLastSeen, formatUptime } from "@/services/utils";

interface ServerCardProps {
  server: Server;
  latestMetric?: Metric;
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Monitor; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={14} className="text-[var(--text-muted)] shrink-0" />
      <span className="text-xs text-[var(--text-secondary)] w-20 shrink-0">{label}</span>
      <span className="text-xs font-mono text-[var(--text-primary)]">{value}</span>
    </div>
  );
}

export function ServerCard({ server, latestMetric }: ServerCardProps) {
  return (
    <div
      className="rounded-lg p-6"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-mono font-semibold text-[var(--text-primary)]">
            {server.hostname}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">{server.os_name}</p>
        </div>
        <StatusBadge status={server.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Server info */}
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] mb-3">
            Server Info
          </p>
          <InfoRow icon={Globe} label="IP Address" value={server.ip_address} />
          <InfoRow icon={Monitor} label="OS" value={server.os_name} />
          <InfoRow
            icon={Clock}
            label="Last Seen"
            value={formatLastSeen(server.last_seen)}
          />
          {latestMetric && (
            <InfoRow
              icon={Cpu}
              label="Uptime"
              value={formatUptime(latestMetric.uptime_seconds)}
            />
          )}
        </div>

        {/* Latest metrics */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] mb-3">
            Current Metrics
          </p>
          <div className="space-y-3">
            <MetricBar label="CPU" value={latestMetric?.cpu_usage} />
            <MetricBar label="Memory" value={latestMetric?.memory_usage} />
            <MetricBar label="Disk" value={latestMetric?.disk_usage} />
          </div>
        </div>
      </div>
    </div>
  );
}
