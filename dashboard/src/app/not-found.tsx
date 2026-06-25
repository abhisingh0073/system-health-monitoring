import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <p className="text-5xl font-mono font-bold text-[var(--text-muted)]">404</p>
      <p className="text-[var(--text-secondary)] mt-3 text-sm">Server not found.</p>
      <Link
        href="/servers"
        className="mt-6 text-xs text-[var(--accent)] hover:underline"
      >
        ← Back to servers
      </Link>
    </div>
  );
}
