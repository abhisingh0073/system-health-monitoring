"use client";

import { useEffect, useState } from "react";

import { getSocket } from "@/lib/socket";
import { SOCKET_EVENTS } from "@/lib/socket-events";

import {
  SocketContext,
  type Metrics,
  type Services,
} from "./SocketContext";
import { ServerOfflineData } from "@/types/server";



export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
const [metricsByServer, setMetricsByServer] = useState<Record<string, Metrics>>({});
const [servicesByServer, setServicesByServer] = useState<Record<string, Services>>({});
const [offlineServers, setOfflineServers] = useState<Record<string, ServerOfflineData>>({});
const [metricsHistoryByServer, setMetricsHistoryByServer] = useState<Record<string, Metrics[]>>({});

  useEffect(() => {
    const socket = getSocket();

    socket.connect();

    const onConnect = () => {
      console.log("✅ Connected:", socket.id);
    };

    const onDisconnect = () => {
      console.log("❌ Disconnected");
    };

    // const onMetricsUpdated = (data: Metrics) => {
    //   console.log("📊 Metrics Updated", data);

    //   setMetricsByServer((prev) => ({ ...prev, [data.serverId]: data }));
    // };
    const onMetricsUpdated = (data: Metrics) => {
        console.log("📊 Metrics Updated", data);

        setMetricsByServer((prev) => ({
          ...prev,
          [data.serverId]: data,
        }));

/////// removing server from offlineServer if it is online and present in offlineServers
        setOfflineServers((prev) => {
          const updated = { ...prev };
          delete updated[data.serverId];
          return updated;
        });

///////Adding new metrics data to the metricsHistoryByServer state, keeping only the last 100 entries for each server
        setMetricsHistoryByServer((prev) => ({
          ...prev,
          [data.serverId]: [
            ...(prev[data.serverId] ?? []),
            data,
          ].slice(-100),
        }));

      };

    const onServicesUpdated = (data: Services) => {
      console.log("⚙️ Services Updated", data);

      setServicesByServer((prev) => ({ ...prev, [data.serverId]: data }));
    };

    const onServerOffline = (data: ServerOfflineData) => {
      console.log("⚠️ Server Offline", data);

      setOfflineServers((prev) => ({
        ...prev, [data.serverId]: data,
      }));
    }



    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on(
      SOCKET_EVENTS.METRICS_UPDATED,
      onMetricsUpdated
    );

    socket.on(
      SOCKET_EVENTS.SERVICES_UPDATED,
      onServicesUpdated
    );

    socket.on(
      SOCKET_EVENTS.SERVER_OFFLINE,
      onServerOffline
    );


    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);

      socket.off(
        SOCKET_EVENTS.METRICS_UPDATED,
        onMetricsUpdated
      );

      socket.off(
        SOCKET_EVENTS.SERVICES_UPDATED,
        onServicesUpdated
      );

      socket.off(
        SOCKET_EVENTS.SERVER_OFFLINE,
        onServerOffline
      );

      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ metricsByServer, servicesByServer, offlineServers, metricsHistoryByServer }}>
      {children}
    </SocketContext.Provider>
  );
}