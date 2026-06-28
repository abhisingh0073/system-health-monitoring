import Link from "next/link";
import { ArrowDownLeft, ArrowLeft, ArrowUpRight } from "lucide-react";
import { getServerById, getServerMetrics, getServerServices } from "@/services/server.service";
import { ServerCard } from "@/components/ServerCard";
import { MetricsCharts } from "@/components/MetricsCharts";
import { ServicesCard } from "@/components/ServicesCard";
import type { Metric } from "@/types";
import type { Server } from "@/types/server";
import type { Service } from "@/types/service";
import { notFound } from "next/navigation";
import { formatBytes, formatLastSeen, formatUptime } from "@/services/utils";



async function getData(
  id: string
): Promise<{ server: Server; metrics: Metric[]; services: Service[] } | null> {
  try {
    const [serverResponse, metricsResponse, servicesResponse] = await Promise.all([
      getServerById(id),
      getServerMetrics(id),
      getServerServices(id).catch(() => ({ data: [] as Service[] })), // graceful — services endpoint may not exist yet
    ]);

    console.log(servicesResponse);
    return {
      server: serverResponse.data,
      metrics: metricsResponse.data,
      services: servicesResponse.data,
    };
  } catch {
    return null;
  }
}

export default async function ServerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getData(id);

  if (!data) {
    notFound();
  }

  const { server, metrics, services } = data;
  const latestMetric = metrics[0] || null;

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
      <ServerCard server={server} latestMetric={latestMetric} />

      {/* Two-column: metrics snapshot | services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: current metric bars (already in ServerCard on mobile, shown here on desktop as a standalone snapshot) */}
        <ServicesCard services={services} />

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
          {metrics.length > 0 && (
            <span className="ml-2 text-[var(--text-muted)]">
              ({metrics.length} data point{metrics.length !== 1 ? "s" : ""})
            </span>
          )}
        </h2>
        <MetricsCharts metrics={metrics} />
      </div>
    </div>
  );
}