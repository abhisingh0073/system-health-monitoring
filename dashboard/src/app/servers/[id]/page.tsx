// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";
// import { getServerById, getServerMetrics} from "@/services/server.service";
// import { ServerCard } from "@/components/ServerCard";
// import { MetricsCharts } from "@/components/MetricsCharts";
// import type { Server } from "@/types/server";
// import type { Metric } from "@/types";
// import { notFound } from "next/navigation";

// async function getData(id: string): Promise<{ server: Server; metrics: Metric[] } | null> {
//   try {
//     const [serverResponse, metricsResponse] = await Promise.all([
//       getServerById(id),
//       getServerMetrics(id),
//     ]);
//     const server = "data" in serverResponse ? serverResponse.data : serverResponse;
//     const metrics = "data" in metricsResponse ? metricsResponse.data : metricsResponse;
//     return { server, metrics };
//   } catch(error) {
//     throw error;
//   }
// }

// export default async function ServerDetailPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;
//   const data = await getData(id);

//   if (!data) {
//     notFound();
//   }

//   const { server, metrics } = data;
//   const latestMetric = metrics[0];

//   return (
//     <div className="space-y-6">
//       {/* Back link */}
//       <Link
//         href="/servers"
//         className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
//       >
//         <ArrowLeft size={12} />
//         Back to Servers
//       </Link>

//       {/* Hero card */}
//       <ServerCard server={server} latestMetric={latestMetric} />

//       {/* Charts section */}
//       <div>
//         <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-3">
//           Metric History
//           {metrics.length > 0 && (
//             <span className="ml-2 text-[var(--text-muted)]">
//               ({metrics.length} data point{metrics.length !== 1 ? "s" : ""})
//             </span>
//           )}
//         </h2>
//         <MetricsCharts metrics={metrics} />
//       </div>
//     </div>
//   );
// }










import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { getServerById, getServerMetrics } from "@/services/server.service";

import { ServerCard } from "@/components/ServerCard";
import { MetricsCharts } from "@/components/MetricsCharts";

import type { Server } from "@/types/server";
import type { Metric } from "@/types";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getData(
  id: string
): Promise<{
  server: Server;
  metrics: Metric[];
}> {
  const [serverResponse, metricsResponse] = await Promise.all([
    getServerById(id),
    getServerMetrics(id),
  ]);

  return {
    server: serverResponse.data,
    metrics: metricsResponse.data,
  };
}

export default async function ServerDetailPage({
  params,
}: PageProps) {
  const { id } = await params;

  let data;

  try {
    data = await getData(id);
  } catch (error) {
    console.error("Failed to load server:", error);
    notFound();
  }

  const { server, metrics } = data;

  // SQL returns ORDER BY created_at DESC
  // First item is the newest metric
  const latestMetric = metrics[0] ?? null;

  return (
    <div className="space-y-6">
      <Link
        href="/servers"
        className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Servers
      </Link>

      <ServerCard
        server={server}
        latestMetric={latestMetric}
      />

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Metric History
          </h2>

          <span className="text-sm text-[var(--text-muted)]">
            {metrics.length} Records
          </span>
        </div>

        {metrics.length > 0 ? (
          <MetricsCharts metrics={metrics} />
        ) : (
          <div
            className="rounded-lg border border-[var(--border)] p-8 text-center text-[var(--text-muted)]"
          >
            No metrics available for this server.
          </div>
        )}
      </section>
    </div>
  );
}