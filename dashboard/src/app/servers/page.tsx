import { getAllServers } from "@/services/server.service";
import { ServerTable } from "@/components/ServerTable";
import type { Server } from "@/types/server";

async function getServers(): Promise<Server[]> {
  try {
    const response = await getAllServers();
    return response.data
  } catch {
    return [];
  }
}

export default async function ServersPage() {
  const servers = await getServers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Servers</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {servers.length} registered server{servers.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <ServerTable servers={servers} />
    </div>
  );
}
