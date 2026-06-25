"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Server, LayoutDashboard } from "lucide-react";

const navLinks = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/servers", label: "Servers", icon: Server },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
      }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-semibold text-[var(--text-primary)]">
            <Activity size={18} className="text-[var(--accent)]" />
            <span className="text-sm">SystemHealth</span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href === "/servers" && pathname.startsWith("/servers"));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    active
                      ? "bg-[var(--accent-subtle)] text-[var(--accent)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
                  }`}
                >
                  <Icon size={13} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)]">Live · 30s refresh</span>
          <span className="w-2 h-2 rounded-full bg-[var(--green)] animate-pulse" />
        </div>
      </div>
    </header>
  );
}
