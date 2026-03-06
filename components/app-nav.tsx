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
      <div className="grid grid-cols-4 gap-1.5 rounded-[1.2rem] border border-[var(--line-soft)] bg-[rgba(255,255,255,0.04)] p-1.5 shadow-[0_18px_48px_rgba(0,0,0,0.18)] backdrop-blur lg:flex lg:min-w-max lg:items-center lg:gap-2 lg:rounded-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex items-center justify-center gap-1.5 rounded-[0.95rem] px-2 py-2 text-[12px] font-semibold transition lg:rounded-full lg:px-4 lg:text-sm",
                active
                  ? "bg-[var(--paper)] text-[#221816]"
                  : "text-[var(--ink-dim)] hover:bg-[var(--panel-muted)] hover:text-[var(--ink-main)]"
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
