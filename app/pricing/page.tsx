import type { Metadata } from "next";
import { siteConfig } from "../lib/site";
import { SiteShell } from "../components/site-shell";
import { PricingClient } from "./pricing-client";

export const metadata: Metadata = {
  title: "Pricing",
  description: `Transparent packages from ${siteConfig.name}. Starter, Growth, and Custom tiers with clear scope, fair timelines, and real outcomes.`,
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <SiteShell>
      <PricingClient />
    </SiteShell>
  );
}
