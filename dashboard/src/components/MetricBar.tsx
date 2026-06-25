interface MetricBarProps {
  label: string;
  value: number | null | undefined;
  unit?: string;
}

function getColor(value: number): string {
  if (value >= 90) return "var(--red)";
  if (value >= 70) return "var(--yellow)";
  return "var(--green)";
}

export function MetricBar({ label, value, unit = "%" }: MetricBarProps) {
  if (value == null) {
    return (
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-xs text-[var(--text-secondary)]">{label}</span>
          <span className="text-xs text-[var(--text-muted)]">—</span>
        </div>
        <div className="h-1.5 rounded-full bg-[var(--surface-2)]" />
      </div>
    );
  }

  const color = getColor(value);
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs text-[var(--text-secondary)]">{label}</span>
        <span className="text-xs font-mono" style={{ color }}>
          {value.toFixed(1)}{unit}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-[var(--surface-2)]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(value, 100)}%`, background: color }}
        />
      </div>
    </div>
  );
}
