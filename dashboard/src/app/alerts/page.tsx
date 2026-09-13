"use client";

import { useSocketData } from "@/providers/SocketContext";
import { Alert } from "@/types/alert";
import { useState } from "react";

export default function AlertsPage() {
  const { alerts } = useSocketData();

  const activeAlerts = alerts.filter(
    (alert) => alert.status === "active"
  );

  const resolvedAlerts = alerts.filter(
    (alert) => alert.status === "resolved"
  );

  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all");


  const filteredAlerts = alerts.filter((alert) => {
    if(filter === "active"){
        return alert.status === "active";
    }

    if(filter === "resolved"){
        return alert.status === "resolved";
    }

    return true;
  });


 function getSeverityClass(severity: string) {
  switch (severity.toLowerCase()) {
    case "critical":
      return "text-[var(--red)]";

    case "warning":
      return "text-[var(--yellow)]";

    case "info":
      return "text-[var(--blue)]";

    default:
      return "text-[var(--text-secondary)]";
  }
}


  function getStatusClass(status: Alert["status"]) {
  return status === "active"
    ? "text-[var(--red)]"
    : "text-[var(--green)]";
}



  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          Alerts
        </h1>

        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Monitor and review server alerts
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="border border-[var(--border)] rounded-lg p-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Total Alerts
          </p>

          <p className="text-2xl font-semibold mt-2">
            {alerts.length}
          </p>
        </div>

        <div className="border border-[var(--border)] rounded-lg p-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Active
          </p>

          <p className="text-2xl font-semibold mt-2">
            {activeAlerts.length}
          </p>
        </div>

        <div className="border border-[var(--border)] rounded-lg p-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Resolved
          </p>

          <p className="text-2xl font-semibold mt-2">
            {resolvedAlerts.length}
          </p>
        </div>

      </div>



      {/* Alert filter */}
      <div className="flex gap-2">
        <button
         onClick={() => setFilter("all")}
         className={`px-3 cursor-pointer py-1.5 rounded-md text-sm hover:text-[var(--text-border)] ${
            filter === "all" ? "bg-[var(--border)]" : "text-[var(--text-secondary)]"
         }`}>
            All ({alerts.length})
        </button>


        <button
         onClick={() => setFilter("active")}
         className={`px-3 py-1.5 cursor-pointer rounded-md text-sm hover:text-[var(--text-border)] ${
            filter === "active" ? "bg-[var(--border)]" : "text-[var(--text-secondary)]"
         }`}>
            Active ({activeAlerts.length})
        </button>


        <button
         onClick={() => setFilter("resolved")}
         className={`px-3 py-1.5 cursor-pointer rounded-md text-sm hover:text-[var(--text-border)] ${
            filter === "resolved" ? "bg-[var(--border)]" : "text-[var(--text-secondary)]"
         }`}>
            Resolved ({resolvedAlerts.length})
        </button>
      </div>



      {/* Alerts */}
      <div>
        <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-3">
          Alert History
        </h2>

        <div className="border border-[var(--border)] rounded-lg">
          {filteredAlerts.length === 0 ? (
            <div className="p-6 text-sm text-white">
               No {filter === "all" ? "" : filter} alerts found.
            </div>
          ) : (
            <div>
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 border-b border-[var(--border)] last:border-b-0"
                >
                  <div className="flex items-center justify-between">

                    <div>
                      <p className="font-medium">
                        {alert.alert_type}
                      </p>

                    </div>
                    <div className="flex gap-2 text-right">
                      <p className={`text-xs font-medium ${getSeverityClass(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </p>
  
                      <p className={`text-xs font-medium ${getStatusClass(
                        alert.status
                          )}`}>
  
                          {alert.status.toUpperCase()}
                      </p>
                    </div>

                  </div>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">
                        {alert.message}
                      </p>

                      <p className="text-xs text-[var(--text-secondary)] mt-2">
                        Server: {alert.hostname}
                      </p>

                      <p className="text-xs text-[var(--text-secondary)] mt-2">
                      Triggered:{" "}
                      {new Date(alert.triggered_at).toLocaleString()}
                    </p>
                    
                    {alert.resolved_at && (
                      <p className="text-xs text-[var(--text-secondary)]">
                        Resolved:{" "}
                        {new Date(alert.resolved_at).toLocaleString()}
                      </p>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}