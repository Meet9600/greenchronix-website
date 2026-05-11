import Link from "next/link";
import { SiteShell } from "./components/site-shell";

export default function NotFound() {
  return (
    <SiteShell>
      <section className="mx-auto grid max-w-3xl place-items-center px-6 pb-24 pt-12 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-emerald-300/80">
          404 · Page not found
        </p>
        <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-6xl">
          <span className="bg-gradient-to-br from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Lost in the stack.
          </span>
        </h1>
        <p className="mt-6 max-w-md text-lg text-zinc-400">
          The page you&rsquo;re looking for has either moved, been renamed, or never existed in the
          first place. Let&rsquo;s get you back on track.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-2xl bg-[#34d399] px-6 py-3.5 text-sm font-semibold text-zinc-950 shadow-[0_0_44px_-14px_rgba(52,211,153,0.55)] transition-transform hover:scale-[1.03]"
          >
            Back home
          </Link>
          <Link
            href="/blog"
            className="rounded-2xl border border-emerald-500/20 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-[#34d399]/35 hover:bg-emerald-500/[0.06]"
          >
            Read the blog
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
