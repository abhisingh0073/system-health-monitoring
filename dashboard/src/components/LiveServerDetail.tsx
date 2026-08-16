"use client";

import Link from "next/link";
import { ArrowDownLeft, ArrowLeft, ArrowUpRight } from "lucide-react";
import { ServerCard } from "@/components/ServerCard";
import { MetricsCharts } from "@/components/MetricsCharts";
import { ServicesCard } from "@/components/ServicesCard";
import type { Metrics } from "@/types";
import type { Server } from "@/types/server";
import type { Service } from "@/types/service";
import { formatBytes, formatLastSeen, formatUptime } from "@/services/utils";
import { useSocketData } from "@/providers/SocketContext";
import { useMemo } from "react";


interface LiveServerDetailProps {
  server: Server;
  metrics: Metrics[];
  services: Service[];
}

export default function LiveServerDetail({
  server,
  metrics,
  services,
}: LiveServerDetailProps) {

 const {metricsByServer, servicesByServer, offlineServers, metricsHistoryByServer} = useSocketData();

 const liveMetrics = metricsByServer[server.id];
 const liveServices = servicesByServer[server.id];
 const isOffline = Boolean(offlineServers[server.id]);
//  const liveHistory = metricsHistoryByServer[server.id] ?? [];
const liveHistory: Metrics[] = (
  metricsHistoryByServer[server.id] ?? []
).map((m) => ({
  id: String((m as any).id ?? 0),
  server_id: server.id,
  cpu_usage: m.cpuUsage,
  memory_usage: m.memoryUsage,
  disk_usage: m.diskUsage,
  uptime_seconds: m.uptimeSeconds,
  network_in: m.networkIn,
  network_out: m.networkOut,
  created_at: m.created_at,
}));

const currentServices: Service[] = liveServices
  ? liveServices.services.map((item, index) => ({
      id: index,
      server_id: server.id,
      service_name: item.service,
      status: item.status,
      last_checked: new Date().toISOString(),
    }))
  : services;

 const liveServer = useMemo(() => {
    return {
      ...server,

      status: isOffline
        ? "offline"
        : liveMetrics
          ? "online"
          : server.status,

      ...(liveMetrics && {
        last_seen: liveMetrics.created_at,
      }),
    };
  }, [
    server,
    liveMetrics,
    isOffline,
  ]);

  /*
   * Use live metric if available.
   * Otherwise use the latest metric from the initial API request.
   */
  const latestMetric = useMemo(() => {
    if (liveMetrics) {
      return {
        cpu_usage: liveMetrics.cpuUsage,
        memory_usage: liveMetrics.memoryUsage,
        disk_usage: liveMetrics.diskUsage,
        uptime_seconds: liveMetrics.uptimeSeconds,
        network_in: liveMetrics.networkIn,
        network_out: liveMetrics.networkOut,
        created_at: liveMetrics.created_at,
      };
    }

    return metrics[0] || null;
  }, [
    liveMetrics,
    metrics,
  ]);



// const combinedMetrics = useMemo(() => {
//   const all = [...metrics, ...liveHistory];

//   const unique = new Map(
//     all.map((metric) => [
//       metric.created_at,
//       metric,
//     ])
//   );

//   return Array.from(unique.values())
//     .sort(
//       (a, b) =>
//         new Date(a.created_at).getTime() -
//         new Date(b.created_at).getTime()
//     )
//     .slice(-100);
// }, [metrics, liveHistory]);

  const combinedMetrics = useMemo(() => {
  const all = [...metrics, ...liveHistory];

  const unique = new Map(
    all.map((metric) => [
      metric.created_at,
      metric,
    ])
  );

  return Array.from(unique.values()).sort(
    (a, b) =>
      new Date(a.created_at).getTime() -
      new Date(b.created_at).getTime()
  );
}, [metrics, liveHistory]);




  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/servers"
        className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        <ArrowLeft size={12} />
        Back to Servers
      </Link>

      {/* Hero: server info + current metrics */}
      <ServerCard server={liveServer} latestMetric={latestMetric} />

      {/* Two-column: metrics snapshot | services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: current metric bars (already in ServerCard on mobile, shown here on desktop as a standalone snapshot) */}
        <ServicesCard services={currentServices} />

        {/* Right: services */}
        <div
          className="rounded-lg p-4 flex items-start"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="w-full">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] mb-3">
              Last Metric Snapshot
            </p>
            {latestMetric ? (
              <div className="space-y-1 text-sm font-mono">
                {[
                  ["CPU", latestMetric.cpu_usage],
                  ["Memory", latestMetric.memory_usage],
                  ["Disk", latestMetric.disk_usage],
                  ["Uptime", formatUptime(latestMetric.uptime_seconds)],
                //   ["NetworkIn", formatBytes(latestMetric.network_in)],
                //   ["NetworkOut", formatBytes(latestMetric.network_out)]
                ].map(([label, value]) => (
                  <div key={label as string} className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{label}</span>
                    <span className="text-[var(--text-primary)]">
                      {typeof value === "number" ? `${value.toFixed(1)}%` : value}
                    </span>
                  </div>
                ))}

                <div className="  text-sm font-medium mt-4">
                <p className="font-medium tracking-wider text-[var(--text-muted)] mb-3">Network</p>
                  {/* Network Inthroughput with arrow indicator badge */}
                  <div className="flex justify-between  items-center">
                    <span className="text-zinc-400 dark:text-zinc-500">Network Traffic In</span>
                    <div className="flex items-center gap-1.5 font-mono font-semibold text-blue-600 dark:text-blue-400">
                      <ArrowDownLeft className="h-3.5 w-3.5" />
                      <span>{formatBytes(latestMetric.network_in)}</span>
                    </div>
                  </div>
                <div className="flex justify-between py-2.5 items-center">
                    <span className="text-zinc-400 dark:text-zinc-500">Network Traffic Out</span>
                    <div className="flex items-center gap-1.5 font-mono font-semibold text-amber-600 dark:text-amber-400">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      <span>{formatBytes(latestMetric.network_out)}</span>
                    </div>
                  </div>
            </div>
                <p className="text-xs text-[var(--text-muted)] pt-2">
                  Recorded {formatLastSeen(latestMetric.created_at)}
                </p>
              </div>
            ) : (
              <p className="text-xs text-[var(--text-muted)]">No metrics yet.</p>
            )}

          </div>
        </div>
      </div>

      {/* Historical charts */}
      <div>
        <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-3">
          Metric History
          {combinedMetrics.length > 0 && (
            <span className="ml-2 text-[var(--text-muted)]">
              ({combinedMetrics.length} data point{combinedMetrics.length !== 1 ? "s" : ""})
            </span>
          )}
        </h2>
        {/* <MetricsCharts metrics={metrics} /> */}
        <MetricsCharts metrics={combinedMetrics} />
      </div>

    </div>
  );
}