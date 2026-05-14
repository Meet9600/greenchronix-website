import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "../components/site-shell";
import { getAllPosts } from "../lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on shipping software fast, automation ROI, and keeping stacks lean. Written by the GreenChronix team.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-6 pb-12 pt-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-500/[0.07] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-200/90">
          Blog
        </span>
        <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
          <span className="bg-gradient-to-br from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Notes from the build.{" "}
          </span>
          <span className="bg-gradient-to-r from-[#6ee7b7] via-white to-[#34d399] bg-clip-text text-transparent">
            Practical, not preachy.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-zinc-400">
          Lessons from real client projects, what worked, what didn&rsquo;t, and what we&rsquo;d do
          differently. No clickbait, no fluff.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24">
        <ul className="grid gap-5">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block rounded-3xl border border-white/[0.08] bg-white/[0.03] p-7 transition-all hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.05] hover:shadow-2xl hover:shadow-emerald-500/10"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span aria-hidden>·</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white transition-colors group-hover:text-[#6ee7b7]">
                  {post.title}
                </h2>
                <p className="mt-3 text-zinc-400">{post.excerpt}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#34d399] transition-transform group-hover:translate-x-1">
                  Read post <span aria-hidden>→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </SiteShell>
  );
}
