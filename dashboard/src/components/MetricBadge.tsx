interface MetricBadgeProps {
  value: number;
}

export function MetricBadge({ value }: MetricBadgeProps) {
  let color = "text-green-500";

  if (value >= 85) {
    color = "text-red-500";
  } else if (value >= 60) {
    color = "text-yellow-500";
  }

  return (
    <span className={`font-medium ${color}`}>
      {value.toFixed(2)}%
    </span>
  );
}