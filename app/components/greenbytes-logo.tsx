"use client";

import Image from "next/image";
import { useState } from "react";

/** Put your exported logo here (recommended: PNG or SVG with transparent background). */
export const GREENBYTES_LOGO_SRC = "/greenbytes-logo.png";

type Props = {
  className?: string;
  priority?: boolean;
};

/**
 * Renders your real brand asset from /public — no imitation vector art.
 * If the file path is wrong, you’ll see a simple text label until it’s fixed.
 */
export function GreenBytesLogo({
  className = "h-14 w-auto max-w-[min(100%,280px)] md:h-16",
  priority,
}: Props) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <span
        className={`inline-flex items-center text-sm font-bold tracking-tight text-[#34d399] ${className}`}
      >
        GreenBytes
      </span>
    );
  }

  return (
    <Image
      src={GREENBYTES_LOGO_SRC}
      alt="GreenBytes — Smart tech, greener future"
      width={560}
      height={180}
      priority={priority}
      className={`object-contain object-left ${className}`}
      sizes="(max-width: 768px) 200px, 280px"
      onError={() => setBroken(true)}
    />
  );
}

/** Header bar: tighter max width so nav stays balanced on small screens */
export function GreenBytesMark({
  className = "h-8 w-auto max-w-[160px] sm:max-w-[200px] md:h-10 md:max-w-[240px]",
  priority = true,
}: Props) {
  return <GreenBytesLogo className={className} priority={priority} />;
}
