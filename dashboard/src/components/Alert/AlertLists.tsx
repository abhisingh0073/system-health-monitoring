"use client";

import { Alert } from "../../types/alert"

type Props = {
  alerts: Alert[];
};

export function AlertLists({ alerts }: Props) {
  if (alerts.length === 0) {
    return (
      <div className="border border-[var(--border)] rounded-lg p-6">
        <p className="text-sm text-[var(--text-secondary)]">
          No alerts
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="border border-[var(--border)] rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {alert.alert_type}
              </p>

              <p className="text-sm text-[var(--text-secondary)]">
                {alert.message}
              </p>
            </div>

            <span className="text-xs">
              {alert.severity}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}