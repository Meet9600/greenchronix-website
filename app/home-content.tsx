"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { GreenBytesLogo, GreenBytesMark } from "./components/greenbytes-logo";
import { buildWhatsAppUrl, getBookingUrl, siteConfig } from "./lib/site";

const easeOutExpo = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOutExpo },
  },
};

const stagger = {
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
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

export default function HomeContent() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.25]);
  const scaleSm = useSpring(useTransform(scrollYProgress, [0, 1], [1, 0.98]), {
    stiffness: 120,
    damping: 28,
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#040806] text-zinc-50">
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
            href="#"
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
          ref={heroRef}
          style={{ y: heroY, opacity: heroOpacity, scale: scaleSm }}
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
                <GreenBytesLogo priority className="h-12 w-auto max-w-[240px] sm:h-14" />
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
                  — lean IT that ships fast.
                </span>
              </motion.h1>

              <motion.p variants={fadeUp} className="mt-6 max-w-xl text-pretty text-lg text-zinc-400">
                GreenBytes builds websites, apps, automation, and data tools with clean code, honest
                timelines, and long-term care — so your stack stays efficient, not bloated.
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
                <Stat label="Delivery" value="7–14 days" accent="from-emerald-400/40" />
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
          subtitle="Focused packages. Clear outcomes. Less waste — more value per byte."
        >
          <div className="grid gap-5 md:grid-cols-3">
            <HoverLiftCard
              title="Websites & Web Apps"
              desc="Landing pages, portfolios, SaaS shells, internal tools — fast, responsive, and built to scale."
              items={["Responsive UI & motion polish", "SEO + performance budget", "Clean handoff"]}
              hue="emerald"
            />
            <HoverLiftCard
              title="Data & Automation"
              desc="Python pipelines, reporting, and glue code that turns messy workflows into one click."
              items={["Time saved, measured", "Docs you can actually read", "Error handling that matters"]}
              hue="green"
            />
            <HoverLiftCard
              title="Deploy & Maintain"
              desc="Ship to production, wire domains/SSL, and keep things updated while you focus on the business."
              items={["Vercel / cloud-ready", "Monitoring & fixes", "Monthly care plans"]}
              hue="teal"
            />
          </div>
        </SectionMotion>

        <SectionMotion id="projects" title="Projects" subtitle="Swap in your real screenshots — even demos count.">
          <div className="grid gap-5 md:grid-cols-3">
            <ProjectCard
              name="Restaurant landing page"
              result="More calls & inquiries"
              tech="Next.js · Tailwind · Motion"
              delay={0}
            />
            <ProjectCard
              name="Invoice automation"
              result="Saved 6+ hours weekly"
              tech="Python · CSV/Sheets"
              delay={0.08}
            />
            <ProjectCard
              name="Sales dashboard"
              result="Faster weekly reviews"
              tech="BI stack · SQL"
              delay={0.16}
            />
          </div>
        </SectionMotion>

        <SectionMotion id="about" title="About" subtitle="Trust is built with proof, process, and communication.">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: easeOutExpo }}
            className="relative overflow-hidden rounded-3xl border border-emerald-500/10 bg-gradient-to-br from-emerald-500/[0.06] to-transparent p-8 shadow-[0_0_80px_-40px_rgba(52,211,153,0.22)]"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-teal-500/15 blur-3xl" />
            <p className="relative max-w-3xl text-lg text-zinc-300">
              Hi! We&rsquo;re{" "}
              <span className="font-semibold text-white">{siteConfig.founders.primary}</span> and{" "}
              <span className="font-semibold text-white">{siteConfig.founders.secondary}</span>{" "}
              &mdash; GreenBytes. We ship modern web experiences, automate repetitive work, and
              visualize what matters, with the clarity and footprint of a small team.
            </p>
            <div className="relative mt-8 grid gap-4 md:grid-cols-3">
              <Mini
                title="Crystal-clear updates"
                desc="Weekly notes, realistic timelines, and zero mystery charges."
              />
              <Mini title="Quality that lasts" desc="Readable code, sensible architecture, real docs." />
              <Mini title="Post-launch care" desc="We stick around for fixes, tuning, and iteration." />
            </div>
          </motion.div>
        </SectionMotion>

        <SectionMotion id="contact" title="Contact" subtitle="Tell us what you&rsquo;re building. We reply within 24 hours.">
          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55 }}
              className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-sm"
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
                      href={buildWhatsAppUrl("Hi GreenBytes! I'd like to chat about a project.")}
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
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55 }}
              className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-sm"
            >
              <ContactForm />
            </motion.div>
          </div>
        </SectionMotion>

        <footer className="mx-auto max-w-6xl border-t border-white/[0.06] px-6 py-12 text-sm text-zinc-500">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <p>
              © {new Date().getFullYear()} GreenBytes. Smart tech, greener future — built with Next.js
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
        </footer>
      </main>
    </div>
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
        transition={{ duration: 0.9, ease: easeOutExpo }}
        className="relative overflow-hidden rounded-[28px] border border-white/[0.1] bg-gradient-to-b from-white/[0.08] to-transparent p-px shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_32px_80px_-24px_rgba(0,0,0,0.8)]"
      >
        <div className="rounded-[27px] bg-[#060d0b]/92 p-6 backdrop-blur-xl">
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
                s: "15 min — goals, scope, budget band",
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
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.12, duration: 0.45 }}
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
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <p className="text-sm font-semibold text-white">Ready when you are</p>
            <p className="mt-1 text-sm text-zinc-400">
              Tell us what success looks like &mdash; we&rsquo;ll mirror it in the roadmap.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <motion.a
                href={getBookingUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#34d399] px-4 py-2 text-xs font-semibold text-zinc-950"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
              >
                Book a call <span aria-hidden>→</span>
              </motion.a>
              <motion.a
                href="#contact"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6ee7b7] hover:text-[#34d399]"
                whileHover={{ x: 4 }}
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
  return (
    <section id={id} className="relative mx-auto max-w-6xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.55, ease: easeOutExpo }}
        className="mb-10 max-w-2xl"
      >
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
        <p className="mt-3 text-lg text-zinc-400">{subtitle}</p>
      </motion.div>
      {children}
    </section>
  );
}

function HoverLiftCard({
  title,
  desc,
  items,
  hue,
}: {
  title: string;
  desc: string;
  items: string[];
  hue: "emerald" | "green" | "teal";
}) {
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
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: easeOutExpo }}
      whileHover={{ y: -6 }}
      className={`group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.9)] transition-shadow duration-300 hover:border-white/[0.14] hover:shadow-2xl ${ring}`}
    >
      <div
        className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${glow} to-transparent opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100`}
      />
      <div className="relative">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">{desc}</p>
        <ul className="mt-5 space-y-2.5 text-sm text-zinc-300">
          {items.map((it) => (
            <li key={it} className="flex items-start gap-2">
              <motion.span
                className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#34d399] to-emerald-200/80"
                initial={false}
                whileHover={{ scale: 1.4 }}
              />
              <span>{it}</span>
            </li>
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
}: {
  name: string;
  result: string;
  tech: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: easeOutExpo }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent p-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(800px_200px_at_50%_0%,rgba(255,255,255,0.06),transparent)] opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative">
        <p className="text-base font-semibold">{name}</p>
        <p className="mt-2 text-sm text-zinc-400">{result}</p>
        <div className="mt-5 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-zinc-400">
          {tech}
        </div>
      </div>
    </motion.div>
  );
}

function Mini({ title, desc }: { title: string; desc: string }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-white/[0.08] bg-black/25 p-5 transition-colors hover:border-white/[0.14]"
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
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 text-center"
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
  const base =
    "group/btn relative inline-flex items-center justify-center overflow-hidden rounded-2xl px-6 py-3.5 text-sm font-semibold transition-colors";
  const cls = primary
    ? `${base} bg-[#34d399] text-zinc-950 shadow-[0_0_44px_-14px_rgba(52,211,153,0.55)]`
    : `${base} border border-emerald-500/20 bg-white/[0.04] text-white hover:border-[#34d399]/35 hover:bg-emerald-500/[0.06]`;

  return (
    <motion.a href={href} className={cls} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
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
      setError("That email address looks off — mind double-checking?");
      return;
    }

    setStatus("sending");

    // Build the WhatsApp fallback message ahead of time so we can use it
    // if the API request fails or isn't configured yet.
    const whatsappMessage = [
      `Hi GreenBytes! New project inquiry:`,
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
            Thanks &mdash; we&rsquo;ll reply within 24 hours. Need something faster?{" "}
            <a
              href={buildWhatsAppUrl("Hi GreenBytes! Just sent the form, wanted to follow up.")}
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
              href={buildWhatsAppUrl("Hi GreenBytes! I tried the form but it didn't open WhatsApp.")}
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
          whileHover={!isSending ? { scale: 1.02 } : undefined}
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
            href={buildWhatsAppUrl("Hi GreenBytes! I'd like to chat about a project.")}
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
