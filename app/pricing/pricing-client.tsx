"use client";

import { motion } from "framer-motion";
import { buildWhatsAppUrl } from "../lib/site";

const easeOutExpo = [0.22, 1, 0.36, 1] as const;

type Tier = {
  name: string;
  slug: string;
  tagline: string;
  ideal: string;
  features: string[];
  timeline: string;
  highlighted?: boolean;
  ctaMessage: string;
};

const tiers: Tier[] = [
  {
    name: "Starter",
    slug: "starter",
    tagline: "Land your idea online, fast.",
    ideal: "Solo founders, small businesses, portfolio sites.",
    timeline: "15–35 days",
    features: [
      "Single-page or up-to-3-page site",
      "Responsive design + motion polish",
      "Contact form wired to email or WhatsApp",
      "Basic SEO + analytics setup",
      "Deploy to Vercel/Netlify with SSL",
      "14 days of post-launch support",
    ],
    ctaMessage:
      "Hi GreenChronix! I'm interested in the Starter package. Here's what I'm thinking: ",
  },
  {
    name: "Growth",
    slug: "growth",
    tagline: "For teams that need real product work.",
    ideal: "Startups, SaaS shells, internal tools, CMS-driven sites.",
    timeline: "15–35 days",
    highlighted: true,
    features: [
      "Multi-page site or web app (up to 8 routes)",
      "Custom components + auth flows",
      "Database integration (Supabase / Postgres)",
      "Admin panel or content management",
      "Performance budget + Core Web Vitals tuning",
      "Full SEO suite, OG cards, structured data",
      "30 days of post-launch support",
    ],
    ctaMessage:
      "Hi GreenChronix! I'm interested in the Growth package. Here's the project: ",
  },
  {
    name: "Custom",
    slug: "custom",
    tagline: "Bespoke builds & ongoing partnerships.",
    ideal: "AI agents, blockchain builds, automation suites, monthly care plans.",
    timeline: "15–35 days",
    features: [
      "Custom scope, milestones, and timeline",
      "AI agents, chatbots, and knowledge-base search",
      "Blockchain MVPs, wallet flows, and Web3 dashboards",
      "Python data pipelines + dashboards",
      "Integrations: Stripe, Slack, Sheets, OpenAI, CRMs",
      "Dedicated engineer hours per week",
      "Monitoring, error tracking, weekly reports",
      "Roadmap planning + iteration cycles",
      "Retainer or per-sprint billing",
    ],
    ctaMessage:
      "Hi GreenChronix! I'd like to discuss a Custom engagement. Quick context: ",
  },
];

const faqs = [
  {
    q: "Why don't you list fixed prices?",
    a: "Because honest pricing depends on scope. A 'simple landing page' for one client means three pages with a contact form; for another, it means a multi-language site with bookings and Stripe. We give a fixed quote within 24 hours of a quick call, with no surprises after.",
  },
  {
    q: "How do payments work?",
    a: "50% upfront to lock the schedule, 50% on delivery. Larger projects can be split into milestones. We accept UPI, bank transfer, and standard international rails.",
  },
  {
    q: "What if I need changes after launch?",
    a: "Every package includes a post-launch support window (14 or 30 days) for fixes and small tweaks. After that, you can either book a small block of hours or move to a monthly care plan.",
  },
  {
    q: "Do you work with non-Indian clients?",
    a: "Yes. We're remote-first. Most of our communication is async (email, Slack, Linear), with weekly calls when needed. We invoice in INR, USD, or EUR.",
  },
];

export function PricingClient() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-12 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: easeOutExpo }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-500/[0.07] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-200/90">
            Pricing
          </span>
          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-br from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              Pick a package.{" "}
            </span>
            <span className="bg-gradient-to-r from-[#6ee7b7] via-white to-[#34d399] bg-clip-text text-transparent">
              Get a fixed quote in 24 hours.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-zinc-400">
            Three tiers to start the conversation. We tailor the final scope after a 15-minute
            discovery call, so what you pay matches what you actually need.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-5 md:grid-cols-3">
          {tiers.map((tier, i) => (
            <TierCard key={tier.name} tier={tier} delay={i * 0.08} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-semibold tracking-tight md:text-4xl"
        >
          Common questions
        </motion.h2>
        <div className="mt-8 grid gap-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6"
            >
              <h3 className="font-semibold text-white">{faq.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}

function TierCard({ tier, delay }: { tier: Tier; delay: number }) {
  const borderClass = tier.highlighted
    ? "border-emerald-500/40 bg-gradient-to-b from-emerald-500/[0.08] to-white/[0.02]"
    : "border-white/[0.08] bg-white/[0.03]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: easeOutExpo }}
      whileHover={{ y: -4 }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border ${borderClass} p-7 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.9)] transition-shadow hover:shadow-2xl`}
    >
      {tier.highlighted && (
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-500/30 to-transparent blur-2xl" />
      )}
      <div className="relative flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xl font-semibold">{tier.name}</h3>
          {tier.highlighted && (
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
              Most popular
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-zinc-400">{tier.tagline}</p>

        <div className="mt-6">
          <p className="text-2xl font-semibold text-white">Contact for pricing</p>
          <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500">
            Timeline · {tier.timeline}
          </p>
        </div>

        <p className="mt-5 text-xs uppercase tracking-wider text-zinc-500">Ideal for</p>
        <p className="mt-1 text-sm text-zinc-300">{tier.ideal}</p>

        <p className="mt-6 text-xs uppercase tracking-wider text-zinc-500">What&rsquo;s included</p>
        <ul className="mt-3 space-y-2.5 text-sm text-zinc-300">
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#34d399] to-emerald-200/80" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <motion.a
          href={`/#contact?tier=${tier.slug}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`mt-7 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold transition-colors ${
            tier.highlighted
              ? "bg-[#34d399] text-zinc-950 shadow-[0_0_44px_-14px_rgba(52,211,153,0.55)]"
              : "border border-emerald-500/20 bg-white/[0.04] text-white hover:border-[#34d399]/35 hover:bg-emerald-500/[0.06]"
          }`}
        >
          Get a quote <span aria-hidden>→</span>
        </motion.a>
        <a
          href={buildWhatsAppUrl(tier.ctaMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-zinc-400 transition-colors hover:text-[#34d399]"
        >
          Or chat on WhatsApp <span aria-hidden>→</span>
        </a>
      </div>
    </motion.div>
  );
}
