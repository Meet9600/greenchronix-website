# Design Document — Immersive 3D Experience

## Overview

Six progressive enhancement layers are added to the existing GreenChronix site. Every enhancement is purely decorative and layered on top of the current HTML without changing routes, copy, or layout. The render tree already uses `MotionConfig reducedMotion="user"` globally, which Framer Motion propagates to every child — all new motion components inherit this automatically.

New packages:
- `lenis` — smooth-scroll driver (~4 kB gzipped)
- `@react-three/fiber` — React renderer for Three.js
- `@react-three/drei` — Three.js helper components
- `three` — underlying 3D engine (tree-shaken by R3F)

---

## Architecture

### Component Tree

```
app/layout.tsx
└── LenisProvider              ← client-only via useEffect; wraps children
    ├── ScrollProgressBar      ← fixed z-[60], framer-motion useScroll/useSpring
    └── {children}
        └── home-content.tsx
            ├── DynamicParticleField   ← fixed z-[2], CSS canvas, dynamic import
            ├── AmbientBackground      (unchanged)
            ├── GrainOverlay           (unchanged)
            ├── <header />             (unchanged, z-50)
            └── <main />
                ├── HeroSection wrapper (relative)
                │   ├── ThreeErrorBoundary > DynamicHeroCanvas  OR  StaticNetworkFallback
                │   │   └── NetworkScene  (R3F, absolute inset-0 z-0 pointer-events-none)
                │   └── existing hero HTML  (relative z-10 — unchanged)
                ├── SectionMotion#services
                │   └── TiltCard > HoverLiftCard (×6)
                ├── SectionMotion#projects
                │   └── TiltCard > ProjectCard (×6)
                ├── SectionMotion#about  (unchanged)
                └── SectionMotion#contact  (unchanged)
```

### Layer Z-Index Budget

| Layer | z-index | Notes |
|---|---|---|
| `#040806` body background | — | CSS body bg |
| `AmbientBackground` | `z-0` | unchanged |
| `GrainOverlay` | `z-[1]` | unchanged |
| `ParticleField` | `z-[2]` | above grain, below content |
| `HeroCanvas` | `z-0` (inside hero) | absolute, pointer-events-none |
| Hero HTML content | `z-10` (inside hero) | CTAs fully interactive |
| Section content | `z-10` via `<main>` | unchanged |
| Navigation header | `z-50` | unchanged |
| `ScrollProgressBar` | `z-[60]` | above nav |

### Rendering Strategy

All WebGL and canvas components follow the same pattern:

```tsx
const DynamicX = dynamic(() => import("./components/x"), { ssr: false });
// ...
<Suspense fallback={null}>
  <DynamicX />
</Suspense>
```

This excludes them from the server-rendered HTML payload and defers their JS bundle until after first paint. `HeroCanvas` is additionally gated behind `useWebGLCapable()` so it never mounts on mobile/touch/low-power devices.

---

## Components and Interfaces

### LenisProvider

**File:** `app/components/lenis-provider.tsx`

```ts
interface LenisProviderProps {
  children: ReactNode;
}
```

- `"use client"` — no SSR execution
- Initialises Lenis inside `useEffect`; skips if `prefers-reduced-motion: reduce` matches
- Wraps `new Lenis(...)` in `try/catch`; on failure falls back to native scroll silently
- Runs `requestAnimationFrame` loop calling `lenis.raf(time)`; cancels + destroys on unmount
- Returns `children` as-is (no wrapper DOM element)

**Wire-up in `app/layout.tsx`:**
```tsx
// <body> contents change from:
{children}
// to:
<LenisProvider>
  <ScrollProgressBar />
  {children}
</LenisProvider>
```

---

### ScrollProgressBar

**File:** `app/components/scroll-progress-bar.tsx`

No props. Self-contained. Reads `useScroll()` and `useReducedMotion()` from framer-motion.

- Normal: `useSpring(scrollYProgress, { stiffness: 200, damping: 30 })`
- Reduced motion: `useTransform(scrollYProgress, [0,1], [0,1])` — no spring
- Renders `<motion.div>` with `position: fixed`, `top: 0`, `left: 0`, `height: 3px`, `width: 100%`, `scaleX` bound to spring/transform, `transformOrigin: "left"`, `background: linear-gradient(to right, #34d399, #6ee7b7)`, `zIndex: 60`, `pointerEvents: none`
- Uses `scaleX` (not `width`) so the element has zero layout size → CLS = 0

---

### useWebGLCapable

**File:** `app/hooks/use-webgl-capable.ts`

```ts
function useWebGLCapable(): boolean
```

Returns `false` during SSR and initial render. Sets to `true` inside `useEffect` only when all pass:
- `window.matchMedia("(hover: hover) and (pointer: fine)").matches`
- `navigator.hardwareConcurrency > 4`
- `!window.matchMedia("(prefers-reduced-motion: reduce)").matches`

Result is computed once on mount and never re-evaluated.

---

### ThreeErrorBoundary

**File:** `app/components/three-error-boundary.tsx`

```ts
interface ThreeErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ThreeErrorBoundaryState {
  hasError: boolean;
}
```

Standard React class component. `getDerivedStateFromError` → `{ hasError: true }`. `componentDidCatch` → `console.error`. Renders `fallback ?? null` when errored, otherwise renders `children`.

---

### HeroCanvas + NetworkScene

**File:** `app/components/hero-canvas.tsx`

```ts
// No props — self-contained; consuming component lazy-loads it
export default function HeroCanvas(): JSX.Element
```

**Canvas configuration:**
- `dpr={[1, 2]}`, `frameloop="demand"`, `camera={{ position: [0, 0, 5], fov: 60 }}`, `gl={{ antialias: false, alpha: true }}`
- Wrapper: `absolute inset-0 z-0 pointer-events-none`

**IntersectionObserver:** attached to wrapper div; sets `paused` ref when < 1 px visible; skips `invalidate()` calls while paused.

**Mouse parallax:** `pointermove` handler (on parent element via forwarded ref), throttled to rAF; camera lerps toward `(mouseX * 0.4, mouseY * 0.4, 5)`, effective rotation capped ≤ 8°.

**NetworkScene internals (inside Canvas):**

| Element | Count | Config |
|---|---|---|
| Nodes | 40–60 | random pos in `[-4,4]³`, rendered as `<points>`, size 0.06, color `#34d399`, opacity 0.45 |
| Lines | pairs within 1.8 units | `<lineSegments>` with `lineBasicMaterial`, color `#34d399`, opacity 0.18, transparent |
| Drift | per node | velocity `~0.002` units/frame, bounce at ±4 bounds |

All materials: `MeshBasicMaterial` / `LineBasicMaterial` (no lighting pass).

---

### StaticNetworkFallback

**File:** `public/network-fallback.svg`

800×600 viewBox SVG, ~20 circles (`r="3"`, `fill="#34d399"`, `opacity="0.5"`), ~25 lines (`stroke="#34d399"`, `opacity="0.15"`), no animation. Used inline when `useWebGLCapable()` is `false`.

---

### TiltCard + TiltCardFront

**File:** `app/components/tilt-card.tsx`

```ts
interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;  // default 12; capped to 4 on touch devices
}
```

**Motion values:**
- `rotateX`, `rotateY`: `useMotionValue(0)` + `useSpring({ stiffness: 300, damping: 28 })`
- `liftY`: `useMotionValue(0)` + same spring
- `boxShadow`: `useMotionValue("0 0 0 0px rgba(52,211,153,0)")` — animated to `"0 0 0 1px rgba(52,211,153,0.35), 0 8px 32px -8px rgba(52,211,153,0.2)"` on hover

**onPointerMove:**
```
relX = (e.clientX - rect.left) / rect.width   // [0,1]
relY = (e.clientY - rect.top) / rect.height   // [0,1]
rotateY.set((relX - 0.5) * 2 * maxTilt)
rotateX.set(-(relY - 0.5) * 2 * maxTilt)
liftY.set(-6)
boxShadow.set(hoverValue)
```

**onPointerLeave:** reset all to idle/zero.

**DOM structure:**
```
<motion.div style={{ perspective: "800px", rotateX, rotateY, y: liftY, boxShadow }}>
  <div style={{ transformStyle: "preserve-3d" }}>
    {children}
  </div>
</motion.div>
```

**TiltCardFront:** `<div style={{ transform: "translateZ(16px)" }}>{children}</div>`

**Reduced motion:** `useReducedMotion()` → if true, return `<>{children}</>` directly, preserving existing `whileHover` y-lift on child cards.

**Touch device:** `window.matchMedia("(hover: none)").matches` → clamp effective `maxTilt` to 4.

---

### ParticleField

**File:** `app/components/particle-field.tsx`

No props. Returns `null` when `useReducedMotion()` is true.

**Particle shape:**
```ts
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number;      // [0.8, 2.0]
  alpha: number;  // [0.04, 0.10]
  color: 0 | 1;  // 0 = rgba(52,211,153,α), 1 = rgba(255,255,255,α)
}
```

50 particles initialised on mount. Canvas 2D API only — no WebGL context.

**rAF loop:**
1. `ctx.clearRect(0, 0, w, h)`
2. For each particle: `x += vx`, `y += vy`, wrap edges, draw filled arc
3. `requestAnimationFrame(loop)`

Canvas positioned: `fixed inset-0 z-[2] pointer-events-none`. Dimensions kept in sync via `ResizeObserver`.

---

## Data Models

### Particle (ParticleField)

```ts
interface Particle {
  x: number;       // current x position (px)
  y: number;       // current y position (px)
  vx: number;      // x velocity (px/frame), range [-0.25, 0.25]
  vy: number;      // y velocity (px/frame), range [-0.25, 0.25]
  r: number;       // radius (px), range [0.8, 2.0]
  alpha: number;   // opacity, range [0.04, 0.10]
  color: 0 | 1;   // 0 = brand green, 1 = white
}
```

### NetworkNode (HeroCanvas / NetworkScene)

```ts
interface NetworkNode {
  position: [number, number, number];  // current world position, range [-4, 4]³
  velocity: [number, number, number];  // drift velocity, speed ~0.002 units/frame
}
```

### WebGL Capability Result

```ts
// useWebGLCapable hook return
type WebGLCapable = boolean;  // true = load HeroCanvas; false = show StaticNetworkFallback
```

---

## Error Handling

### WebGL / R3F failures

`ThreeErrorBoundary` wraps `<Suspense><DynamicHeroCanvas /></Suspense>`. On any render error:
- State transitions to `hasError: true`
- Renders `fallback` prop (`<StaticNetworkFallback />`) — page remains fully usable
- Error logged to `console.error` only

### Lenis initialisation failure

`try/catch` inside `useEffect`. On failure:
- Error logged to `console.error`
- No exception propagates — native browser scroll behaviour continues unchanged

### ParticleField failures

Wrapped in `<Suspense fallback={null}>`. If the dynamic import or component throws:
- Suspense catches it; `fallback={null}` renders instead (empty, no visible change)
- Page content unaffected

### Canvas context unavailable (ParticleField)

`getContext("2d")` return value is checked; if null, component returns early without starting the rAF loop.

---

## Testing Strategy

### Build verification

`npm run build` must pass with zero TypeScript errors and zero new ESLint errors. This is the primary automated gate.

### Manual smoke tests (per component)

| Component | Test |
|---|---|
| LenisProvider | Scroll page — verify smooth inertial feel on desktop |
| LenisProvider (reduced motion) | Enable OS reduced-motion — verify native scroll behaviour |
| ScrollProgressBar | Scroll to middle of page — verify bar at ~50% width |
| HeroCanvas | Desktop Chrome — verify animated network renders behind hero text |
| StaticNetworkFallback | Throttle CPU 4× in DevTools + enable touch emulation — verify static SVG shown instead of canvas |
| TiltCard | Hover over service card — verify tilt, glow, translateZ lift |
| TiltCard (reduced motion) | Enable OS reduced-motion — verify no tilt, existing y-lift preserved |
| ParticleField | Scroll past hero — verify subtle particles visible at very low opacity |
| ParticleField (reduced motion) | Enable OS reduced-motion — verify no particles rendered |
| All routes | Navigate to `/pricing`, `/blog`, `/blog/[slug]` — verify no regressions |

### Performance target

Lighthouse mobile audit (CPU 4× throttle, Fast 3G): score ≥ 85. CLS ≤ 0.1.

---

## Correctness Properties

These invariants must hold at all times:

### Property 1: No text in WebGL
All heading, body, CTA, and label text must be DOM nodes, never rendered inside a `<Canvas>` or `<canvas>`.

**Validates: Requirements 2.9, 7.7**

### Property 2: Opacity cap
No ParticleField particle may have alpha > 0.12.

**Validates: Requirements 6.2, 6.5**

### Property 3: Tilt angle cap
TiltCard rotateX and rotateY must stay within ±12° on fine-pointer devices and ±4° on touch devices at all times.

**Validates: Requirements 3.2, 3.7**

### Property 4: SSR clean
The server-rendered HTML for any page must contain no `<canvas>` elements from HeroCanvas or ParticleField.

**Validates: Requirements 7.3**

### Property 5: Reduced motion kill-switch
When `prefers-reduced-motion: reduce` is active, HeroCanvas, ParticleField, and Lenis must not be instantiated; TiltCard must return children without any motion wrapper.

**Validates: Requirements 1.3, 2.7, 3.8, 6.6, 7.5**

### Property 6: CLS = 0 from ScrollProgressBar
The progress bar element must never shift any other element in the document flow.

**Validates: Requirements 4.5, 7.2**

### Property 7: Existing routes intact
`/`, `/pricing`, `/blog`, `/blog/[slug]`, `/api/contact` must all respond correctly after all changes.

**Validates: Requirements 7.8**
