# Requirements Document

## Introduction

This feature elevates the existing GreenChronix website (Next.js 16 App Router + React 19 + Tailwind v4 + Framer Motion v12) into an immersive, modern 3D experience. Six enhancement layers are added in delivery order: (1) Lenis smooth-scroll provider, (2) a hero WebGL network with a static mobile fallback, (3) pseudo-3D TiltCard wrappers on all service and project cards, (4) a scroll-progress bar, (5) refined section scroll-reveal animations, and (6) a fixed background particle field. All enhancements are purely decorative and must not disrupt SEO, first-paint performance, or any existing copy/routes.

The design language is kept intact: near-black backgrounds (#040806 / #0a0a0a), mint-emerald green accents (#34d399 / #34e89e used sparingly), white bold headings, muted grey (#9ca3af / zinc-400) body text, 16 px-radius cards with 1 px rgba(255,255,255,0.06) borders. All 3D elements are loaded via `next/dynamic { ssr: false }` inside `<Suspense>` so they never block first paint.

---

## Glossary

- **Site**: The GreenChronix Next.js 16 App Router website.
- **LenisProvider**: A client-side React context provider that wraps the Lenis smooth-scroll library and integrates it with Framer Motion's `useScroll`.
- **HeroCanvas**: The React Three Fiber `<Canvas>` component that renders the WebGL network animation behind the hero section HTML content.
- **NetworkScene**: The Three.js scene inside HeroCanvas containing low-poly nodes, connecting line segments, and drifting particles in brand-green at low emissive intensity.
- **TiltCard**: A client-side Framer Motion wrapper component that applies CSS perspective + transform-style: preserve-3d rotateX/Y transforms based on pointer position, used on all service and project cards.
- **ScrollProgressBar**: A thin fixed bar at the top of the viewport that fills from left to right as the user scrolls.
- **SectionReveal**: The per-section entrance animation that translates items upward from below with a slight Z-translate and stagger as they enter the viewport.
- **ParticleField**: A fixed, very low-opacity full-viewport background layer of slowly drifting particles or a subtle gradient mesh rendered below all content but above the background colour.
- **StaticNetworkFallback**: A static SVG or `<Image>` asset shown in place of HeroCanvas on mobile, touch-first, or low-power devices.
- **ReducedMotionMode**: The state active when the `prefers-reduced-motion: reduce` media query matches.

---

## Requirements

### Requirement 1: Lenis Smooth-Scroll Provider

**User Story:** As a site visitor, I want smooth inertial scrolling across the entire site, so that navigation feels fluid and modern.

#### Acceptance Criteria

1. THE LenisProvider SHALL wrap the entire application inside `app/layout.tsx` as a client-side provider, leaving the outer `<html>` and `<body>` tags and all metadata exports unchanged.
2. WHEN the site loads, THE LenisProvider SHALL initialise Lenis with smooth scrolling enabled so that existing scroll-driven animations continue to fire at correct scroll positions.
3. WHILE the `prefers-reduced-motion: reduce` media query matches, THE LenisProvider SHALL disable smooth scrolling and restore native browser scroll behaviour.
4. THE LenisProvider SHALL not execute any of its initialisation code during server-side rendering and SHALL not contribute any render-blocking JavaScript to first paint.
5. IF Lenis fails to initialise, THEN THE Site SHALL not throw an uncaught exception or trigger a React error boundary render; native browser scroll behaviour SHALL remain intact.

---

### Requirement 2: Hero WebGL Network

**User Story:** As a site visitor, I want to see an animated 3D network in the hero section background, so that the first impression of the site communicates technical sophistication.

#### Acceptance Criteria

1. THE HeroCanvas SHALL be positioned absolutely behind all existing hero HTML content, with pointer events passed through to the HTML layer, so that all headings, CTAs, and the pipeline panel remain fully readable and interactive in the DOM.
2. WHEN the page loads on a device that passes the capability check (non-touch, not low-power), THE Site SHALL defer loading HeroCanvas until after first contentful paint and SHALL use a null/transparent Suspense fallback so no visible flash occurs.
3. THE NetworkScene SHALL render nodes, connecting line segments between nearby nodes, and drifting particles using brand-green (#34d399) at a visual intensity low enough that white hero text maintains a contrast ratio of at least 4.5:1 against the canvas background.
4. WHEN the user moves the pointer over the hero section, THE HeroCanvas SHALL apply camera rotation following the pointer position, capped at ±8° on both axes.
5. THE HeroCanvas rendering SHALL only occur when the scene needs updating, reducing continuous GPU load between animation frames.
6. WHEN the HeroCanvas scrolls outside the viewport (less than 1 px intersection), THE HeroCanvas SHALL pause rendering until it re-enters the viewport.
7. WHEN the device is touch-first, reports `navigator.hardwareConcurrency <= 4`, or matches `prefers-reduced-motion: reduce`, THE Site SHALL render StaticNetworkFallback instead of HeroCanvas.
8. THE StaticNetworkFallback SHALL be a static SVG or Next.js `<Image>` depicting a green-on-dark abstract network, filling 100% of the hero section's width and height.
9. ALL text content in the hero section SHALL remain as HTML DOM nodes so that search engines can index it.

---

### Requirement 3: TiltCard Pseudo-3D Wrapper

**User Story:** As a site visitor, I want service and project cards to respond to my cursor with a subtle 3D tilt effect, so that the cards feel tangible and interactive.

#### Acceptance Criteria

1. THE TiltCard SHALL be applied to all 6 service cards (HoverLiftCard components) and all 6 project cards (ProjectCard components) without altering the cards' existing DOM structure, copy, or Tailwind classes.
2. WHEN the pointer moves over a TiltCard on a fine-pointer device, THE TiltCard SHALL compute rotateX and rotateY values from the pointer position relative to the card centre, capped at ±12° (inclusive) on each axis.
3. WHEN the pointer enters a TiltCard, THE TiltCard SHALL apply a soft green border glow (box-shadow: 0 0 0 1px rgba(52,211,153,0.35)) and a vertical lift of −6 px via a Framer Motion spring with stiffness 300 and damping 28.
4. WHILE the pointer is over a TiltCard, THE top content layer inside the card (title and bullet items for HoverLiftCard; project name and result for ProjectCard) SHALL be offset forward using a `translateZ` of 16 px, creating a parallax depth cue; this floating effect activates whenever a pointer is actively over the card regardless of device type.
5. WHEN the pointer leaves a TiltCard, THE TiltCard SHALL animate back to zero rotation, zero lift, and zero translateZ via a Framer Motion spring with stiffness 300 and damping 28.
6. THE TiltCard implementation SHALL use Framer Motion only; no React Three Fiber or WebGL context SHALL be created per card.
7. WHEN the device matches `(hover: none)` and no pointer is actively over the card, THE TiltCard tilt range SHALL be reduced to ±4° maximum.
8. WHILE `prefers-reduced-motion: reduce` matches, THE TiltCard SHALL disable all rotation, lift, and translateZ effects and preserve only the existing y-lift whileHover behaviour (−8 px for HoverLiftCard, −6 px for ProjectCard).

---

### Requirement 4: Scroll Progress Bar

**User Story:** As a site visitor, I want to see a thin green bar at the top of the screen that shows how far I have scrolled, so that I know my position within the page.

#### Acceptance Criteria

1. THE ScrollProgressBar SHALL be rendered as a `position: fixed` element at `top: 0`, `left: 0`, spanning the full viewport width at a height of 3 px, with a z-index greater than 50 (above the navigation header).
2. WHEN the user scrolls, THE ScrollProgressBar SHALL update its width within one animation frame (≤ 16 ms) from 0 % (top of page) to 100 % (bottom of page) so the bar tracks scroll position smoothly.
3. THE ScrollProgressBar colour SHALL use the brand gradient from #34d399 to #6ee7b7.
4. IF `prefers-reduced-motion: reduce` matches, THEN THE ScrollProgressBar SHALL update its width in direct proportion to scroll position without any spring or easing animation.
5. THE ScrollProgressBar SHALL contribute a CLS score of 0 — it SHALL not shift any other element on the page.

---

### Requirement 5: Section Scroll-Reveal Refinement

**User Story:** As a site visitor, I want section content to animate into view as I scroll, with items rising from below with a sense of depth, so that the page feels alive and well-crafted.

#### Acceptance Criteria

1. WHEN a section enters the viewport, THE SectionReveal SHALL translate each child item from `{ y: 40, opacity: 0 }` to `{ y: 0, opacity: 1 }` with a perceived Z-depth cue using a Framer Motion spring.
2. THE SectionReveal stagger delay between items SHALL be 0.08 s or less so the cascade feels faster than or equal to the existing reveal timing.
3. THE SectionReveal spring parameters SHALL use stiffness ≥ 220 and damping ≤ 26 so items feel snappy, not sluggish.
4. THE SectionReveal SHALL trigger via `whileInView` with `viewport={{ once: true }}` so items animate at most once per page load and do not re-animate on scroll-back.
5. WHILE `prefers-reduced-motion: reduce` matches, THE SectionReveal SHALL set all translate distances to 0 and transition duration to 0.01 s, producing opacity-only transitions per WCAG 2.1 guideline 2.3.3.
6. THE SectionReveal SHALL be implemented by refining existing Framer Motion variants in the SectionMotion, HoverLiftCard, and ProjectCard components and SHALL NOT introduce additional layout-breaking wrappers.

---

### Requirement 6: Fixed Background Particle Field

**User Story:** As a site visitor, I want a subtle drifting particle field behind all page sections, so that the whole page feels like one continuous 3D environment.

#### Acceptance Criteria

1. THE ParticleField SHALL be rendered as a `position: fixed`, full-viewport layer with a z-index of 1 (above the #040806 background, below all section content), ensuring it is purely decorative.
2. THE ParticleField SHALL render between 10 and 80 particles at any time; each particle's opacity SHALL not exceed 0.12 so that zinc-400 (#9ca3af) body text maintains a contrast ratio of at least 4.5:1 against any combined background.
3. WHEN the page loads, THE ParticleField SHALL be deferred until after first contentful paint and excluded from the server-rendered HTML payload.
4. THE ParticleField SHALL use Framer Motion canvas-based or CSS-based animation; it SHALL NOT create a React Three Fiber `<Canvas>` context so it does not compete with HeroCanvas for GPU resources.
5. THE ParticleField particle colours SHALL be limited to rgba(52,211,153,α) and rgba(255,255,255,α) with α ≤ 0.12.
6. WHILE `prefers-reduced-motion: reduce` matches, THE ParticleField SHALL not render.
7. THE ParticleField animation loop SHALL halt within one frame interval after the component unmounts.

---

### Requirement 7: Performance and Accessibility Constraints

**User Story:** As a site owner, I want every 3D enhancement to be progressively delivered and accessible, so that performance and inclusivity are never sacrificed for visual polish.

#### Acceptance Criteria

1. THE Site SHALL achieve a Lighthouse mobile performance score of 85 or higher after all enhancements are applied, measured with CPU throttling 4× and network throttling Fast 3G.
2. WHEN any 3D or WebGL component is loading, THE Site SHALL show the existing HTML content without layout shift (CLS ≤ 0.1).
3. THE HeroCanvas, ParticleField, and any other WebGL component SHALL each be excluded from the server-rendered HTML payload and deferred until after first contentful paint.
4. THE Site SHALL add the following packages to package.json: `@react-three/fiber`, `@react-three/drei`, `three`, and `lenis`; no other 3D libraries SHALL be introduced.
5. WHILE `prefers-reduced-motion: reduce` matches, THE Site SHALL not mount the following: TiltCard rotation and parallax, HeroCanvas, ParticleField, and Lenis smooth scrolling.
6. WHILE `prefers-reduced-motion: reduce` matches, THE ScrollProgressBar and SectionReveal SHALL remain active with all translate distances set to zero, producing opacity-only transitions.
7. ALL text in every section SHALL remain as HTML DOM nodes; no text SHALL be rendered inside WebGL or canvas elements.
8. THE Site SHALL preserve all existing routes (`/`, `/pricing`, `/blog`, `/blog/[slug]`), all WhatsApp CTAs, the contact form API route (`/api/contact`), and all existing copy without modification.
9. IF a 3D component throws a runtime error, THEN THE Site SHALL catch the error at a React error boundary and render the static HTML content in its place so that page navigation, CTAs, and the contact form remain operable.
