"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";
import { GreenBytesMark } from "./greenbytes-logo";
import { siteConfig } from "../lib/site";

const easeOutExpo = [0.22, 1, 0.36, 1] as const;

/**
 * Shared shell used by inner pages (Pricing, Blog, 404).
 * The home page uses its own version with the scroll-driven hero parallax,
 * so this is kept lean for static routes.
 */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#040806] text-zinc-50">
      <AmbientBackground />
      <GrainOverlay />
      <SiteHeader />
      <main className="relative z-10 pt-28">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function SiteHeader() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: easeOutExpo }}
      className="fixed inset-x-0 top-0 z-50 border-b border-emerald-500/[0.08] bg-[#040806]/70 backdrop-blur-xl backdrop-saturate-150"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 400, damping: 22 }}>
          <Link href="/" className="min-w-0 shrink">
            <GreenBytesMark />
          </Link>
        </motion.div>

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
          href="/#contact"
          className="group relative overflow-hidden rounded-full bg-[#34d399] px-5 py-2.5 text-xs font-semibold text-zinc-950 shadow-[0_0_36px_-10px_rgba(52,211,153,0.65)]"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative z-10">Request a quote</span>
          <span className="absolute inset-0 z-0 bg-gradient-to-r from-emerald-200 via-white to-emerald-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </motion.a>
      </nav>
    </motion.header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative z-10 mx-auto max-w-6xl border-t border-white/[0.06] px-6 py-12 text-sm text-zinc-500">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. {siteConfig.tagline} Built with
          Next.js & motion.
        </p>
        <div className="flex flex-wrap gap-6 text-xs">
          <Link href="/#services" className="transition-colors hover:text-[#34d399]">
            Services
          </Link>
          <Link href="/pricing" className="transition-colors hover:text-[#34d399]">
            Pricing
          </Link>
          <Link href="/blog" className="transition-colors hover:text-[#34d399]">
            Blog
          </Link>
          <Link href="/#contact" className="transition-colors hover:text-[#34d399]">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}

function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="hero-grid absolute inset-0 opacity-[0.35]" />
      <motion.div
        className="absolute -left-1/4 top-[-20%] h-[520px] w-[520px] rounded-full bg-emerald-500/22 blur-[120px]"
        animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-1/4 top-[10%] h-[480px] w-[480px] rounded-full bg-[#34d399]/18 blur-[120px]"
        animate={{ x: [0, -50, 0], y: [0, 60, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
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
