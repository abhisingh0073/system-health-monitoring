"use client";

// import { useSocketData } from "@/providers/SocketProvider";
import { useSocketData } from "@/providers/SocketContext";

export function LiveServerMetrics() {
  const { metrics } = useSocketData();

  if (!metrics) {
    return (
      <div className="rounded-xl border border-[var(--border)] p-6">
        <p className="text-sm text-[var(--text-secondary)]">
          Waiting for live metrics...
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="rounded-xl border border-[var(--border)] p-5">
        <p className="text-sm text-[var(--text-secondary)]">
          CPU Usage
        </p>

        <p className="text-2xl font-semibold mt-2">
          {metrics.cpuUsage.toFixed(2)}%
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] p-5">
        <p className="text-sm text-[var(--text-secondary)]">
          Memory Usage
        </p>

        <p className="text-2xl font-semibold mt-2">
          {metrics.memoryUsage.toFixed(2)}%
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] p-5">
        <p className="text-sm text-[var(--text-secondary)]">
          Disk Usage
        </p>

        <p className="text-2xl font-semibold mt-2">
          {metrics.diskUsage.toFixed(2)}%
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] p-5">
        <p className="text-sm text-[var(--text-secondary)]">
          Uptime
        </p>

        <p className="text-2xl font-semibold mt-2">
          {Math.floor(metrics.uptimeSeconds / 3600)}h{" "}
          {Math.floor((metrics.uptimeSeconds % 3600) / 60)}m
        </p>
      </div>
    </div>
  );
}
