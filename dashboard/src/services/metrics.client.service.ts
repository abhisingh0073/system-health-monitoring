import { api } from "@/lib/api";
import { AggregatedMetricsResponse, MetricsRange } from "@/types/metrics";




export async function getServerMetrics( serverId: string, range: MetricsRange
): Promise<AggregatedMetricsResponse> {
  return api.get<AggregatedMetricsResponse>(
    `/servers/${serverId}/metrics?range=${range}`
  );
}