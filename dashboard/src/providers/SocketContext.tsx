"use client";

import { ServerOfflineData } from "@/types/server";
import { ServiceStatus } from "@/types/service";
import { createContext, useContext } from "react";

export type Metrics = {
  serverId: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  uptimeSeconds: number;
  networkIn: number;
  networkOut: number;
  created_at: string;
};

// export type Services = {
//   serverId: string;
//   services: {
//     serviceName: string;
//     status: string;
//   }[];
// };

export type LiveService = {
  service: string;
  status: ServiceStatus;
};

export type Services = {
  serverId: string;
  services: LiveService[];
};


export type SocketContextType = {
  metricsByServer: Record<string, Metrics>;
  servicesByServer: Record<string, Services>;
  offlineServers: Record<string, ServerOfflineData>;
  metricsHistoryByServer: Record<string, Metrics[]>;
  alerts: Alert[];
};

export const SocketContext = createContext<SocketContextType>({
  metricsByServer: {},
  servicesByServer: {},
  offlineServers: {},
  metricsHistoryByServer: {},
  alerts: [],
});

export function useSocketData() {
  return useContext(SocketContext);
}

export type Alert = {
  id: number;
  server_id: string;
  alert_type: string;
  severity: string;
  message: string;
  status: "active" | "resolved";
  triggered_at: string;
  resolved_at: string | null;
};