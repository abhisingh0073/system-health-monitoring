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
};

export const SocketContext = createContext<SocketContextType>({
  metricsByServer: {},
  servicesByServer: {},
  offlineServers: {},
  metricsHistoryByServer: {},
});

export function useSocketData() {
  return useContext(SocketContext);
}