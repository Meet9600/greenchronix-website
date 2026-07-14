'use client'

import { useEffect, useRef, useState } from 'react'
import { progressStore, sceneCenter, scenePresence, SCENE_COUNT } from './progress'
import { Logo } from './Logo'
import {
  SCENES,
  HERO,
  CORE,
  SERVICES,
  PIPELINE,
  PROJECTS,
  ARCHITECTURE,
  PARTNERSHIP,
  CONTACT,
} from './copy'

function scrollToScene(i: number) {
  const max = document.documentElement.scrollHeight - window.innerHeight
  window.scrollTo({ top: sceneCenter(i) * max, behavior: 'smooth' })
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] font-medium tracking-[0.22em] text-accent uppercase">
      {children}
    </p>
  )
}

function SceneTag({ index, label }: { index: string; label: string }) {
  return (
    <p className="font-mono text-[11px] tracking-[0.22em] text-muted">
      {index} / {label}
    </p>
  )
}

export function Overlay() {
  const blockRefs = useRef<(HTMLDivElement | null)[]>([])
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)

  // rAF loop: drive block opacity + active index straight from the store
  useEffect(() => {
    let rafId: number
    const tick = () => {
      const p = progressStore.value
      for (let i = 0; i < SCENE_COUNT; i++) {
        const el = blockRefs.current[i]
        if (!el) continue
        const presence = scenePresence(i, p)
        el.style.opacity = String(presence)
        el.style.transform = `translateY(${(1 - presence) * 18}px)`
        el.style.pointerEvents = presence > 0.55 ? 'auto' : 'none'
        el.style.visibility = presence <= 0.01 ? 'hidden' : 'visible'
      }
      let nearest = 0
      let best = Infinity
      for (let i = 0; i < SCENE_COUNT; i++) {
        const d = Math.abs(p - sceneCenter(i))
        if (d < best) {
          best = d
          nearest = i
        }
      }
      if (nearest !== activeRef.current) {
        activeRef.current = nearest
        setActive(nearest)
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const block = (i: number, className: string, children: React.ReactNode) => (
    <div
      ref={(el) => {
        blockRefs.current[i] = el
      }}
      className={`orbit-copy absolute will-change-transform ${className}`}
      style={{ opacity: i === 0 ? 1 : 0 }}
    >
      {children}
    </div>
  )

  return (
    <div className="fixed inset-0 z-10 pointer-events-none">
      {/* ---- Top navigation ---- */}
      <header className="pointer-events-auto absolute inset-x-0 top-0 flex items-center justify-between px-6 py-5 md:px-10">
        <button
          type="button"
          onClick={() => scrollToScene(0)}
          className="text-foreground transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-accent"
          aria-label="GreenChronix, back to start"
        >
          <Logo />
        </button>
        <button
          type="button"
          onClick={() => scrollToScene(7)}
          className="rounded-full border border-line bg-panel px-5 py-2 font-mono text-[11px] font-semibold tracking-[0.18em] text-foreground uppercase backdrop-blur-sm transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
        >
          Start a project
        </button>
      </header>

      {/* ---- Scene index rail ---- */}
      <nav
        aria-label="Journey scenes"
        className="pointer-events-auto absolute top-1/2 right-5 hidden -translate-y-1/2 flex-col items-end gap-3 md:flex"
      >
        {SCENES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollToScene(i)}
            aria-label={`Go to scene ${s.index}: ${s.label}`}
            aria-current={active === i ? 'true' : undefined}
            className="group flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-accent"
          >
            <span
              className={`font-mono text-[10px] tracking-[0.2em] transition-colors ${
                active === i ? 'text-accent' : 'text-muted/0 group-hover:text-muted'
              }`}
            >
              {s.label}
            </span>
            <span
              className={`block h-px transition-all duration-300 ${
                active === i ? 'w-8 bg-accent' : 'w-4 bg-muted/50'
              }`}
            />
          </button>
        ))}
      </nav>

      {/* ---- 01 Arrival ---- */}
      {block(
        0,
        'inset-x-0 bottom-0 top-0 flex flex-col items-center justify-center px-6 text-center',
        <>
          <div className="flex max-w-2xl flex-col items-center gap-5 pt-[38vh]">
            <Eyebrow>{HERO.eyebrow}</Eyebrow>
            <h1 className="text-4xl font-light tracking-tight text-balance md:text-6xl">
              {HERO.title}
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-muted md:text-base">
              {HERO.sub}
            </p>
          </div>
          <p className="absolute bottom-8 font-mono text-[11px] tracking-[0.22em] text-muted uppercase">
            {HERO.scrollHint} ↓
          </p>
        </>,
      )}

      {/* ---- 02 Core ---- */}
      {block(
        1,
        'left-6 top-1/2 -translate-y-1/2 max-w-md md:left-14',
        <div className="flex flex-col gap-4">
          <SceneTag index="02" label="THE CORE" />
          <Eyebrow>{CORE.eyebrow}</Eyebrow>
          <h2 className="text-3xl font-light tracking-tight text-balance md:text-4xl">
            {CORE.title}
          </h2>
          <p className="text-sm leading-relaxed text-muted">{CORE.body}</p>
          <dl className="mt-2 flex gap-8">
            {CORE.stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <dt className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
                  {s.label}
                </dt>
                <dd className="text-lg font-medium">
                  {s.value}{' '}
                  <span className="font-mono text-[10px] text-accent">{s.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>,
      )}

      {/* ---- 03 Network / Services ---- */}
      {block(
        2,
        'right-6 top-1/2 -translate-y-1/2 w-full max-w-md md:right-24',
        <div className="flex flex-col gap-4">
          <SceneTag index="03" label="CAPABILITIES" />
          <Eyebrow>{SERVICES.eyebrow}</Eyebrow>
          <h2 className="text-3xl font-light tracking-tight text-balance md:text-4xl">
            {SERVICES.title}
          </h2>
          <ul className="mt-1 flex flex-col divide-y divide-line">
            {SERVICES.items.map((s, i) => (
              <li key={s.name} className="flex items-baseline gap-4 py-2.5">
                <span className="font-mono text-[10px] text-accent">
                  0{i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">{s.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>,
      )}

      {/* ---- 04 Pipeline / Process ---- */}
      {block(
        3,
        'left-6 top-1/2 -translate-y-1/2 max-w-md md:left-14',
        <div className="flex flex-col gap-4">
          <SceneTag index="04" label="THE PIPELINE" />
          <Eyebrow>{PIPELINE.eyebrow}</Eyebrow>
          <h2 className="text-3xl font-light tracking-tight text-balance md:text-4xl">
            {PIPELINE.title}
          </h2>
          <ol className="mt-1 flex flex-col gap-4">
            {PIPELINE.steps.map((s, i) => (
              <li key={s.name} className="flex gap-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/40 font-mono text-[10px] text-accent">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>,
      )}

      {/* ---- 05 Outcomes / Projects ---- */}
      {block(
        4,
        'right-6 top-1/2 -translate-y-1/2 w-full max-w-lg md:right-24',
        <div className="flex flex-col gap-4">
          <SceneTag index="05" label="OUTCOMES" />
          <Eyebrow>{PROJECTS.eyebrow}</Eyebrow>
          <h2 className="text-3xl font-light tracking-tight text-balance md:text-4xl">
            {PROJECTS.title}
          </h2>
          <ul className="mt-1 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {PROJECTS.items.map((p) => (
              <li key={p.name} className="border-l border-accent/30 pl-3">
                <p className="text-sm font-medium">{p.name}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">{p.outcome}</p>
                <p className="mt-1 font-mono text-[10px] tracking-wide text-accent/80">
                  {p.stack}
                </p>
              </li>
            ))}
          </ul>
        </div>,
      )}

      {/* ---- 06 Architecture / About ---- */}
      {block(
        5,
        'left-6 top-1/2 -translate-y-1/2 max-w-md md:left-14',
        <div className="flex flex-col gap-4">
          <SceneTag index="06" label="ARCHITECTURE" />
          <Eyebrow>{ARCHITECTURE.eyebrow}</Eyebrow>
          <h2 className="text-3xl font-light tracking-tight text-balance md:text-4xl">
            {ARCHITECTURE.title}
          </h2>
          <p className="text-sm leading-relaxed text-muted">{ARCHITECTURE.body}</p>
          <ul className="mt-1 flex flex-col gap-3">
            {ARCHITECTURE.values.map((v) => (
              <li key={v.name}>
                <p className="text-sm font-medium">{v.name}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">{v.detail}</p>
              </li>
            ))}
          </ul>
        </div>,
      )}

      {/* ---- 07 Partnership ---- */}
      {block(
        6,
        'right-6 top-1/2 -translate-y-1/2 max-w-md md:right-24',
        <div className="flex flex-col gap-4">
          <SceneTag index="07" label="PARTNERSHIP" />
          <Eyebrow>{PARTNERSHIP.eyebrow}</Eyebrow>
          <h2 className="text-3xl font-light tracking-tight text-balance md:text-4xl">
            {PARTNERSHIP.title}
          </h2>
          <p className="text-sm leading-relaxed text-muted">{PARTNERSHIP.body}</p>
          <ul className="mt-1 flex flex-col gap-3">
            {PARTNERSHIP.points.map((v) => (
              <li key={v.name}>
                <p className="text-sm font-medium">{v.name}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">{v.detail}</p>
              </li>
            ))}
          </ul>
        </div>,
      )}

      {/* ---- 08 Handshake / Contact ---- */}
      {block(
        7,
        'inset-x-0 bottom-0 top-0 flex items-center justify-center px-6',
        <div className="flex w-full max-w-md flex-col items-center gap-5 rounded-2xl border border-line bg-panel p-8 text-center backdrop-blur-md">
          <SceneTag index="08" label="START" />
          <Eyebrow>{CONTACT.eyebrow}</Eyebrow>
          <h2 className="text-3xl font-light tracking-tight text-balance md:text-4xl">
            {CONTACT.title}
          </h2>
          <p className="text-sm leading-relaxed text-muted">{CONTACT.body}</p>
          <div className="mt-1 flex w-full flex-col gap-2">
            <a
              href={`mailto:${CONTACT.email}`}
              className="rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-[#04110c] transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-accent"
            >
              {CONTACT.email}
            </a>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-line px-5 py-3 font-mono text-sm text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
            >
              WhatsApp: {CONTACT.phoneDisplay}
            </a>
          </div>
          <p className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
            {CONTACT.location}
          </p>
        </div>,
      )}
    </div>
  )
}
