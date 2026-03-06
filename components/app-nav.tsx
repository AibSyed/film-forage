import Link from "next/link";
import type { Route } from "next";
import { Film, Search, Bookmark, CircleHelp } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/" as Route, label: "Tonight", icon: Film },
  { href: "/search" as Route, label: "Search", icon: Search },
  { href: "/watchlist" as Route, label: "Watchlist", icon: Bookmark },
  { href: "/sources" as Route, label: "Sources", icon: CircleHelp },
];

export function AppNav({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="Primary" className="overflow-x-auto">
      <div className="flex min-w-max gap-2 rounded-full border border-[var(--line-soft)] bg-white/70 p-1 shadow-[0_18px_50px_rgba(44,33,20,0.08)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition",
                active
                  ? "bg-[var(--ink-strong)] text-[var(--paper)]"
                  : "text-[var(--ink-dim)] hover:bg-white hover:text-[var(--ink-main)]"
              )}
            >
              <Icon size={15} /> {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
