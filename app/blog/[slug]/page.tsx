import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "../../components/site-shell";
import { getAllSlugs, getPostBySlug } from "../../lib/blog";

type Params = { slug: string };

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post not found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Split content into paragraphs (double-newline separated)
  const paragraphs = post.content.split(/\n\n+/).filter((p) => p.trim().length > 0);

  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-6 pb-24 pt-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-[#34d399]"
        >
          <span aria-hidden>←</span> All posts
        </Link>

        <header className="mt-8">
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
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            <span className="bg-gradient-to-br from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              {post.title}
            </span>
          </h1>
          <p className="mt-4 text-lg text-zinc-400">{post.excerpt}</p>
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
        </header>

        <div className="mt-12 space-y-6 text-lg leading-relaxed text-zinc-300">
          {paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <footer className="mt-16 rounded-3xl border border-emerald-500/10 bg-gradient-to-br from-emerald-500/[0.06] to-transparent p-8">
          <p className="text-lg font-semibold text-white">Like how we think? Let&rsquo;s build.</p>
          <p className="mt-2 text-zinc-400">
            Tell us about your project. We reply within 24 hours.
          </p>
          <Link
            href="/#contact"
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#34d399] px-5 py-3 text-sm font-semibold text-zinc-950 shadow-[0_0_44px_-14px_rgba(52,211,153,0.55)] transition-transform hover:scale-[1.02]"
          >
            Start a conversation <span aria-hidden>→</span>
          </Link>
        </footer>
      </article>
    </SiteShell>
  );
}
