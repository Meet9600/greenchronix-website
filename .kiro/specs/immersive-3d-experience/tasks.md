# Implementation Plan: Immersive 3D Experience

## Overview

Six progressive enhancement layers are added to the GreenChronix site in strict delivery order so every step builds on the last: smooth-scroll infrastructure → scroll progress bar → WebGL capability detection + error boundary → static fallback asset → hero 3D canvas → pseudo-3D tilt cards → particle field → scroll-reveal tightening → build verification. All new components are purely decorative and loaded client-side only via `next/dynamic { ssr: false }` so first paint and existing copy are never affected.

## Tasks

- [ ] 1. Install new dependencies
  - Run `npm install lenis @react-three/fiber @react-three/drei three` to add the four packages required by the design
  - Add `@types/three` as a dev dependency: `npm install -D @types/three`
  - Verify the four packages appear in `dependencies` in `package.json`
  - _Requirements: 7.4_

- [ ] 2. Create LenisProvider and wire into layout
  - [ ] 2.1 Implement `app/components/lenis-provider.tsx`
    - Create a `"use client"` component that initialises Lenis inside `useEffect` (SSR-safe — no top-level import side-effects)
    - Read `window.matchMedia("(prefers-reduced-motion: reduce)").matches` before calling `new Lenis(...)` — skip instantiation when true so native scroll is preserved
    - Wrap the `new Lenis(...)` call in `try/catch`; on failure log the error and fall back to native scroll without throwing
    - Start a `requestAnimationFrame` loop calling `lenis.raf(time)` and cancel it + call `lenis.destroy()` on unmount
    - Return `children` as-is (no wrapper element rendered)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  - [ ] 2.2 Wire LenisProvider into `app/layout.tsx`
    - Import `LenisProvider` and wrap the existing `{children}` inside `<body>` with it, keeping all `<html>`, `<body>` attributes, metadata exports, and the JSON-LD `<script>` tag unchanged
    - _Requirements: 1.1_

- [ ] 3. Create ScrollProgressBar and mount inside LenisProvider
  - [ ] 3.1 Implement `app/components/scroll-progress-bar.tsx`
    - Create a `"use client"` component using `useScroll()` from framer-motion to get `scrollYProgress` [0,1]
    - Call `useReducedMotion()` from framer-motion; when true use `useTransform(scrollYProgress, [0,1],[0,1])` directly (no spring)
    - When reduced motion is false use `useSpring(scrollYProgress, { stiffness: 200, damping: 30 })` for the smooth variant
    - Render a `<motion.div>` with `position: fixed`, `top: 0`, `left: 0`, `height: "3px"`, `width: "100%"`, `scaleX` bound to the spring/transform value, `transformOrigin: "left"`, `background: "linear-gradient(to right, #34d399, #6ee7b7)"`, `zIndex: 60`, `pointerEvents: "none"`
    - Use `scaleX` (not `width`) so the element has zero layout size and contributes CLS = 0
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  - [ ] 3.2 Mount ScrollProgressBar inside LenisProvider
    - Import and render `<ScrollProgressBar />` as the first child inside the `LenisProvider` return, before `{children}`, so it is always mounted above all page content
    - _Requirements: 4.1_

- [ ] 4. Implement `useWebGLCapable` hook
  - Create `app/hooks/use-webgl-capable.ts` as a plain TypeScript module (no JSX)
  - The hook returns `false` on initial render (SSR-safe default) then sets state to `true` inside `useEffect` only when ALL conditions pass: `window.matchMedia("(hover: hover) and (pointer: fine)").matches`, `navigator.hardwareConcurrency > 4`, and `!window.matchMedia("(prefers-reduced-motion: reduce)").matches`
  - Result is computed once on mount and never re-evaluated; export as `useWebGLCapable`
  - _Requirements: 2.7_

- [ ] 5. Create ThreeErrorBoundary
  - Create `app/components/three-error-boundary.tsx` as a React class component extending `React.Component`
  - Accept a `fallback?: ReactNode` prop and `children: ReactNode`
  - Implement `static getDerivedStateFromError()` to set `hasError: true` in state
  - In `componentDidCatch` call `console.error` with the error and info
  - In `render`: return `this.props.fallback ?? null` when `hasError` is true, otherwise return `this.props.children`
  - _Requirements: 7.9_

- [ ] 6. Create StaticNetworkFallback SVG asset
  - Create `public/network-fallback.svg` — an 800×600 viewBox SVG with ~20 circles (`r="3"`, `fill="#34d399"`, `opacity="0.5"`) and ~25 line elements (`stroke="#34d399"`, `opacity="0.15"`) arranged as an abstract node-link network
  - No animation attributes; purely static markup so it renders identically on all devices
  - _Requirements: 2.8_

- [ ] 7. Checkpoint — core infrastructure ready
  - Ensure `npm run build` passes with no type errors before continuing to WebGL components
  - Confirm `LenisProvider`, `ScrollProgressBar`, `useWebGLCapable`, `ThreeErrorBoundary`, and `network-fallback.svg` are all present and the layout compiles cleanly
  - _Requirements: 7.1_

- [ ] 8. Implement HeroCanvas with NetworkScene
  - [ ] 8.1 Implement `app/components/hero-canvas.tsx` — canvas shell
    - Create a `"use client"` component (the consuming page lazy-loads it via `next/dynamic`)
    - Render an R3F `<Canvas>` with props: `dpr={[1, 2]}`, `frameloop="demand"`, `camera={{ position: [0, 0, 5], fov: 60 }}`, `gl={{ antialias: false, alpha: true }}`
    - Position the canvas wrapper `absolute inset-0 z-0 pointer-events-none`
    - Attach an `IntersectionObserver` to the wrapper div; when less than 1 px is visible set a `paused` ref to `true` and skip `invalidate()` calls; resume when re-entering
    - Handle `pointermove` on the parent section (via a forwarded ref or prop callback); throttle to `requestAnimationFrame`; store mouse position in a ref; each frame lerp camera toward `(mouseX * 0.4, mouseY * 0.4, 5)` capped so effective rotation ≤ 8°
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6_
  - [ ] 8.2 Implement NetworkScene inside `hero-canvas.tsx`
    - Inside the `<Canvas>`, render a `NetworkScene` component using R3F hooks
    - Generate 40–60 nodes with random positions in `[-4, 4]³`; render as R3F `<points>` with point size 0.06, color `#34d399`, opacity 0.45
    - Build line segments connecting node pairs within distance 1.8; render as `<lineSegments>` with `lineBasicMaterial` color `#34d399`, opacity 0.18, transparent
    - Each frame: update node positions by velocity vector (speed ~0.002 units/frame), bounce at ±4 bounds, call `invalidate()` from `useThree`
    - Use `MeshBasicMaterial` / `LineBasicMaterial` (no lighting pass) to keep GPU cost minimal
    - _Requirements: 2.3, 2.5_
  - [ ] 8.3 Wire HeroCanvas into `app/home-content.tsx`
    - Add `const DynamicHeroCanvas = dynamic(() => import("./components/hero-canvas"), { ssr: false })` at the top of `home-content.tsx`
    - Call `useWebGLCapable()` at the top of `HomeContent`
    - Wrap the existing hero `<motion.section>` content in a `<div className="relative">` outer shell
    - Inside that shell, before the existing hero HTML: when `isCapable` render `<ThreeErrorBoundary fallback={<StaticNetworkFallback />}><Suspense fallback={null}><DynamicHeroCanvas /></Suspense></ThreeErrorBoundary>`; when not capable render `<StaticNetworkFallback />`
    - Keep all existing hero HTML inside a `<div className="relative z-10">` so CTAs remain interactive
    - Do not modify any hero copy, Stat values, MagneticButton hrefs, or FloatingPanel content
    - _Requirements: 2.1, 2.2, 2.7, 2.9, 7.9_

- [ ] 9. Implement TiltCard and wrap service/project cards
  - [ ] 9.1 Implement `app/components/tilt-card.tsx`
    - Create a `"use client"` component with props `children: ReactNode`, `className?: string`, `maxTilt?: number` (default 12)
    - Create `rotateX` and `rotateY` `useMotionValue(0)` instances; apply `useSpring` with `{ stiffness: 300, damping: 28 }` to each
    - Create `liftY` `useMotionValue(0)` with the same spring config; create a `boxShadow` `useMotionValue` interpolated between idle (`"0 0 0 0px rgba(52,211,153,0)"`) and hover glow (`"0 0 0 1px rgba(52,211,153,0.35), 0 8px 32px -8px rgba(52,211,153,0.2)"`)
    - On `onPointerMove`: compute `relX/relY` from `getBoundingClientRect`; call `rotateY.set((relX-0.5)*2*maxTilt)` and `rotateX.set(-(relY-0.5)*2*maxTilt)`; set `liftY` to `-6`; set glow to hover value
    - On `onPointerLeave`: reset all motion values to zero/idle
    - Outer `motion.div`: `style={{ perspective: "800px" }}` with `rotateX`, `rotateY`, `y` spring MotionValues and `boxShadow` applied
    - Inner div (children wrapper): `style={{ transformStyle: "preserve-3d" }}`
    - Export a `TiltCardFront` component that renders children inside a `div` with `style={{ transform: "translateZ(16px)" }}`
    - Call `useReducedMotion()` from framer-motion; when true skip all rotation/lift/glow motion and return `<>{children}</>` directly
    - Detect touch device via `window.matchMedia("(hover: none)").matches`; when true clamp effective `maxTilt` to 4
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_
  - [ ] 9.2 Wrap HoverLiftCard with TiltCard in `app/home-content.tsx`
    - Import `TiltCard` and `TiltCardFront`
    - In the `HoverLiftCard` component return, wrap the outermost `motion.div` in `<TiltCard maxTilt={finePointerHover ? 12 : 4}>`
    - Move the `<h3>{title}</h3>` element inside `<TiltCardFront>`; leave description `<p>` and `<ul>` items outside
    - Do not change any Tailwind classes, copy text, or `whileHover` props on the existing `motion.div`
    - _Requirements: 3.1, 3.4, 3.8_
  - [ ] 9.3 Wrap ProjectCard with TiltCard in `app/home-content.tsx`
    - In the `ProjectCard` component return, wrap the outermost `motion.div` in `<TiltCard maxTilt={finePointerHover ? 12 : 4}>`
    - Move the project `name` and `result` `<p>` elements inside `<TiltCardFront>`; leave the `tech` `<p>` outside
    - Do not change any Tailwind classes, copy text, or existing motion props
    - _Requirements: 3.1, 3.4, 3.8_

- [ ] 10. Implement ParticleField and wire into home-content.tsx
  - [ ] 10.1 Implement `app/components/particle-field.tsx`
    - Create a `"use client"` component
    - Call `useReducedMotion()` from framer-motion; return `null` immediately when true
    - Create a `<canvas>` ref; on mount set `width = window.innerWidth`, `height = window.innerHeight`; attach a `ResizeObserver` to keep dimensions in sync; clean up on unmount
    - Initialise 50 particles: each has `{ x, y, vx, vy, r, alpha, color }` where `alpha ∈ [0.04, 0.10]`, `r ∈ [0.8, 2.0]`, speed `∈ [0.08, 0.25]` px/frame, `color` is either `rgba(52,211,153,α)` or `rgba(255,255,255,α)` (alternating)
    - Run a `requestAnimationFrame` loop: `clearRect`, update each particle position (wrap edges), draw as filled arc, request next frame
    - Cancel the RAF and disconnect ResizeObserver on unmount
    - Render the canvas with `position: fixed`, `inset: 0`, `zIndex: 2`, `pointerEvents: none`
    - _Requirements: 6.1, 6.2, 6.4, 6.5, 6.6, 6.7_
  - [ ] 10.2 Wire ParticleField into `app/home-content.tsx`
    - Add `const DynamicParticleField = dynamic(() => import("./components/particle-field"), { ssr: false })` at the top of `home-content.tsx`
    - Inside the `HomeContent` return, inside the `<MotionConfig>` root `<div>`, render `<Suspense fallback={null}><DynamicParticleField /></Suspense>` as the first child, before `<AmbientBackground />`
    - _Requirements: 6.1, 6.3_

- [ ] 11. Tighten section scroll-reveal variants in `app/home-content.tsx`
  - Update the `stagger` variant: change `staggerChildren` from `0.1` to `0.08`
  - Update `sectionSubtitle`: change transition to `{ type: "spring", stiffness: 240, damping: 24 }`
  - Update `sectionHeadContainer`: change `delayChildren` from `0.02` to `0.01`
  - Update `HoverLiftCard`'s `whileInView` spring: change `stiffness` from `200` to `240` and `damping` from `26` to `24`; change card stagger delay multiplier from `index * 0.12` to `index * 0.08`
  - Update `ProjectCard`'s `whileInView` spring identically; existing `delay` prop values (0, 0.08, 0.16 …) are already ≤ 0.08 spacing — keep as-is
  - Do not add any new wrapper elements; modify only the variant objects and inline transition objects in place
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.6_

- [ ] 12. Final build verification
  - Run `npm run build` and confirm it exits with code 0 and no TypeScript errors
  - Confirm no new ESLint errors beyond any pre-existing baseline
  - Verify all existing routes (`/`, `/pricing`, `/blog`, `/blog/[slug]`), WhatsApp CTAs, and the contact form API route (`/api/contact`) remain unchanged
  - _Requirements: 7.1, 7.7, 7.8_

## Notes

- All 3D/canvas components use `next/dynamic { ssr: false }` inside `<Suspense fallback={null}>` — never imported at the top level in server components.
- `MotionConfig reducedMotion="user"` is already on the root wrapper in `home-content.tsx`; all new Framer Motion components inherit it automatically.
- The `scaleX` trick in ScrollProgressBar (fixed full-width div with scaleX MotionValue) ensures CLS = 0.
- HeroCanvas uses `frameloop="demand"` + IntersectionObserver pause to minimise idle GPU usage on desktop.
- ParticleField uses a plain Canvas 2D API — no WebGL context — so it never competes with HeroCanvas for GPU resources.
- No existing copy, routes, WhatsApp CTAs, Stat values, or contact form logic is modified at any point.
- Tasks 7 and 12 are checkpoint tasks that gate the next wave behind a passing build.

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 0, "tasks": ["1", "6"] },
    { "wave": 1, "tasks": ["2.1", "4", "5"] },
    { "wave": 2, "tasks": ["2.2", "3.1"] },
    { "wave": 3, "tasks": ["3.2"] },
    { "wave": 4, "tasks": ["7"] },
    { "wave": 5, "tasks": ["8.1", "9.1", "10.1"] },
    { "wave": 6, "tasks": ["8.2"] },
    { "wave": 7, "tasks": ["8.3", "9.2", "9.3", "10.2"] },
    { "wave": 8, "tasks": ["11"] },
    { "wave": 9, "tasks": ["12"] }
  ]
}
```
