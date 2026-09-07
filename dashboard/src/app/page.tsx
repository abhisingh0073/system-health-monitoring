// import { serverService } from "@/services/server.service";
import { cookies } from "next/headers";
import { StatCard } from "@/components/StatCard";
import { ServerTable } from "@/components/ServerTable";
import type { Server } from "@/types/server";
import { getAllServers } from "@/services/server.service";
// import { LiveServerMetrics } from "@/components/LiveServerMetrics";
import { LiveOverview } from "@/components/LiveOverview";
import { Alert, getAlerts } from "@/services/alert.service";



async function getServers(): Promise<Server[]> {
  try {
    const response = await getAllServers();
    return response.data;
  
  } catch (error) {
    console.error("Failed to get servers:", error);
    return [];
  }
}

async function getDashboardAlerts(): Promise<Alert[]> {
  try{
    const response = await getAlerts();
    return response.data;

  } catch(error){
    console.error("failed to fetch alerts:", error);
    return [];
  }
}

export default async function OverviewPage() {
  // const servers = await getServers();
  // const alerts = await getDashboardAlerts();

  const [servers, alerts] = await Promise.all([
    getServers(),
    getDashboardAlerts(),
  ])
  // const online = servers.filter((s) => s.status === "online").length;
  // const offline = servers.filter((s) => s.status === "offline").length;
  // const unknown = servers.filter((s) => s.status === "unknown").length;

  return (
    <div className="space-y-8">

      <div>
        <h2>
          Live Metrics
        </h2>

        {/* <LiveServerMetrics/> */}
        <LiveOverview servers={servers} initialAlerts={alerts} />
      </div>
    </div>
  );
}
