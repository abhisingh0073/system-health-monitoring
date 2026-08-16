import Link from "next/link";
import { ArrowLeft} from "lucide-react";
import { getServerById, getServerMetrics, getServerServices } from "@/services/server.service";
import type { Metrics } from "@/types";
import type { Server } from "@/types/server";
import type { Service } from "@/types/service";
import { notFound } from "next/navigation";
import LiveServerDetail from "@/components/LiveServerDetail";



async function getData(
  id: string
): Promise<{ server: Server; metrics: Metrics[]; services: Service[] } | null> {
  try {
    const [serverResponse, metricsResponse, servicesResponse] = await Promise.all([
      getServerById(id),
      getServerMetrics(id),
      getServerServices(id).catch(() => ({ data: [] as Service[] })), // graceful — services endpoint may not exist yet
    ]);

    return {
      server: serverResponse.data,
      metrics: metricsResponse.data,
      services: servicesResponse.data,
    };
  } catch(error) {
    console.error("Failed to load server:", error);
    return null;
  }
}

export default async function ServerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getData(id);

  if (!data) {
    notFound();
  }

  const { server, metrics, services } = data;
  // const latestMetric = metrics[0] || null;

  return (
    <div className="space-y-6">
      {/* Back link */}

      <Link
        href="/servers"
        className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        <ArrowLeft size={12} />
        Back to Servers
      </Link>

      <LiveServerDetail
        server={server}
        metrics={metrics}
        services={services}
      />
    </div>
  );
}