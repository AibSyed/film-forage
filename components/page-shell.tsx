import { AppNav } from "@/components/app-nav";
import { SiteFooter } from "@/components/site-footer";

export function PageShell({
  pathname,
  eyebrow,
  title,
  intro,
  mode = "default",
  children,
}: {
  pathname: string;
  eyebrow: string;
  title: string;
  intro: string;
  mode?: "home" | "default";
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="border-b border-[var(--line-soft)] bg-[rgba(6,18,25,0.78)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-[92rem] items-center justify-between gap-4 px-4 py-4 md:px-8">
          <div className="space-y-1">
            <p className="font-display text-2xl text-[var(--ink-strong)] md:text-3xl">Film Forage</p>
            <p className="text-xs uppercase tracking-[0.26em] text-[var(--ink-muted)]">Find one good movie faster</p>
          </div>
          <AppNav pathname={pathname} />
        </div>
      </div>

      <main id="main-content" className="mx-auto flex w-full max-w-[92rem] flex-col gap-5 px-4 pb-28 pt-4 md:px-8 md:pb-20 md:pt-7">
        {mode === "home" ? (
          <section className="grid gap-4 rounded-[1.9rem] border border-[var(--line-soft)] bg-[linear-gradient(135deg,rgba(12,28,37,0.96),rgba(8,18,25,0.94))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:p-6">
            <p className="inline-flex w-fit items-center rounded-full border border-[var(--line-strong)] bg-[var(--accent-pale)] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[var(--accent-ink)]">
              {eyebrow}
            </p>
            <div className="space-y-3">
              <h1 className="max-w-5xl font-display text-[2.5rem] leading-[0.92] text-[var(--ink-strong)] md:text-[4.9rem]">
                {title}
              </h1>
              <p className="max-w-4xl text-sm leading-7 text-[var(--ink-dim)] md:text-base">
                {intro}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center rounded-full border border-[var(--line-soft)] bg-[var(--panel-muted)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--ink-dim)]">
                Lead pick first
              </span>
              <span className="inline-flex items-center rounded-full border border-[var(--line-soft)] bg-[var(--panel-muted)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--ink-dim)]">
                Check services by region
              </span>
              <span className="inline-flex items-center rounded-full border border-[var(--line-soft)] bg-[var(--panel-muted)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--ink-dim)]">
                Local watchlist
              </span>
            </div>
          </section>
        ) : (
          <section className="grid gap-3 border-b border-[var(--line-soft)] pb-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--ink-muted)]">{eyebrow}</p>
            <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="space-y-2">
                <h1 className="max-w-4xl font-display text-3xl leading-[0.96] text-[var(--ink-strong)] md:text-[3.5rem]">
                  {title}
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-[var(--ink-dim)] md:text-base">
                  {intro}
                </p>
              </div>
            </div>
          </section>
        )}
        {children}
      </main>
      <SiteFooter compact={pathname !== "/"} />
    </>
  );
}
