"use client";

import { motion, MotionConfig } from "framer-motion";
import Link from "next/link";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { GreenBytesLogo, GreenBytesMark } from "./components/greenbytes-logo";
import { buildWhatsAppUrl, getBookingUrl, siteConfig } from "./lib/site";

const easeOutExpo = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: easeOutExpo },
  },
};

const stagger = {
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.14 },
  },
};

const wordReveal = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: easeOutExpo },
  },
};

const springReveal = { type: "spring" as const, stiffness: 220, damping: 28, mass: 0.85 };

const sectionHeadContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.02 },
  },
};

const sectionEyebrow = {
  hidden: { opacity: 0, x: -14 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: easeOutExpo } },
};

const sectionLine = {
  hidden: { scaleX: 0, opacity: 0 },
  show: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.85, ease: easeOutExpo },
  },
};

const sectionTitle = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: easeOutExpo },
  },
};

const sectionSubtitle = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

const SECTION_LABEL: Record<string, string> = {
  services: "Capabilities",
  projects: "Proof of work",
  about: "The team",
  contact: "Start a project",
};

export default function HomeContent() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen overflow-x-hidden bg-[#040806] text-zinc-50">
      <AmbientBackground />
      <GrainOverlay />

      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: easeOutExpo }}
        className="fixed inset-x-0 top-0 z-50 border-b border-emerald-500/[0.08] bg-[#040806]/70 backdrop-blur-xl backdrop-saturate-150"
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <motion.a
            href="/"
            className="min-w-0 shrink"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            <GreenBytesMark />
          </motion.a>

          <div className="hidden items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.03] p-1 md:flex">
            {siteConfig.nav.map(({ label, href }) => {
              const isInternalRoute = href.startsWith("/") && !href.startsWith("/#");
              const className =
                "rounded-full px-4 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-emerald-500/[0.08] hover:text-white";
              return isInternalRoute ? (
                <Link key={href} href={href} className={className}>
                  {label}
                </Link>
              ) : (
                <a key={href} href={href} className={className}>
                  {label}
                </a>
              );
            })}
          </div>

          <motion.a
            href="#contact"
            className="group relative overflow-hidden rounded-full bg-[#34d399] px-5 py-2.5 text-xs font-semibold text-zinc-950 shadow-[0_0_36px_-10px_rgba(52,211,153,0.65)]"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">Request a quote</span>
            <span className="absolute inset-0 z-0 bg-gradient-to-r from-emerald-200 via-white to-emerald-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </motion.a>
        </nav>
      </motion.header>

      <main className="relative z-10 pt-28">
        <motion.section
          className="mx-auto max-w-6xl px-6 pb-16 pt-6"
        >
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]"
          >
            <div>
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-500/[0.07] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-200/90">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34d399]/70 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34d399]" />
                  </span>
                  Taking new builds
                </span>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-6 lg:hidden">
                <GreenBytesLogo priority className="h-16 w-[240px] sm:w-[300px]" />
              </motion.div>

              <motion.h1
                variants={wordReveal}
                className="mt-6 max-w-2xl text-balance text-4xl font-semibold tracking-tight md:mt-7 md:text-5xl lg:text-6xl"
              >
                <span className="bg-gradient-to-br from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                  Smart tech for{" "}
                </span>
                <span className="relative inline-block">
                  <span
                    aria-hidden
                    className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-r from-emerald-500/30 via-[#34d399]/15 to-teal-500/20 blur-2xl"
                  />
                  <span className="bg-gradient-to-r from-[#6ee7b7] via-white to-[#34d399] bg-clip-text text-transparent">
                    a greener future
                  </span>
                </span>
                <span className="bg-gradient-to-br from-white via-zinc-100 to-zinc-500 bg-clip-text text-transparent">
                  {" "}
                  with lean IT that ships fast.
                </span>
              </motion.h1>

              <motion.p variants={fadeUp} className="mt-6 max-w-xl text-pretty text-lg text-zinc-400">
                {siteConfig.name} builds websites, apps, AI agents, blockchain products,
                automation, and data tools with clean code, honest timelines, and long-term care
                so your stack stays efficient, not bloated.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-3">
                <MagneticButton href="#contact" primary>
                  Start a project
                </MagneticButton>
                <MagneticButton href="#projects">View work</MagneticButton>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-12 grid grid-cols-3 gap-3 sm:gap-4"
              >
                <Stat label="Delivery" value="15–35 days" accent="from-emerald-400/40" />
                <Stat label="Support" value="30 days" accent="from-[#34d399]/35" />
                <Stat label="Stack" value="Next.js" accent="from-teal-400/35" />
              </motion.div>
            </div>

            <motion.div variants={fadeUp} className="relative lg:pl-4">
              <FloatingPanel />
            </motion.div>
          </motion.div>
        </motion.section>

        <SectionMotion
          id="services"
          title="Services"
          subtitle="Focused capabilities. Clear outcomes. Less waste, more value per byte."
        >
          <div className="grid gap-5 md:grid-cols-3">
            <HoverLiftCard
              index={0}
              title="Websites & Web Apps"
              desc="Landing pages, portfolios, SaaS shells, and internal tools that are fast, responsive, and built to scale."
              items={["Responsive UI & motion polish", "SEO + performance budget", "Clean handoff"]}
              hue="emerald"
            />
            <HoverLiftCard
              index={1}
              title="AI Agents & Chatbots"
              desc="Custom agents that answer questions, qualify leads, search knowledge bases, and automate routine work."
              items={["Website and WhatsApp bots", "OpenAI / RAG workflows", "Human handoff paths"]}
              hue="green"
            />
            <HoverLiftCard
              index={2}
              title="Blockchain & Web3"
              desc="Smart contracts, wallet flows, token-gated experiences, and Web3 dashboards built with practical security in mind."
              items={["Smart contract MVPs", "Wallet integrations", "On-chain data views"]}
              hue="teal"
            />
            <HoverLiftCard
              index={3}
              title="Data & Automation"
              desc="Python pipelines, reporting, and glue code that turns messy workflows into one click."
              items={["Time saved, measured", "Docs you can actually read", "Error handling that matters"]}
              hue="emerald"
            />
            <HoverLiftCard
              index={4}
              title="Cloud, APIs & DevOps"
              desc="Production deployments, third-party integrations, serverless APIs, and monitoring for stable day-to-day operations."
              items={["Vercel / cloud-ready", "Stripe, CRM, Slack, Sheets", "Monitoring & fixes"]}
              hue="green"
            />
            <HoverLiftCard
              index={5}
              title="Deploy & Maintain"
              desc="Ship to production, wire domains/SSL, and keep things updated while you focus on the business."
              items={["Security updates", "Performance tuning", "Monthly care plans"]}
              hue="teal"
            />
          </div>
        </SectionMotion>

        <SectionMotion id="projects" title="Projects" subtitle="Selected builds and practical outcomes.">
          <div className="grid gap-5 md:grid-cols-3">
            <ProjectCard
              index={0}
              name="Restaurant landing page"
              result="More calls & inquiries"
              tech="Next.js · Tailwind · Motion"
              delay={0}
            />
            <ProjectCard
              index={1}
              name="Invoice automation"
              result="Saved 6+ hours weekly"
              tech="Python · CSV/Sheets"
              delay={0.08}
            />
            <ProjectCard
              index={2}
              name="Sales dashboard"
              result="Faster weekly reviews"
              tech="BI stack · SQL"
              delay={0.16}
            />
            <ProjectCard
              index={3}
              name="Support AI chatbot"
              result="Instant answers for leads"
              tech="OpenAI · RAG · WhatsApp"
              delay={0.24}
            />
            <ProjectCard
              index={4}
              name="Web3 wallet dashboard"
              result="Clear token activity"
              tech="Wallet flows · On-chain data"
              delay={0.32}
            />
            <ProjectCard
              index={5}
              name="API deployment setup"
              result="Stable production handoff"
              tech="Vercel · APIs · Monitoring"
              delay={0.4}
            />
          </div>
          <ProjectTrustPanel />
        </SectionMotion>

        <SectionMotion id="about" title="About" subtitle="Trust is built with proof, process, and communication.">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px", amount: 0.15 }}
            transition={{ type: "spring", stiffness: 180, damping: 28 }}
            className="relative overflow-hidden rounded-3xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.08] to-transparent p-8 shadow-[0_0_100px_-42px_rgba(52,211,153,0.28)]"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-500/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-teal-500/18 blur-3xl" />
            <p className="relative max-w-3xl text-lg text-zinc-300">
              Hi! We&rsquo;re{" "}
              <span className="font-semibold text-white">{siteConfig.founders.primary}</span> and{" "}
              <span className="font-semibold text-white">{siteConfig.founders.secondary}</span>{" "}
              from {siteConfig.name}. We ship modern web experiences, AI workflows,
              blockchain features, automation, and dashboards, with the clarity and footprint of a
              small team.
            </p>
            <div className="relative mt-8 grid gap-4 md:grid-cols-3">
              {(
                [
                  {
                    title: "Crystal-clear updates",
                    desc: "Weekly notes, realistic timelines, and zero mystery charges.",
                  },
                  { title: "Quality that lasts", desc: "Readable code, sensible architecture, real docs." },
                  {
                    title: "Post-launch care",
                    desc: "We stick around for fixes, tuning, and iteration.",
                  },
                ] as const
              ).map((m, i) => (
                <motion.div
                  key={m.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 26,
                    delay: 0.12 + i * 0.1,
                  }}
                >
                  <Mini title={m.title} desc={m.desc} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </SectionMotion>

        <SectionMotion id="contact" title="Contact" subtitle="Tell us what you&rsquo;re building. We reply within 24 hours.">
          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px", amount: 0.2 }}
              transition={{ type: "spring", stiffness: 200, damping: 28 }}
              className="rounded-3xl border border-white/[0.09] bg-white/[0.035] p-8 shadow-[0_24px_80px_-50px_rgba(0,0,0,0.75)] backdrop-blur-sm"
            >
              <p className="text-zinc-300">
                Prefer WhatsApp? The form sends straight to our phone. Prefer email? Drop a line and
                we&rsquo;ll reply within a day.
              </p>
              <dl className="mt-8 space-y-4 text-sm">
                <div className="flex flex-col gap-1">
                  <dt className="text-zinc-500">Email</dt>
                  <dd className="font-semibold text-white">
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="hover:text-[#34d399] transition-colors"
                    >
                      {siteConfig.email}
                    </a>
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-zinc-500">WhatsApp</dt>
                  <dd className="font-semibold text-white">
                    <a
                      href={buildWhatsAppUrl("Hi GreenChronix! I'd like to chat about a project.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#34d399] transition-colors"
                    >
                      {siteConfig.whatsapp.display}
                    </a>
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-zinc-500">Location</dt>
                  <dd className="font-semibold text-white">{siteConfig.location}</dd>
                </div>
              </dl>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px", amount: 0.2 }}
              transition={{ type: "spring", stiffness: 200, damping: 28, delay: 0.06 }}
              className="rounded-3xl border border-white/[0.09] bg-white/[0.035] p-8 shadow-[0_24px_80px_-50px_rgba(0,0,0,0.75)] backdrop-blur-sm"
            >
              <ContactForm />
            </motion.div>
          </div>
        </SectionMotion>

        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: easeOutExpo }}
          className="mx-auto max-w-6xl border-t border-white/[0.08] px-6 py-12 text-sm text-zinc-500"
        >
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <p>
              © {new Date().getFullYear()} {siteConfig.name}. {siteConfig.tagline} Built with Next.js
              & motion.
            </p>
            <div className="flex gap-6 text-xs">
              <a href="#services" className="transition-colors hover:text-[#34d399]">
                Services
              </a>
              <a href="#contact" className="transition-colors hover:text-[#34d399]">
                Contact
              </a>
            </div>
          </div>
        </motion.footer>
      </main>
      </div>
    </MotionConfig>
  );
}

function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="hero-grid absolute inset-0 opacity-[0.35]" />
      <motion.div
        className="absolute -left-1/4 top-[-20%] h-[520px] w-[520px] rounded-full bg-emerald-500/22 blur-[120px]"
        animate={{
          x: [0, 60, 0],
          y: [0, 40, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-1/4 top-[10%] h-[480px] w-[480px] rounded-full bg-[#34d399]/18 blur-[120px]"
        animate={{
          x: [0, -50, 0],
          y: [0, 60, 0],
          scale: [1, 1.12, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-25%] left-1/3 h-[560px] w-[560px] rounded-full bg-teal-600/14 blur-[130px]"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#040806]/82 to-[#040806]" />
    </div>
  );
}

function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] opacity-[0.035] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

function FloatingPanel() {
  const finePointerHover = useFinePointerHover();
  return (
    <div className="relative">
      <motion.div
        className="absolute -right-6 -top-10 hidden h-24 w-24 rounded-3xl border border-[#34d399]/25 bg-gradient-to-br from-emerald-400/25 to-transparent lg:block"
        animate={{ y: [0, -10, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-8 -left-4 hidden h-20 w-20 rounded-full border border-emerald-500/25 bg-emerald-500/10 blur-sm lg:block"
        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.95, ease: easeOutExpo }}
        className="gb-card-shine group/panel relative overflow-hidden rounded-[28px] border border-white/[0.12] bg-gradient-to-b from-white/[0.1] to-transparent p-px shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_36px_100px_-32px_rgba(52,211,153,0.1),0_32px_80px_-24px_rgba(0,0,0,0.82)]"
      >
        <div className="relative z-[2] rounded-[27px] bg-[#060d0b]/92 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Pipeline</p>
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
              Live
            </span>
          </div>
          <ul className="mt-5 space-y-4">
            {[
              {
                t: "Discovery call",
                s: "15 min: goals, scope, budget band",
                icon: "◆",
                color: "text-[#6ee7b7]",
                href: getBookingUrl(),
              },
              {
                t: "Proposal & sprint plan",
                s: "Clear milestones, no surprises",
                icon: "◇",
                color: "text-emerald-300",
                href: null,
              },
              {
                t: "Build → review → ship",
                s: "Weekly demos + async updates",
                icon: "◈",
                color: "text-teal-300",
                href: null,
              },
            ].map((row, i) => {
              const body = (
                <>
                  <span className={`mt-0.5 text-lg ${row.color}`}>{row.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-white">{row.t}</p>
                    <p className="text-sm text-zinc-400">{row.s}</p>
                  </div>
                  {row.href && (
                    <span className="self-center text-xs font-semibold text-[#34d399] opacity-0 transition-opacity group-hover:opacity-100">
                      Book →
                    </span>
                  )}
                </>
              );
              return (
                <motion.li
                  key={row.t}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.32 + i * 0.11,
                    type: "spring",
                    stiffness: 260,
                    damping: 24,
                  }}
                >
                  {row.href ? (
                    <a
                      href={row.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/[0.06]"
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="flex gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                      {body}
                    </div>
                  )}
                </motion.li>
              );
            })}
          </ul>

          <motion.div
            className="mt-6 overflow-hidden rounded-2xl border border-emerald-500/15 bg-gradient-to-r from-emerald-500/12 via-[#34d399]/10 to-teal-600/12 p-5"
            whileHover={finePointerHover ? { scale: 1.01 } : undefined}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <p className="text-sm font-semibold text-white">Ready when you are</p>
            <p className="mt-1 text-sm text-zinc-400">
              Tell us what success looks like. We&rsquo;ll mirror it in the roadmap.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <motion.a
                href={getBookingUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#34d399] px-4 py-2 text-xs font-semibold text-zinc-950"
                whileHover={finePointerHover ? { scale: 1.04 } : undefined}
                whileTap={{ scale: 0.98 }}
              >
                Book a call <span aria-hidden>→</span>
              </motion.a>
              <motion.a
                href="#contact"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6ee7b7] hover:text-[#34d399]"
                whileHover={finePointerHover ? { x: 4 } : undefined}
              >
                Or send a message <span aria-hidden>→</span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function SectionMotion({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const eyebrow = SECTION_LABEL[id] ?? "GreenChronix";

  return (
    <section
      id={id}
      className="relative mx-auto max-w-6xl scroll-mt-4 px-6 py-24 md:scroll-mt-6 md:py-28"
    >
      <motion.div
        variants={sectionHeadContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-70px", amount: 0.2 }}
        className="mb-12 max-w-2xl md:mb-14"
      >
        <motion.div variants={sectionEyebrow} className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34d399]/55 opacity-50" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#34d399] shadow-[0_0_18px_rgba(52,211,153,0.75)]" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-400/90">
            {eyebrow}
          </span>
          <motion.span
            variants={sectionLine}
            className="h-px flex-1 origin-left max-w-[min(200px,42vw)] bg-gradient-to-r from-emerald-400/55 via-[#34d399]/35 to-transparent"
          />
        </motion.div>
        <motion.h2 variants={sectionTitle} className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </motion.h2>
        <motion.p variants={sectionSubtitle} className="mt-3 text-lg text-zinc-400">
          {subtitle}
        </motion.p>
      </motion.div>
      {children}
    </section>
  );
}

/** True when the device has real hover (mouse/trackpad), not touch-first — avoids scroll jank on phones. */
function useFinePointerHover() {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return matches;
}

function HoverLiftCard({
  title,
  desc,
  items,
  hue,
  index = 0,
}: {
  title: string;
  desc: string;
  items: string[];
  hue: "emerald" | "green" | "teal";
  index?: number;
}) {
  const finePointerHover = useFinePointerHover();
  const ring =
    hue === "emerald"
      ? "hover:shadow-emerald-500/25"
      : hue === "green"
        ? "hover:shadow-[#34d399]/20"
        : "hover:shadow-teal-500/20";
  const glow =
    hue === "emerald"
      ? "from-emerald-500/25"
      : hue === "green"
        ? "from-[#34d399]/25"
        : "from-teal-500/25";

  return (
    <motion.div
      initial={{ opacity: 0, y: 52, scale: 0.93 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px", amount: 0.12 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 26,
        mass: 0.88,
        delay: index * 0.12,
      }}
      whileHover={
        finePointerHover
          ? {
              y: -8,
              transition: { type: "spring", stiffness: 420, damping: 24 },
            }
          : undefined
      }
      className={`group gb-card-shine relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.035] p-6 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.9)] transition-shadow duration-500 hover:border-emerald-400/20 ${ring}`}
    >
      <div
        className={`pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-gradient-to-br ${glow} to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
      />
      <div className="relative z-[2]">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">{desc}</p>
        <ul className="mt-5 space-y-2.5 text-sm text-zinc-300">
          {items.map((it, i) => (
            <motion.li
              key={it}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.9 }}
              transition={{
                delay: index * 0.12 + 0.22 + i * 0.06,
                duration: 0.45,
                ease: easeOutExpo,
              }}
              className="flex items-start gap-2"
            >
              <motion.span
                className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#34d399] to-emerald-200/80"
                initial={false}
                whileHover={finePointerHover ? { scale: 1.45 } : undefined}
              />
              <span>{it}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function ProjectCard({
  name,
  result,
  tech,
  delay,
  index = 0,
}: {
  name: string;
  result: string;
  tech: string;
  delay: number;
  index?: number;
}) {
  const finePointerHover = useFinePointerHover();
  return (
    <motion.div
      initial={{ opacity: 0, y: 48, scale: 0.93 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 27,
        mass: 0.9,
        delay: delay + index * 0.03,
      }}
      whileHover={
        finePointerHover
          ? {
              y: -6,
              transition: { type: "spring", stiffness: 380, damping: 22 },
            }
          : undefined
      }
      className="group gb-card-shine relative overflow-hidden rounded-3xl border border-white/[0.09] bg-gradient-to-b from-white/[0.08] to-transparent p-6 shadow-[0_20px_70px_-50px_rgba(52,211,153,0.15)] transition-shadow duration-500 hover:border-emerald-400/25 hover:shadow-[0_28px_90px_-48px_rgba(52,211,153,0.18)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(800px_220px_at_50%_-10%,rgba(255,255,255,0.08),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-[2]">
        <p className="text-base font-semibold tracking-tight">{name}</p>
        <p className="mt-2 text-sm text-zinc-400">{result}</p>
        <div className="mt-5 inline-flex rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] text-zinc-400 transition-colors duration-300 group-hover:border-emerald-500/25 group-hover:text-zinc-300">
          {tech}
        </div>
      </div>
    </motion.div>
  );
}

function ProjectTrustPanel() {
  const assurances = [
    {
      label: "Before build",
      title: "Scope is locked first",
      desc: "You get a clear deliverables list, timeline, and quote before we write production code.",
    },
    {
      label: "During build",
      title: "Progress stays visible",
      desc: "We share updates, previews, and blockers early, so there are no surprise turns near launch.",
    },
    {
      label: "After launch",
      title: "Handoff is included",
      desc: "Docs, deployment notes, and support are part of the delivery, not an extra mystery step.",
    },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px", amount: 0.2 }}
      transition={{ duration: 0.58, ease: easeOutExpo }}
      className="mt-6 overflow-hidden rounded-3xl border border-emerald-400/15 bg-emerald-500/[0.045] p-5 shadow-[0_24px_80px_-60px_rgba(52,211,153,0.2)]"
    >
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.6fr] lg:items-center">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-300/90">
            Service assurance
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Proof is not just the final screen.
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Every project is delivered with a simple operating rhythm: agreed scope, visible
            progress, clean launch, and support after handoff.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {assurances.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.48, delay: 0.08 + i * 0.06, ease: easeOutExpo }}
              className="rounded-2xl border border-white/[0.08] bg-black/20 p-4"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                {item.label}
              </p>
              <p className="mt-2 text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Mini({ title, desc }: { title: string; desc: string }) {
  const finePointerHover = useFinePointerHover();
  return (
    <motion.div
      whileHover={
        finePointerHover
          ? {
              y: -3,
              transition: { type: "spring", stiffness: 400, damping: 24 },
            }
          : undefined
      }
      className="rounded-2xl border border-white/[0.08] bg-black/25 p-5 transition-colors duration-300 hover:border-emerald-400/25 hover:bg-white/[0.03]"
    >
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm text-zinc-400">{desc}</p>
    </motion.div>
  );
}

function Input({
  label,
  name,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="text-zinc-400">{label}</span>
      <input
        name={name}
        placeholder={placeholder}
        type={type}
        className="rounded-2xl border border-white/[0.1] bg-black/40 px-4 py-3 text-zinc-50 placeholder:text-zinc-600 focus:border-[#34d399]/50 focus:outline-none focus:ring-2 focus:ring-[#34d399]/20"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  placeholder: string;
  defaultValue?: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="text-zinc-400">{label}</span>
      <textarea
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="min-h-[7.5rem] rounded-2xl border border-white/[0.1] bg-black/40 px-4 py-3 text-zinc-50 placeholder:text-zinc-600 focus:border-emerald-400/45 focus:outline-none focus:ring-2 focus:ring-emerald-400/15"
      />
    </label>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  const finePointerHover = useFinePointerHover();
  return (
    <motion.div
      variants={fadeUp}
      whileHover={
        finePointerHover
          ? {
              y: -4,
              transition: { type: "spring", stiffness: 420, damping: 22 },
            }
          : undefined
      }
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 text-center shadow-[0_12px_40px_-28px_rgba(0,0,0,0.6)] transition-shadow duration-300 hover:border-emerald-500/20"
    >
      <div className={`pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r ${accent} via-transparent to-transparent`} />
      <p className="text-[11px] uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </motion.div>
  );
}

function MagneticButton({
  href,
  children,
  primary,
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
}) {
  const finePointerHover = useFinePointerHover();
  const base =
    "group/btn relative inline-flex items-center justify-center overflow-hidden rounded-2xl px-6 py-3.5 text-sm font-semibold transition-colors";
  const cls = primary
    ? `${base} bg-[#34d399] text-zinc-950 shadow-[0_0_44px_-14px_rgba(52,211,153,0.55)]`
    : `${base} border border-emerald-500/20 bg-white/[0.04] text-white hover:border-[#34d399]/35 hover:bg-emerald-500/[0.06]`;

  return (
    <motion.a
      href={href}
      className={cls}
      whileHover={finePointerHover ? { scale: 1.04, transition: springReveal } : undefined}
      whileTap={{ scale: 0.97 }}
    >
      {primary && (
        <span className="absolute inset-0 bg-gradient-to-r from-emerald-100/80 via-white to-teal-100/80 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
      )}
      <span className="relative z-10">{children}</span>
    </motion.a>
  );
}

/**
 * Contact form — POSTs to /api/contact (Resend email) and falls back to
 * WhatsApp if the server isn't configured or if the request fails.
 * Honeypot field (`company`) catches simple bots; real users never fill it.
 */
/**
 * Maps tier slug (from ?tier=... URL param) to a pre-filled details message.
 * Lets the pricing page deep-link visitors into the contact form with context.
 */
const TIER_PREFILL: Record<string, string> = {
  starter:
    "Hi! I'm interested in the Starter package. Here's a quick overview of what I'm thinking:\n\n",
  growth:
    "Hi! I'm interested in the Growth package. Here's the project:\n\n",
  custom:
    "Hi! I'd like to discuss a Custom engagement. Quick context:\n\n",
};

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent-email" | "sent-whatsapp">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);
  const finePointerHover = useFinePointerHover();

  // Read the ?tier=... URL param once on mount and use it as the initial
  // textarea value. Lazy initializer keeps this out of useEffect.
  const [prefillDetails] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    const tier = params.get("tier");
    return tier && TIER_PREFILL[tier] ? TIER_PREFILL[tier] : "";
  });

  // If a tier prefill was applied, focus the textarea and place cursor at end.
  useEffect(() => {
    if (!prefillDetails) return;
    const el = document.querySelector<HTMLTextAreaElement>('textarea[name="details"]');
    if (el) {
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, [prefillDetails]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot — bots fill this, humans don't see it. Silently succeed.
    if ((data.get("company") as string)?.trim()) {
      setStatus("sent-email");
      return;
    }

    const name = (data.get("name") as string)?.trim() ?? "";
    const email = (data.get("email") as string)?.trim() ?? "";
    const budget = (data.get("budget") as string)?.trim() ?? "";
    const details = (data.get("details") as string)?.trim() ?? "";

    if (!name || !email || !details) {
      setError("Please fill in name, email, and project details.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("That email address looks off. Mind double-checking?");
      return;
    }

    setStatus("sending");

    // Build the WhatsApp fallback message ahead of time so we can use it
    // if the API request fails or isn't configured yet.
    const whatsappMessage = [
      `Hi GreenChronix! New project inquiry:`,
      ``,
      `Name: ${name}`,
      `Email: ${email}`,
      budget ? `Budget: ${budget}` : null,
      ``,
      `Details:`,
      details,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, budget, details, company: "" }),
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok && json.ok) {
        setStatus("sent-email");
        form.reset();
        return;
      }

      // API said no — fall back to WhatsApp automatically
      if (json.fallback === "whatsapp" || res.status === 503 || res.status === 502) {
        window.open(buildWhatsAppUrl(whatsappMessage), "_blank", "noopener,noreferrer");
        setStatus("sent-whatsapp");
        form.reset();
        return;
      }

      // Real validation error — show it
      setError(json.error || "Something went wrong. Please try again.");
      setStatus("idle");
    } catch {
      // Network failure — fall back to WhatsApp so the user isn't stuck
      window.open(buildWhatsAppUrl(whatsappMessage), "_blank", "noopener,noreferrer");
      setStatus("sent-whatsapp");
      form.reset();
    }
  };

  if (status === "sent-email") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: easeOutExpo }}
        className="grid place-items-center gap-4 py-8 text-center"
      >
        <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 text-2xl text-[#34d399]">
          ✓
        </div>
        <div>
          <p className="text-lg font-semibold text-white">Message sent</p>
          <p className="mt-2 text-sm text-zinc-400">
            Thanks. We&rsquo;ll reply within 24 hours. Need something faster?{" "}
            <a
              href={buildWhatsAppUrl("Hi GreenChronix! Just sent the form, wanted to follow up.")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#34d399] hover:underline"
            >
              Ping us on WhatsApp
            </a>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 text-xs text-zinc-500 hover:text-zinc-300"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  if (status === "sent-whatsapp") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: easeOutExpo }}
        className="grid place-items-center gap-4 py-8 text-center"
      >
        <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 text-2xl text-[#34d399]">
          ✓
        </div>
        <div>
          <p className="text-lg font-semibold text-white">WhatsApp opened in a new tab</p>
          <p className="mt-2 text-sm text-zinc-400">
            Hit send there and we&rsquo;ll reply within 24 hours. Didn&rsquo;t open?{" "}
            <a
              href={buildWhatsAppUrl("Hi GreenChronix! I tried the form but it didn't open WhatsApp.")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#34d399] hover:underline"
            >
              Click here
            </a>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 text-xs text-zinc-500 hover:text-zinc-300"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  const isSending = status === "sending";

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4">
        <Input label="Name" name="name" placeholder="Your name" />
        <Input label="Email" name="email" placeholder="your@email.com" type="email" />
        <Input label="Budget (optional)" name="budget" placeholder="₹25k · $1.2k · Let's talk" />
        <TextArea
          key={prefillDetails || "empty"}
          label="Project details"
          name="details"
          placeholder="Goals, timeline, links…"
          defaultValue={prefillDetails}
        />

        {/* Honeypot — hidden from humans, visible to bots */}
        <label
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
          tabIndex={-1}
        >
          <span>Company (leave blank)</span>
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>

        {error && (
          <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </p>
        )}

        <motion.button
          type="submit"
          disabled={isSending}
          className="group relative mt-2 overflow-hidden rounded-2xl bg-[#34d399] px-5 py-3.5 text-sm font-semibold text-zinc-950 disabled:opacity-70"
          whileHover={
            !isSending && finePointerHover ? { scale: 1.02, transition: springReveal } : undefined
          }
          whileTap={!isSending ? { scale: 0.98 } : undefined}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isSending ? (
              <>
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-zinc-950/30 border-t-zinc-950" />
                Sending…
              </>
            ) : (
              <>
                Send message <span aria-hidden>→</span>
              </>
            )}
          </span>
          <motion.span
            className="absolute inset-0 z-0 bg-gradient-to-r from-emerald-200 via-white to-teal-200 opacity-0 transition-opacity group-hover:opacity-100"
            initial={false}
          />
        </motion.button>

        <div className="flex items-center justify-between gap-3 text-xs text-zinc-500">
          <span>We reply within 24 hours.</span>
          <a
            href={buildWhatsAppUrl("Hi GreenChronix! I'd like to chat about a project.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-[#34d399] hover:text-emerald-200 transition-colors"
          >
            Or chat on WhatsApp <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </form>
  );
}
