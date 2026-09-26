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
import type { AggregatedMetric, MetricsRange } from "@/types/metrics";
import { useEffect, useState } from "react";
import { getServerMetrics } from "@/services/metrics.client.service";
import { formateDateTime } from "@/services/utils";
import { timeStamp } from "console";

interface MetricsChartsProps {
  serverId: string;
  metrics: AggregatedMetric[];
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



type MetricKey = | "cpu_usage" | "memory_usage" | "disk_usage";

interface ChartConfig {
  key: MetricKey;
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
  data: Array<{ time: string; timeStamp: string; value: number }>;
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

            labelFormatter={(_, payload) => {
              const timestamp = payload?.[0]?.payload?.timestamp;
              if (!timestamp) return "";
              return formateDateTime(timestamp);
            }}

           
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







export function MetricsCharts({ serverId, metrics }: MetricsChartsProps) {

  const [range, setRange] = useState<MetricsRange>("24h");
  const [chartMetrics, setChartMetrics] = useState(metrics);
  const [loading, setLoading] = useState(false);


  const ranges: {
  value: MetricsRange;
  label: string;
}[] = [
   { value: "1h", label: "1h" },
   { value: "6h", label: "6h" },
   { value: "24h", label: "24h" },
   { value: "7d", label: "7d" },
   { value: "30d", label: "30d" },
];

useEffect(() => {

  if(range === "24h"){
    setChartMetrics(metrics);
    return;
  }

  async function loadMetrics(){
    try{
      setLoading(true);
  
      const response = await getServerMetrics(serverId, range);
  
      setChartMetrics(response.data);
    } catch(error){
      console.error("Failed to load metrics:", error);
  
    } finally{
      setLoading(false);
    }
  }

  loadMetrics();
}, [range, serverId, metrics])



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

    <div className="mt-9">
      <div className="flex justify-between px-2 py-1.5">
        <h1 
          className="text-[var(--text-secondary)] font-medium text-sm uppercase"
          >Metrics History</h1>
        <div className="flex gap-2"> 
          {ranges.map((item) => (
            <button
              key={item.value}
              onClick={() => setRange(item.value)}
              className={`px-3 py-1.5 cursor-pointer text-sm rounded-md font-medium transition-colors 
                ${range === item.value ? "bg-[var(--border)] text-white" 
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)]"}
                `}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {charts.map(({ key, label, color }) => {
          const data = [...chartMetrics]
            .map((m) => ({
              time: formatTime(m.timestamp),
              timestamp: m.timestamp,
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
    </div>
  );
}

