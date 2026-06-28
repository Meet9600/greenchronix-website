# SCENE 01 — ARRIVAL

## Status

**Locked**

Version: 1.0

---

# Purpose

Scene 01 is the visitor's first impression of GreenChronix.

It is not intended to advertise services or explain technologies.

Its purpose is to create curiosity, confidence, and calm by presenting GreenChronix as an engineering-first company that solves meaningful problems through intelligent systems.

The visitor should immediately understand that this is not a conventional software agency website.

---

# Narrative

Everything begins in darkness.

Small ambient particles drift through space.

At the center of the scene, the Engineering Core slowly awakens.

The visitor is introduced to GreenChronix through a single statement:

> Built for Problems Worth Solving.

Nothing competes with this message.

The Engineering Core becomes the visual anchor that remains throughout the entire website experience.

---

# Emotional Goal

The visitor should feel:

* Curious
* Calm
* Confident
* Interested
* Drawn forward

Avoid excitement through excessive animation.

The atmosphere should resemble entering a modern engineering laboratory rather than watching a product advertisement.

---

# Engineering Core State

State:

Dormant → Awakening

Characteristics:

* Glass material
* Emerald emissive wireframe
* Internal glow
* Slow rotation
* Soft breathing animation
* Central point light
* Minimal movement

The Engineering Core should immediately establish itself as the permanent identity of the experience.

---

# Camera

Starting Position

* Centered on the Engineering Core
* Slow cinematic framing
* Slight mouse parallax
* No aggressive movement

The camera should feel weighty and intentional.

---

# World

Environment

* Near-black background
* Volumetric depth
* Large empty negative space
* Ambient floating particles
* Minimal lighting

Nothing should distract from the Engineering Core.

---

# HTML Layout

Layout System

Uses the shared SceneLayout component.

Desktop

* Left aligned
* Approximately 40% width
* Vertically centered

Mobile

* Positioned in the upper safe area
* Engineering Core shifted downward through camera offset
* No overlap with typography

---

# Typography

Headline

Built for Problems Worth Solving.

Supporting Text

Engineering intelligent digital systems with clarity, precision, and long-term thinking.

Typography Rules

* Large
* Minimal
* Confident
* Tight tracking
* Balanced line wrapping
* Strong hierarchy

---

# Primary Action

Button

Start the Journey

Purpose

Encourages exploration rather than conversion.

No sales language.

No marketing pressure.

---

# Motion Language

Animation Principles

* Slow
* Purposeful
* Premium
* Smooth
* Calm

Avoid

* Bounce
* Elastic easing
* Fast scaling
* Sudden transitions

GSAP controls all major animations.

---

# Performance

Adaptive Quality

PerformanceManager controls:

* Particle count
* Lighting complexity
* Material quality
* Rendering quality

Reduced capability devices gracefully fall back while preserving the visual language.

---

# Accessibility

Requirements

* Keyboard navigation
* Visible focus states
* Reduced Motion support
* Responsive layout
* High contrast typography

---

# Transition to Scene 02

Scene 01 should not disappear.

Instead, it evolves.

As scrolling begins:

* Camera slowly approaches the Engineering Core.
* The Core awakens further.
* Scene 01 typography fades away.
* Scene 02 begins emerging naturally.

The visitor should never perceive a hard scene change.

---

# Design Principles

Scene 01 establishes the visual identity used throughout the website.

Every later scene inherits:

* Material language
* Lighting language
* Motion language
* Camera philosophy
* Typography rhythm

Nothing introduced later should contradict the foundation established here.

---

# Acceptance Criteria

✓ Engineering Core immediately captures attention.

✓ Typography is always readable.

✓ Composition remains balanced on desktop and mobile.

✓ Performance remains within adaptive budgets.

✓ Camera movement feels cinematic.

✓ Transition into Scene 02 feels continuous.

✓ The visitor immediately understands that GreenChronix is an engineering company rather than a traditional software agency.

---

# Future Polish Ideas

* Richer volumetric lighting.
* Improved internal refraction of the Engineering Core.
* Enhanced particle depth.
* More realistic glass material.
* Subtle audio ambience (optional, disabled by default).

---

# Dependencies

Uses

* Experience
* SceneLayout
* Engineering Core
* Camera Engine
* Lighting Engine
* Particle Engine
* Performance Manager
* Scene Manager
* World Engine

No scene-specific rendering systems should be introduced.
