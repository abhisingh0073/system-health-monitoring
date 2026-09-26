export type MetricsRange = "1h" | "6h" | "24h" | "7d" | "30d";


export interface Metrics {
  id: string;
  server_id: string;
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  uptime_seconds: number;
  created_at: string;
  network_in: number;
  network_out: number;
}

export interface LatestMetric {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  uptime_seconds?: number;
  network_in: number;
  network_out: number;
  created_at: string;
}

export type AggregatedMetric = {
  timestamp: string;
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_in: number;
  network_out: number;
};

export type AggregatedMetricsResponse = {
  success: boolean;
  range: MetricsRange;
  count: number;
  data: AggregatedMetric[];
};



