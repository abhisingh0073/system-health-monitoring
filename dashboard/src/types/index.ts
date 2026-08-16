
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

