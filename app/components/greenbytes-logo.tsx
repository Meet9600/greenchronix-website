"use client";

import Image from "next/image";
import { useState } from "react";
import { siteConfig } from "../lib/site";

/**
 * Brand mark for GreenChronix.
 *
 * The source asset has a white background and black "Chronix" text, which is
 * unreadable on the dark site. We apply a CSS filter that:
 *   - inverts lightness (black → white, white → near-black to blend with bg)
 *   - hue-rotates 180° so the GREEN parts of the logo stay green after invert,
 *     instead of becoming magenta (which is what a plain invert would do)
 *
 * Net effect: green stays green, black "Chronix" becomes white, white bg
 * disappears. If you later upload a transparent-background version of the
 * logo, set FILTER_CLASS to "" so the image renders as-is.
 */
type Props = {
  className?: string;
  priority?: boolean;
};

// `mix-blend-screen` blends the (now-dark) inverted background into the
// page background so the logo appears to float on the dark hero.
const FILTER_CLASS = "[filter:invert(1)_hue-rotate(180deg)] mix-blend-screen";

export function BrandLogo({
  className = "h-14 w-auto max-w-[min(100%,280px)] md:h-16",
  priority,
}: Props) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <span
        className={`inline-flex items-center text-sm font-bold tracking-tight text-[#34d399] ${className}`}
      >
        {siteConfig.name}
      </span>
    );
  }

  return (
    <Image
      src={siteConfig.logo}
      alt={`${siteConfig.name} — ${siteConfig.tagline}`}
      width={1536}
      height={1024}
      priority={priority}
      className={`object-contain object-left ${FILTER_CLASS} ${className}`}
      sizes="(max-width: 768px) 200px, 280px"
      onError={() => setBroken(true)}
    />
  );
}

/** Header bar variant: tighter max width so nav stays balanced on small screens. */
export function BrandMark({
  className = "h-8 w-auto max-w-[160px] sm:max-w-[200px] md:h-10 md:max-w-[240px]",
  priority = true,
}: Props) {
  return <BrandLogo className={className} priority={priority} />;
}

/* Legacy exports — kept so existing imports across the codebase keep working
   after the GreenBytes → GreenChronix rename. New code should use BrandLogo / BrandMark. */
export const GreenBytesLogo = BrandLogo;
export const GreenBytesMark = BrandMark;
