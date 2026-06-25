// import { serverService } from "@/services/server.service";
import { StatCard } from "@/components/StatCard";
import { ServerTable } from "@/components/ServerTable";
import type { Server } from "@/types/server";
import { getAllServers } from "@/services/server.service";

async function getServers(): Promise<Server[]> {
  try {
    const response = await getAllServers();
    return response.data;
  } catch {
    return [];
  }
}

export default async function OverviewPage() {
  const servers = await getServers();

  const online = servers.filter((s) => s.status === "online").length;
  const offline = servers.filter((s) => s.status === "offline").length;
  const unknown = servers.filter((s) => s.status === "unknown").length;

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Overview</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          {servers.length === 0
            ? "No agents reporting yet."
            : `Monitoring ${servers.length} server${servers.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Servers" value={servers.length} />
        <StatCard
          label="Online"
          value={online}
          sub={servers.length ? `${Math.round((online / servers.length) * 100)}% healthy` : undefined}
          accent="var(--green)"
        />
        <StatCard label="Offline" value={offline} accent={offline > 0 ? "var(--red)" : undefined} />
        <StatCard label="Unknown" value={unknown} accent={unknown > 0 ? "var(--yellow)" : undefined} />
      </div>

      {/* Server table */}
      <div>
        <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-3">All Servers</h2>
        <ServerTable servers={servers} />
      </div>
    </div>
  );
}
