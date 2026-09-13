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
import { getAlertsClient } from "@/services/alert.client.service";
import { Alert } from "@/types/alert";
import AlertToast from "@/components/Alert/AlertToast";



export default function SocketProvider({
  children,
   initialAlerts = [],
  }: {
    children: React.ReactNode;
    initialAlerts?: Alert[];

  }) {

const [metricsByServer, setMetricsByServer] = useState<Record<string, Metrics>>({});
const [servicesByServer, setServicesByServer] = useState<Record<string, Services>>({});
const [offlineServers, setOfflineServers] = useState<Record<string, ServerOfflineData>>({});
const [metricsHistoryByServer, setMetricsHistoryByServer] = useState<Record<string, Metrics[]>>({});
const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
const [toastAlerts, setToastAlerts] = useState<Alert[]>([]);


//// helps to remove alertToast after 5 second
    const removeToast = (alertId: number) => {
      setToastAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
    }


  useEffect(() => {

    async function loadInitialAlerts(){
      try{
        const response = await getAlertsClient();
        setAlerts(response.data);

      } catch (error) {
        console.error("Error loading initial alerts:", error);
      }
    }

    loadInitialAlerts();

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


/// Alert Created and Alert Resolved event handlers to update
    const onAlertCreated = (data: Alert) => {
      console.log("🚨 Alert Created", data);

      setAlerts((prev) => {
        if(prev.some((alert) => alert.id === data.id)){
          return prev;
        }

        return [data, ...prev];
      })

      // set current Alert in notification
      setToastAlerts((prev) => {
        if(prev.some((alert) => alert.id === data.id)){
          return prev;
        }

        return [data, ...prev]
      });

      setTimeout(() => {
        removeToast(data.id);
      }, 10000);
    }

// //// helps to remove alertToast after 5 second
//     const removeToast = (alertId: number) => {
//       setToastAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
//     }


    const onAlertResolved = (data: Alert) => {
      console.log("✅ Alert Resolved", data);

      setAlerts((prev) => 
        prev.map((alert) => alert.id === data.id ? data : alert));
    }



    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on( SOCKET_EVENTS.METRICS_UPDATED,  onMetricsUpdated);

    socket.on( SOCKET_EVENTS.SERVICES_UPDATED,  onServicesUpdated);

    socket.on( SOCKET_EVENTS.SERVER_OFFLINE,  onServerOffline);

    socket.on( SOCKET_EVENTS.ALERT_CREATED,  onAlertCreated);

    socket.on( SOCKET_EVENTS.ALERT_RESOLVED,  onAlertResolved);

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

      socket.off(
        SOCKET_EVENTS.ALERT_CREATED,
        onAlertCreated
      );

      socket.off(
        SOCKET_EVENTS.ALERT_RESOLVED,
        onAlertResolved
      );

      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ metricsByServer, servicesByServer, offlineServers, metricsHistoryByServer, alerts }}>
      <>
         {children}
   
         <div>
           {toastAlerts.map((alert) => (
             <AlertToast
             key={alert.id}
             alert={alert}
             onClose={() => removeToast(alert.id)}
             />
           ))}
           </div>
      </>
    </SocketContext.Provider>
  );
}