'use client'

import dynamic from 'next/dynamic'
import { Overlay } from './Overlay'

const Experience = dynamic(
  () => import('./Experience').then((m) => m.Experience),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <p className="font-mono text-[11px] tracking-[0.24em] text-muted uppercase">
          Calibrating…
        </p>
      </div>
    ),
  },
)

export function OrbitSite() {
  return (
    <>
      <Experience />
      <Overlay />
      {/* Scroll runway: 8 scenes × 250vh gives the camera room to travel */}
      <div className="h-[2000vh]" aria-hidden="true" />
    </>
  )
}
