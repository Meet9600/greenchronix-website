/**
 * Blog posts as inline data — no CMS needed.
 * To add a post: append an object below. The `slug` becomes the URL: /blog/<slug>
 * Content supports basic markdown-style paragraphs (split by double newlines).
 */

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO format YYYY-MM-DD
  readTime: string;
  tags: string[];
  content: string;
};

export const posts: BlogPost[] = [
  {
    slug: "why-lean-stacks-win",
    title: "Why lean stacks win in 2026",
    excerpt:
      "Bloated frameworks slow teams down. Here's how we keep the build small, the bills smaller, and the deploys boring.",
    date: "2026-05-08",
    readTime: "4 min read",
    tags: ["Engineering", "Performance"],
    content: `Most agency websites we audit have one thing in common: too much stack for too little site.

A landing page does not need a headless CMS, three analytics scripts, a 12-step build pipeline, and a 400 KB JavaScript payload. It needs to load fast, communicate clearly, and convert visitors. That is it.

At GreenChronix we default to a lean baseline — Next.js, Tailwind, a single deploy target — and only add complexity when a client's actual workflow demands it. The result is fewer bugs, faster shipping, and lower monthly bills.

The trade-off people fear (less flexibility) almost never materializes. What you lose in theoretical extensibility you gain in operational simplicity, and most projects never grow to need the missing features anyway.

Lean is not about doing less. It is about not doing the wrong things.`,
  },
  {
    slug: "automation-roi-in-one-week",
    title: "Automation ROI in one week",
    excerpt:
      "A small Python script that replaced four hours of weekly invoice work. The math, the trade-offs, the gotchas.",
    date: "2026-04-22",
    readTime: "6 min read",
    tags: ["Automation", "Case Study"],
    content: `A recent client was spending four hours every Monday consolidating invoices from three different sources into one spreadsheet. We replaced it with a 180-line Python script.

Build time: one week. Time saved: roughly 16 hours per month. Payback period: under three weeks.

The interesting part is not the automation itself — these scripts are not hard to write. The interesting part is that the team had been doing the manual work for two years before considering automation, because no single Monday felt expensive enough to justify the project.

That is the trap. Repetitive work compounds quietly. By the time someone notices the cost, hundreds of hours are gone.

Our rule of thumb: if a task takes more than an hour, repeats weekly, and follows the same steps every time, it deserves a one-hour conversation about automating it. The conversation is free. The savings usually are not.`,
  },
  {
    slug: "shipping-fast-without-shipping-junk",
    title: "Shipping fast without shipping junk",
    excerpt:
      "Speed and quality are not opposites. Here's the workflow we use to deliver in 7–14 days without regret.",
    date: "2026-03-15",
    readTime: "5 min read",
    tags: ["Process", "Engineering"],
    content: `"Move fast and break things" was a Facebook slogan from 2014. It has aged poorly.

Modern speed comes from boring discipline, not heroic sprints. Our default process for a two-week build looks like this:

Days 1–2: Discovery and scope freeze. We do not start coding until both sides agree on what is in and what is out. Scope creep kills timelines.

Days 3–9: Build in vertical slices. One full feature end-to-end before moving to the next, instead of half-built features stacked horizontally. This keeps every demo functional.

Days 10–12: Polish, accessibility, performance budget check. The last 20% takes the time you think the first 80% will.

Days 13–14: Deploy, handoff docs, and a recorded walkthrough.

The secret is not working harder. It is refusing to start the next thing before the current thing is actually done.`,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function getAllSlugs(): string[] {
  return posts.map((p) => p.slug);
}
