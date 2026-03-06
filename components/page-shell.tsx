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
      <div className="border-b border-[var(--line-soft)] bg-[rgba(7,20,27,0.84)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[104rem] items-center justify-between gap-5 px-4 py-4 md:px-8 md:py-5">
          <div className="space-y-1">
            <p className="font-display text-[1.7rem] tracking-[-0.03em] text-[var(--ink-strong)] md:text-[2.1rem]">Film Forage</p>
            <p className="text-[11px] uppercase tracking-[0.26em] text-[var(--ink-muted)]">Real availability. Local shortlist.</p>
          </div>
          <AppNav pathname={pathname} />
        </div>
      </div>

      <main id="main-content" className="mx-auto flex w-full max-w-[104rem] flex-col gap-6 px-4 pb-28 pt-4 md:px-8 md:pb-20 md:pt-8">
        {mode === "home" ? (
          <section className="grid gap-4 rounded-[2rem] border border-[var(--line-soft)] bg-[linear-gradient(135deg,rgba(14,31,40,0.94),rgba(8,18,25,0.95))] p-5 shadow-[0_28px_100px_rgba(0,0,0,0.28)] md:p-7 xl:grid-cols-[minmax(0,1.35fr)_minmax(19rem,0.7fr)] xl:items-end">
            <div className="space-y-4">
              <p className="inline-flex w-fit items-center rounded-full border border-[var(--line-strong)] bg-[var(--accent-pale)] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[var(--accent-ink)]">
                {eyebrow}
              </p>
              <div className="space-y-3">
                <h1 className="max-w-4xl font-display text-[2rem] leading-[0.94] tracking-[-0.04em] text-[var(--ink-strong)] md:text-[4.2rem] xl:text-[4.9rem]">
                  {title}
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-[var(--ink-soft)] md:text-base">
                  {intro}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 xl:hidden">
              <span className="inline-flex items-center rounded-full border border-[var(--line-soft)] bg-[var(--panel)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--ink-dim)]">Lead first</span>
              <span className="inline-flex items-center rounded-full border border-[var(--line-soft)] bg-[var(--panel)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--ink-dim)]">Check services</span>
              <span className="inline-flex items-center rounded-full border border-[var(--line-soft)] bg-[var(--panel)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--ink-dim)]">Save locally</span>
            </div>
            <div className="hidden gap-3 sm:grid-cols-3 xl:grid xl:grid-cols-1">
              {[
                ["Lead first", "See one clear best bet before the backup pile starts."],
                ["Service-aware", "Use region and provider filters before you waste a click."],
                ["Private shortlist", "Save finalists and notes locally while the group decides."],
              ].map(([label, body]) => (
                <div key={label} className="rounded-[1.5rem] border border-[var(--line-soft)] bg-[rgba(255,255,255,0.03)] p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--accent-ink)]">{label}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">{body}</p>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="grid gap-3 border-b border-[var(--line-soft)] pb-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--ink-muted)]">{eyebrow}</p>
            <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="space-y-2">
                <h1 className="max-w-4xl font-display text-[2.4rem] leading-[0.95] tracking-[-0.04em] text-[var(--ink-strong)] md:text-[3.7rem]">
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
