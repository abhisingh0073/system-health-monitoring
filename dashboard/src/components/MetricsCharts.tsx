"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { Metrics } from "@/types";

interface MetricsChartsProps {
  metrics: Metrics[];
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getColor(value: number): string {
  if (value >= 90) return "var(--red)";
  if (value >= 70) return "var(--yellow)";
  return "var(--green)";
}

interface ChartConfig {
  key: keyof Metrics;
  label: string;
  color: string;
}

const charts: ChartConfig[] = [
  { key: "cpu_usage", label: "CPU Usage", color: "var(--accent)" },
  { key: "memory_usage", label: "Memory Usage", color: "#d2a8ff" },
  { key: "disk_usage", label: "Disk Usage", color: "var(--yellow)" },
];

function SingleChart({
  data,
  dataKey,
  label,
  color,
}: {
  data: Array<{ time: string; value: number }>;
  dataKey: string;
  label: string;
  color: string;
}) {
  const latest = data[data.length - 1]?.value;
  const dynamicColor = latest != null ? getColor(latest) : color;


  return (
    <div
      className="rounded-lg p-4"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-[var(--text-secondary)]">{label}</p>
        {latest != null && (
          <span
            className="text-xl font-mono font-semibold"
            style={{ color: dynamicColor }}
          >
            {latest.toFixed(1)}%
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={data} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={dynamicColor} stopOpacity={0.2} />
              <stop offset="95%" stopColor={dynamicColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              color: "var(--text-primary)",
              fontSize: "12px",
            }}
            formatter={(value) => [`${Number(value).toFixed(1)}%`, label]}
            labelStyle={{ color: "var(--text-secondary)" }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={dynamicColor}
            strokeWidth={1.5}
            fill={`url(#grad-${dataKey})`}
            dot={false}
            activeDot={{ r: 3, fill: dynamicColor }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MetricsCharts({ metrics }: MetricsChartsProps) {

  if (!metrics || metrics.length === 0) {
    return (
      <div
        className="rounded-lg p-8 text-center"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <p className="text-sm text-[var(--text-secondary)]">No metrics data yet.</p>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Data appears once the agent reports metrics.
        </p>
      </div>
    );
  }

  



  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {charts.map(({ key, label, color }) => {
        const data = [...metrics]
          .map((m) => ({
            time: formatTime(m.created_at),
            value: Number(m[key]),
          }));

        return (
          <SingleChart
            key={key}
            data={data}
            dataKey={key}
            label={label}
            color={color}
          />
        );
      })}
    </div>
  );
}
