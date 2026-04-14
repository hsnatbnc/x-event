# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository State

This is a **greenfield repo**. Only two files exist today:

- `README.md` — full creative brief, experience direction, and phased build plan
- `website-content.html` — content source of truth (self-contained HTML with inline styles)

There is no framework, `package.json`, build tooling, lint config, or test setup yet. Do not invent build/lint/test commands — the first implementation pass will introduce them. When scaffolding, default to the stack listed below rather than asking.

## What This Project Is

A cinematic, scroll-led storytelling website for **X Event** (creative production & interactive experience studio). The target feel is "interactive brand film / title sequence / digital exhibition" — **not** a standard agency/SaaS template. Motion must serve narrative, not decorate it.

## Content Source Of Truth

`website-content.html` defines the canonical information architecture. Preserve these four top-level sections (IDs match the file):

- `#home` — Hero / opening scene
- `#about` — Studio story
- `#projects` — Selected projects (also covers capabilities)
- `#contact` — Closing scene / CTA

Copy may be **adapted** for stronger narrative flow, but business meaning and section intent must remain intact. When in doubt, read the relevant `<section>` in `website-content.html` before rewriting copy.

Note: the colors in `website-content.html` (`--bg: #f5f1ea`, `--accent: #b85c38`) are **content-preview styling only**, not the final art direction. Do not lift them wholesale into the production site.

## Default Technical Direction

When scaffolding, prefer:

- **Next.js** (App Router) or **Vite** + **React** for app structure
- **GSAP** + **ScrollTrigger** for scroll choreography, pinning, scrubbed timelines
- **Three.js** for hero / showcase 3D moments; shaders only where they add atmosphere
- **CSS variables** for art-direction tokens (color, spacing, type scale)

Avoid pulling in UI component libraries (shadcn, MUI, Chakra, etc.) — they push the site toward the generic SaaS look this project explicitly rejects. Build bespoke components.

## Phased Build Approach

The README defines a three-phase rollout that future sessions should respect — don't leap to Phase 3 visuals before Phase 1 structure exists:

1. **Phase 1** — Project scaffold, content architecture, typography/color/spacing/section rhythm
2. **Phase 2** — Scroll-based storytelling, parallax layers, section transitions, hero motion language
3. **Phase 3** — Three.js scenes, shader atmosphere, performance + mobile refinement

## Non-Negotiable Creative Constraints

These are explicit directives from `README.md` — treat them as hard rules, not suggestions:

- **Story first.** Every section is a scene. Start from narrative structure, not random visual effects.
- **Motion with purpose.** Animation must explain, reveal, or intensify — never decorate.
- **No generic SaaS / purple-gradient / startup aesthetics.** This is the fastest way to fail the brief.
- **Performance is a feature.** Limit heavy effects, keep scroll smooth, optimize assets.
- **Mobile must feel intentional**, not a downgraded desktop copy.
- **Preserve accessibility** — semantic markup, keyboard paths, reduced-motion support — even as motion increases.

## Working Agreement

- Explain major structural decisions briefly when they're non-obvious.
- Protect content from becoming secondary to effects — if an animation obscures meaning, cut the animation.
- Avoid unnecessary dependencies; prefer the default stack above.
- After any motion pass, sanity-check interaction quality (scroll, hover, mobile tap) before claiming the task is done.
