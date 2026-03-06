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
      <div className="border-b border-[var(--line-soft)] bg-[rgba(7,12,18,0.9)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[118rem] flex-col gap-4 px-4 py-4 md:px-8 md:py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <p className="font-display text-[2rem] text-[var(--ink-strong)] md:text-[2.5rem]">Film Forage</p>
            <p className="text-[11px] uppercase tracking-[0.26em] text-[var(--ink-muted)]">Pick something good without endless scrolling.</p>
          </div>
          <AppNav pathname={pathname} />
        </div>
      </div>

      <main id="main-content" className="mx-auto flex w-full max-w-[118rem] flex-col gap-6 px-4 pb-20 pt-4 md:px-8 md:pb-20 md:pt-8">
        {mode === "home" ? (
          <section className="grid gap-4 rounded-[1.8rem] border border-[var(--line-soft)] bg-[linear-gradient(135deg,rgba(13,19,28,0.98),rgba(8,13,19,0.98))] p-5 shadow-[0_34px_100px_rgba(0,0,0,0.34)] md:p-7">
            <div className="space-y-4">
              <p className="inline-flex w-fit items-center rounded-md border border-[var(--line-strong)] bg-[var(--accent-pale)] px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[var(--accent-soft)]">
                {eyebrow}
              </p>
              <h1 className="max-w-4xl font-display text-[2.9rem] leading-[0.92] text-[var(--ink-strong)] md:text-[4.6rem]">{title}</h1>
              <p className="max-w-3xl text-base leading-7 text-[var(--ink-soft)]">{intro}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink-muted)] lg:hidden">
                Region-aware • Service checks • Local watchlist
              </p>
            </div>
            <p className="hidden text-xs uppercase tracking-[0.16em] text-[var(--ink-muted)] lg:block">
              Region-aware • Service checks • Local watchlist
            </p>
          </section>
        ) : (
          <section className="grid gap-3 border-b border-[var(--line-soft)] pb-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--ink-muted)]">{eyebrow}</p>
            <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="space-y-2">
                <h1 className="max-w-4xl font-display text-[2.5rem] leading-[0.92] text-[var(--ink-strong)] md:text-[4rem]">{title}</h1>
                <p className="max-w-3xl text-sm leading-7 text-[var(--ink-dim)] md:text-base">{intro}</p>
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
