// export type ServerStatus = "online" | "offline" | "unknown";

// export interface Server {
//   id: string;
//   hostname: string;
//   ip_address: string;
//   os: string;
//   status: ServerStatus;
//   last_seen: string;
//   created_at: string;
// }

export interface Metric {
  id: string;
  server_id: string;
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  uptime_seconds: number;
  created_at: string;
}

// export interface ServerWithLatestMetric extends Server {
//   cpu?: number;
//   memory?: number;
//   disk?: number;
// }

// export interface DashboardServer {
//   id: string;
//   hostname: string;
//   ip_address: string;
//   status: ServerStatus;
//   cpu: number | null;
//   memory: number | null;
//   disk: number | null;
//   last_seen: string;
// }
