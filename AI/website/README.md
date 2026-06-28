# GreenChronix AI Knowledge Base

Version: 1.0

Status: Active

---

# Purpose

This directory contains the complete engineering knowledge base for the GreenChronix website.

Its purpose is to preserve the design philosophy, engineering decisions, architecture, and implementation intent behind the project.

A developer or AI assistant should be able to understand the entire website by reading these documents before modifying the codebase.

---

# Guiding Principle

The website is not a collection of pages.

It is one continuous engineering experience.

Every scene evolves from the previous one.

Nothing should appear disconnected.

---

# Reading Order

Always read the documentation in this order:

1. WEBSITE_BLUEPRINT.md
2. VISUAL_BIBLE.md
3. SCENE_01_ARRIVAL.md
4. SCENE_02_ENGINEERING.md
5. SCENE_03_CAPABILITIES.md
6. SCENE_04_ENGINEERING_PIPELINE.md
7. SCENE_05_ENGINEERING_PROOF.md
8. SCENE_06_ENGINEERING_STACK.md
9. SCENE_07_TRUST_AND_PARTNERSHIP.md
10. SCENE_08_CONTACT_EXPERIENCE.md
11. LAUNCH_CRITERIA.md
12. POLISH_BACKLOG.md

Never modify a scene before understanding the blueprint and visual language.

---

# Engineering Principles

The codebase should reflect the same engineering philosophy presented to visitors.

Prioritize:

* Reusable systems
* Clear architecture
* Maintainability
* Accessibility
* Performance
* Long-term scalability

Avoid duplicate implementations and unnecessary complexity.

---

# Technology Stack

Core technologies:

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS
* React Three Fiber
* Three.js
* GSAP
* @react-three/drei

The rendering architecture is centered around reusable engines and managers rather than scene-specific logic.

---

# Project Structure

The implementation is organized into dedicated domains:

* `config/` — centralized configuration
* `core/` — application state and providers
* `three/` — rendering engines and managers
* `components/` — UI and scene overlays
* `hooks/` — reusable React hooks
* `types/` — shared TypeScript definitions
* `lib/` — utilities
* `styles/` — global styling

---

# Workflow

Every feature should follow the same lifecycle:

1. Update documentation.
2. Implement the feature.
3. Test locally.
4. Commit changes.
5. Push to GitHub.
6. Review on Vercel.
7. Approve and lock.
8. Record future improvements in `POLISH_BACKLOG.md`.

---

# Documentation Rules

When adding or changing a scene:

* Update the corresponding scene document.
* Keep the Website Blueprint consistent.
* Preserve the Visual Bible.
* Do not contradict previously established engineering principles.

Documentation and implementation must stay synchronized.

---

# Long-Term Goal

The GreenChronix website should remain understandable years from now.

A new developer or AI assistant should be able to continue the project confidently using this knowledge base without requiring additional explanation.

The documentation is considered part of the product, not an afterthought.
