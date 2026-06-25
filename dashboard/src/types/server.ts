export type ServerStatus = "online" | "offline" | "unknown";


export interface Server {
  id: string;
  hostname: string;
  ip_address: string;
  os_name: string;
  status: ServerStatus;
  cpu_usage: number | null;
  memory_usage: number | null;
  disk_usage: number | null;
  last_seen: string;
  created_at: string;
}

export interface ServerWithLatestMetric extends Server {
  cpu?: number;
  memory?: number;
  disk?: number;
}

export interface DashboardServer {
  id: string;
  hostname: string;
  ip_address: string;
  status: ServerStatus;
  cpu_usage: number | null;
  memory_usage: number | null;
  disk_usage: number | null;
  last_seen: string;
}