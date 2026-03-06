import Link from "next/link";
import type { Route } from "next";
import { Bookmark, CircleHelp, Film, Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/" as Route, label: "Home", icon: Film },
  { href: "/search" as Route, label: "Search", icon: Search },
  { href: "/watchlist" as Route, label: "Watchlist", icon: Bookmark },
  { href: "/sources" as Route, label: "Sources", icon: CircleHelp },
];

function isActive(pathname: string, href: Route) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function AppNav({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="Primary" className="w-full lg:w-auto">
      <div className="no-scrollbar flex min-w-0 snap-x items-center gap-2 overflow-x-auto rounded-lg border border-[var(--line-soft)] bg-[rgba(10,16,24,0.9)] p-1.5 shadow-[0_18px_48px_rgba(0,0,0,0.18)] lg:min-w-max lg:gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex h-10 shrink-0 snap-start items-center justify-center gap-2 rounded-md px-3.5 text-[13px] font-semibold transition lg:h-10 lg:px-4 lg:text-sm",
                active
                  ? "border border-[rgba(0,0,0,0.28)] bg-[var(--accent-strong)] !text-[#0a1118] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
                  : "text-[var(--ink-main)] hover:bg-[var(--panel-muted)]"
              )}
            >
              <Icon size={14} className="hidden lg:inline" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
