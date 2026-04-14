# X Event New

This repository is the starting point for a cinematic, storytelling-driven studio website for **X Event**.

The site will transform the content in `website-content.html` into a premium digital experience built around:

- cinematic visual storytelling
- immersive scroll choreography
- parallax depth and layered motion
- refined transitions and scene changes
- strong art direction with a high-end interactive feel

## Project Goal

Build a modern portfolio website for X Event that feels like an interactive brand film rather than a standard agency website.

The experience should:

- introduce X Event as a creative production and interactive experience studio
- present services, capabilities, and selected projects
- feel bold, polished, and immersive
- use motion to support narrative, not distract from it
- work smoothly on desktop and mobile

## Content Source

The full base content lives in `website-content.html`.

That file defines the core information architecture we should preserve:

- Home
- About Us
- Projects
- Contact Us

The copy can be adapted for stronger storytelling flow, but the meaning and business intent should remain intact.

## Experience Direction

The site should feel:

- cinematic
- editorial
- immersive
- premium
- future-facing

This is not a template-like corporate site.

We want a scroll-led narrative experience with:

- layered 3D or pseudo-3D depth
- section-to-section transitions that feel intentional
- reveal-based storytelling
- visual rhythm between calm and dramatic moments
- motion that gives each section its own identity

## Reference Skills To Use

We plan to develop the project with inspiration and workflows from these skill sources:

- `three-js`
- `threejs-shaders`
- `gsap-scrolltrigger`
- `storytelling-web`
- `creative-director`

Suggested usage:

- `three-js`: scene setup, camera systems, object composition, performance-aware 3D structure
- `threejs-shaders`: atmosphere, gradients, distortion, lighting mood, reactive visual surfaces
- `gsap-scrolltrigger`: scroll choreography, pinning, scrubbed timelines, staged section reveals
- `storytelling-web`: narrative sequencing, emotional pacing, content-to-scene mapping
- `creative-director`: art direction guardrails, tone consistency, cinematic decision-making

## Claude Code Agent Brief

Use Claude Code as the implementation partner for this repository.

The agent should operate with the following priorities:

1. Start from content and narrative structure, not random visual effects.
2. Build the website as an immersive story experience.
3. Prefer meaningful motion over excessive animation.
4. Keep performance stable while introducing depth and interactivity.
5. Preserve accessibility, responsive behavior, and content clarity.

## Core Build Principles

- Story first: every section should feel like a scene in a larger narrative.
- Motion with purpose: animation must explain, reveal, or intensify the experience.
- Depth with restraint: parallax and 3D should create presence, not clutter.
- Premium craft: typography, spacing, color, and transitions should feel deliberate.
- Performance matters: optimize assets, limit heavy effects, and test scroll smoothness.
- Responsive by design: mobile should feel intentional, not like a reduced desktop copy.

## Proposed Site Structure

### 1. Hero / Opening Scene

Purpose:
Introduce X Event with an immediate cinematic impression.

Ideas:

- fullscreen opening statement
- ambient motion background
- layered typography reveal
- subtle WebGL or shader-based atmosphere
- scroll invitation that leads into the narrative

### 2. Studio Story

Purpose:
Explain who X Event is and what kind of work it creates.

Ideas:

- staggered copy reveals
- parallax image or abstract 3D composition
- timeline-like movement through capabilities
- editorial layout with strong pacing

### 3. Capabilities / Expertise

Purpose:
Show strategy, creative, tech, and production as one connected pipeline.

Ideas:

- pinned section with animated transitions between capability groups
- layered cards or floating panels
- diagram-like motion that connects disciplines

### 4. Selected Projects

Purpose:
Present project categories and featured case studies with drama and clarity.

Ideas:

- cinematic project transitions
- hover or scroll-reactive reveals
- focus shifts between featured work items
- optional 3D gallery or depth-based showcase

### 5. Contact / Closing Scene

Purpose:
End with a confident invitation for collaboration.

Ideas:

- slower, calmer closing tone
- elegant final motion sequence
- strong CTA with minimal friction

## Recommended Technical Direction

The exact stack can evolve, but the default direction should be:

- `Next.js` or `Vite` for app structure
- `React`
- `GSAP` + `ScrollTrigger` for choreography
- `Three.js` for immersive scenes or section-based 3D moments
- shader effects only where they meaningfully improve atmosphere
- CSS variables for consistent art direction

If the project starts simple, we can phase complexity:

### Phase 1

- set up project structure
- implement layout and content architecture
- establish typography, color, spacing, and section rhythm

### Phase 2

- add scroll-based storytelling
- introduce parallax layers and section transitions
- create hero animation language

### Phase 3

- add WebGL / Three.js scenes
- layer in shader-based atmosphere
- refine performance and mobile adaptation

## Visual Direction Notes

- Avoid generic SaaS aesthetics.
- Avoid overusing purple gradients or default startup visuals.
- Use a visual language that feels more like a title sequence, digital exhibition, or interactive film.
- Typography should feel confident and art-directed.
- Backgrounds should have depth, texture, or atmosphere.
- Motion should include contrast: quiet moments, then dramatic reveals.

## Definition Of Done

The first strong version of the site should achieve the following:

- content from `website-content.html` is fully represented
- the website has a clear storytelling flow
- major sections feel visually distinct
- scroll interactions feel smooth and intentional
- parallax and animation improve immersion
- desktop and mobile experiences both feel polished
- the site communicates X Event as a premium creative studio

## Suggested Claude Code Prompts

Use prompts like these while building:

### Prompt 1

Build the first version of this project as a cinematic storytelling website for X Event. Use `website-content.html` as the source of truth for content and structure. Create a premium visual direction, not a generic agency template.

### Prompt 2

Turn the homepage into a scroll-led narrative experience with strong hierarchy, layered motion, and elegant section transitions. Keep the copy readable and make the motion feel intentional.

### Prompt 3

Introduce GSAP ScrollTrigger-based parallax and reveal choreography across the major sections. Prioritize performance and avoid decorative motion that does not support the story.

### Prompt 4

Add a Three.js-powered visual system for the hero or project showcase area. Keep it atmospheric, cinematic, and lightweight enough for a polished production feel.

### Prompt 5

Review the whole site as a creative director. Strengthen pacing, visual drama, typography choices, and transition quality so the experience feels premium and cohesive.

## Working Agreement For The Agent

When implementing changes, the agent should:

- explain major structural decisions briefly
- keep code organized and scalable
- avoid unnecessary dependencies
- test interaction quality after each major motion pass
- protect the content from becoming secondary to effects

## Next Step

The next practical step is to scaffold the frontend and convert `website-content.html` into reusable sections and components, then layer storytelling motion on top in controlled passes.
