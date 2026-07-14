'use client'

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from 'react'

/**
 * The actual uploaded GreenChronix lockup. The PNG sits on pure black, so
 * we key the black out to real transparency on a canvas once at mount.
 * (CSS mix-blend-screen is unreliable here: the overlay's stacking context
 * stops the blend from reaching the WebGL canvas behind it, leaving a
 * visible black rectangle.)
 */
export function Logo({ className }: { className?: string }) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = img.naturalWidth
      c.height = img.naturalHeight
      const ctx = c.getContext('2d')
      if (!ctx) return
      ctx.drawImage(img, 0, 0)
      const data = ctx.getImageData(0, 0, c.width, c.height)
      const px = data.data
      for (let i = 0; i < px.length; i += 4) {
        // Luminance-based alpha: black background becomes transparent,
        // the bright lettering stays fully opaque.
        const lum = Math.max(px[i], px[i + 1], px[i + 2])
        px[i + 3] = Math.min(255, lum * 2.2)
      }
      ctx.putImageData(data, 0, 0)
      setSrc(c.toDataURL('image/png'))
    }
    img.src = '/logo-full.png'
  }, [])

  return (
    <span className={`inline-flex h-8 items-center md:h-9 ${className ?? ''}`}>
      {src ? (
        <img
          src={src || '/placeholder.svg'}
          alt="GreenChronix"
          className="h-8 w-auto md:h-9"
          draggable={false}
        />
      ) : (
        <span className="font-mono text-sm font-semibold tracking-[0.2em] text-foreground">
          GREENCHRONIX
        </span>
      )}
    </span>
  )
}
