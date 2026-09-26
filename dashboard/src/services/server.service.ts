
import type { ApiResponse, PaginatedResponse,} from "@/types/api";

import { serverApi } from "@/lib/server-api";
import { AggregatedMetricsResponse, Metrics, MetricsRange } from "@/types/metrics";
import { Service } from "@/types/service";
import { Server } from "@/types/server";

export async function getAllServers() {
  return serverApi<PaginatedResponse<Server[]>>("/servers");
}

export async function getServerById(id: string) {
  return serverApi<ApiResponse<Server>>(`/servers/${id}`);
}

// export async function getServerMetrics(id: string) {
//   return serverApi<ApiResponse<Metrics[]>>(
//     `/servers/${id}/metrics?range=1h`
//   );
// }

export async function getServerMetrics( serverId: string, range: MetricsRange = "24h"
): Promise<AggregatedMetricsResponse> {
  return serverApi<AggregatedMetricsResponse>(
    `/servers/${serverId}/metrics?range=${range}`
  );
}

export async function getServerServices(id: string) {
  return serverApi<ApiResponse<Service[]>>(
    `/servers/${id}/services`
  );
}