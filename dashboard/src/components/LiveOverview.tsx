"use client";

import { useEffect, useState } from "react";
import type { Server, ServerStatus } from "@/types/server";
import { StatCard } from "@/components/StatCard";
import { ServerTable } from "@/components/ServerTable";
import { useSocketData } from "@/providers/SocketContext";

type Props = {
  servers: Server[];
};

export function LiveOverview({ servers: initialServers }: Props) {
  const [servers, setServers] = useState<Server[]>(initialServers);

  const { metricsByServer, offlineServers } = useSocketData();

  useEffect(() => {setServers(initialServers);
  }, [initialServers]);

  /*
   * Merge live metrics from Socket.IO
   * into the server objects.
   */

  const liveServers: Server[] = servers.map((server): Server => {
  const metrics = metricsByServer[server.id];

  if (offlineServers[server.id]) {
    return {
      ...server,
      status: "offline" as ServerStatus,
      last_seen: offlineServers[server.id].lastSeen,
    };
  }

  if (!metrics) {
    return server;
  }

  return {
    ...server,
    cpu_usage: metrics.cpuUsage,
    memory_usage: metrics.memoryUsage,
    disk_usage: metrics.diskUsage,
    last_seen: metrics.created_at,
    status: "online" as ServerStatus,
  };
});


  const online = liveServers.filter(
    (server) => server.status === "online"
  ).length;

  const offline = liveServers.filter(
    (server) => server.status === "offline"
  ).length;

  const unknown = liveServers.filter(
    (server) => server.status === "unknown"
  ).length;

  return (
    <>
      {/* Stats */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Servers"
          value={liveServers.length}
        />

        <StatCard
          label="Online"
          value={online}
          sub={
            liveServers.length
              ? `${Math.round(
                  (online / liveServers.length) * 100
                )}% healthy`
              : undefined
          }
          accent="var(--green)"
        />

        <StatCard
          label="Offline"
          value={offline}
          accent={
            offline > 0
              ? "var(--red)"
              : undefined
          }
        />

        <StatCard
          label="Unknown"
          value={unknown}
          accent={
            unknown > 0
              ? "var(--yellow)"
              : undefined
          }
        />
      </div>

      {/* Server Table */}

      <div>
        <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-3">
          All Servers
        </h2>

        <ServerTable servers={liveServers} />
      </div>
    </>
  );
}