import { AppNav } from "@/components/app-nav";
import { SiteFooter } from "@/components/site-footer";

export function PageShell({
  pathname,
  eyebrow,
  title,
  intro,
  children,
}: {
  pathname: string;
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <main id="main-content" className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 pt-6 md:px-8 md:pt-8">
        <header className="grid gap-5 rounded-[2rem] border border-[var(--line-soft)] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(246,239,228,0.88))] p-5 shadow-[0_24px_80px_rgba(49,36,20,0.10)] md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <p className="text-xs uppercase tracking-[0.34em] text-[var(--ink-muted)]">{eyebrow}</p>
              <h1 className="font-display text-5xl leading-[0.95] text-[var(--ink-strong)] md:text-7xl">{title}</h1>
              <p className="max-w-2xl text-base text-[var(--ink-dim)] md:text-lg">{intro}</p>
            </div>
            <AppNav pathname={pathname} />
          </div>
        </header>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
