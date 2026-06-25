export function formatLastSeen(date: string | null): string {
  if (!date) {
    return "Never";
  }

  const now = new Date();
  const lastSeen = new Date(date);

  const diff = Math.floor((now.getTime() - lastSeen.getTime()) / 1000);

  if (diff < 60) {
    return `${diff} sec ago`;
  }

  if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes} min ago`;
  }

  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours} hr ago`;
  }

  const days = Math.floor(diff / 86400);

  if (days === 1) {
    return "Yesterday";
  }

  if (days < 30) {
    return `${days} days ago`;
  }

  return lastSeen.toLocaleString();
}

export function formateDateTime(date: string | null): string{
  if(!date) return "never";

  return new Date(date).toLocaleString();
}


export function formatPercentage(value: number | string): string {
  return `${Number(value).toFixed(2)}%`;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
}

export function formatUptime(seconds: number | string): string {
  const totalSeconds = Number(seconds);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days}d`);
  }

  if (hours > 0) {
    parts.push(`${hours}h`);
  }

  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }

  if (parts.length === 0) {
    parts.push("Less than a minute");
  }

  return parts.join(" ");
}