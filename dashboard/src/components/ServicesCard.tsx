import type { Service, ServiceStatus } from "@/types/service";
import { StatusBadge } from "@/components/StatusBadge";
import { formatLastSeen } from "@/services/utils";

interface ServicesCardProps {
  services: Service[];
}

function statusOrder(s: ServiceStatus): number {
  return s === "running" ? 0 : s === "stopped" ? 1 : 2;
}

export function ServicesCard({ services }: ServicesCardProps) {
  if (services.length === 0) {
    return (
      <div
        className="rounded-lg p-6 text-center"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <p className="text-sm text-[var(--text-secondary)]">No services tracked.</p>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          The agent will report services on next check-in.
        </p>
      </div>
    );
  }

  const sorted = [...services].sort(
    (a, b) => statusOrder(a.status) - statusOrder(b.status)
  );

  console.log("services: ",services);

  const running = services.filter((s) => s.status === "running").length;
  const stopped = services.filter((s) => s.status === "stopped").length;

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}
      >
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
          Services
        </p>
        <div className="flex items-center gap-3">
          {running > 0 && (
            <span className="text-xs text-[var(--green)]">{running} running</span>
          )}
          {stopped > 0 && (
            <span className="text-xs text-[var(--red)]">{stopped} stopped</span>
          )}
        </div>
      </div>

      {/* Service rows */}
      <div className="space-y-0.5" style={{ borderColor: "var(--border)" }}>
        {sorted.map((service) => (
          <div key={service.id} className="flex items-center justify-between px-4 py-2.5 rounded-md hover:bg-[var(--surface-2)]">
            <span className="font-mono text-sm text-[var(--text-primary)]">
              {service.service_name}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-xs text-[var(--text-muted)] hidden sm:block">
                {formatLastSeen(service.last_checked)}
              </span>
              <StatusBadge status={service.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
