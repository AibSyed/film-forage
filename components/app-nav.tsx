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
    <>
      <nav aria-label="Primary" className="hidden md:block">
        <div className="flex items-center gap-2 rounded-[1.1rem] border border-[var(--line-soft)] bg-[rgba(255,255,255,0.03)] p-1.5 shadow-[0_16px_44px_rgba(0,0,0,0.2)] backdrop-blur">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-[0.95rem] px-4 py-2.5 text-sm font-semibold transition",
                  active
                    ? "bg-[linear-gradient(135deg,var(--accent-soft),var(--accent-strong))] text-[#141b20]"
                    : "text-[var(--ink-dim)] hover:bg-[var(--panel-muted)] hover:text-[var(--ink-main)]"
                )}
              >
                <Icon size={15} /> {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <nav aria-label="Primary mobile" className="fixed inset-x-4 bottom-4 z-40 md:hidden">
        <div className="grid grid-cols-4 rounded-[1.2rem] border border-[var(--line-soft)] bg-[rgba(7,12,16,0.94)] p-1.5 shadow-[0_22px_70px_rgba(0,0,0,0.35)] backdrop-blur">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-[0.9rem] px-2 py-2 text-[11px] font-semibold transition",
                  active
                    ? "bg-[var(--accent-pale)] text-[var(--ink-strong)]"
                    : "text-[var(--ink-muted)] hover:text-[var(--ink-main)]"
                )}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
