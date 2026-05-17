"use client";

import Image from "next/image";
import { useState } from "react";
import { siteConfig } from "../lib/site";

/**
 * Brand mark for GreenChronix.
 *
 * The current source asset is designed for the site's dark UI, so it renders
 * directly without color filters.
 */
type Props = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({
  className = "h-14 w-[min(100%,300px)]",
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
      alt={`${siteConfig.name} | ${siteConfig.tagline}`}
      width={1536}
      height={1024}
      preload={priority}
      className={`object-cover object-center ${className}`}
      sizes="(max-width: 768px) 220px, 320px"
      onError={() => setBroken(true)}
    />
  );
}

/** Header bar variant: tighter max width so nav stays balanced on small screens. */
export function BrandMark({
  className = "h-10 w-[170px] sm:h-11 sm:w-[210px] md:w-[260px]",
  priority = true,
}: Props) {
  return <BrandLogo className={className} priority={priority} />;
}

/* Legacy exports — kept so existing imports across the codebase keep working
   after the GreenBytes → GreenChronix rename. New code should use BrandLogo / BrandMark. */
export const GreenBytesLogo = BrandLogo;
export const GreenBytesMark = BrandMark;
