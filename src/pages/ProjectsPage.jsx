import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS } from '../data/projects.js';
import ProjectsWorld from '../three/ProjectsWorld.jsx';
import ProjectModal from '../components/ProjectModal.jsx';
import '../styles/projects-page.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * ProjectsPage
 * --------------------------------------------------------------------
 * The standalone /projects exhibition — a separate "world" from the
 * homepage. A dark spatial chamber, a glowing spine, and a cylindrical
 * rack of glass project panels that the viewer rotates by scrolling.
 *
 * Layout beats:
 *   1. Arrival     — 100vh opening; world materialises, title falls in
 *   2. Exhibition  — pinned stage; panels orbit around the spine on scroll
 *   3. Outro       — calm sign-off + CTA back into the main site
 *
 * Responsiveness:
 *   - Desktop (≥900px + no reduced-motion)  : pinned cylindrical orbit
 *   - Everything else                        : vertical scroll-snapped stack
 *
 * The 3D scene is always on — just its intensity / rotation is gentled
 * for reduced-motion users inside ProjectsWorld itself.
 */
export default function ProjectsPage() {
  const panelsRef = useRef([]);
  const indexItemsRef = useRef([]);
  const progressRef = useRef({ value: 0 });
  const targetActive = useRef(0);
  const currentActive = useRef(0);
  const lastAppliedIdxRef = useRef(-1);
  const [openProject, setOpenProject] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ----- Global progress (drives the 3D world rotation) -----
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          progressRef.current.value = self.progress;
        }
      });

      // ----- Arrival reveal -----
      const arrivalMasks = document.querySelectorAll('.pxarrival .js-mask > span');
      const arrivalRises = document.querySelectorAll('.pxarrival .js-rise');
      gsap.set(arrivalMasks, { yPercent: 110 });
      gsap.set(arrivalRises, { y: 50, autoAlpha: 0, filter: 'blur(10px)' });

      const intro = gsap.timeline({ delay: 0.1 });
      intro
        .to(
          arrivalMasks,
          { yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.1 },
          0
        )
        .to(
          arrivalRises,
          {
            y: 0,
            autoAlpha: 1,
            filter: 'blur(0px)',
            duration: 1.2,
            ease: 'power3.out',
            stagger: 0.1
          },
          0.3
        );

      // Arrival title drifts up as you scroll into the exhibition
      gsap.to('.pxarrival__title', {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.pxarrival',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6
        }
      });
      gsap.to('.pxarrival', {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.pxarrival',
          start: 'center top',
          end: 'bottom top',
          scrub: 0.4
        }
      });

      // ----- Outro reveal -----
      gsap.set('.pxoutro .js-rise', {
        y: 50,
        autoAlpha: 0,
        filter: 'blur(8px)'
      });
      gsap.to('.pxoutro .js-rise', {
        y: 0,
        autoAlpha: 1,
        filter: 'blur(0px)',
        duration: 1.2,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.pxoutro',
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      });

      // ----- Responsive setup for the exhibition -----
      const mm = gsap.matchMedia();

      // DESKTOP — pinned cylindrical orbit
      mm.add(
        '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
        () => {
          // Place panels at the start state so they don't flash from CSS
          // default positions before the first ticker frame runs.
          gsap.set('.pxpanel', { autoAlpha: 1 });
          applyPanels(0);

          const st = ScrollTrigger.create({
            trigger: '.pxexhibit',
            start: 'top top',
            end: () =>
              '+=' +
              Math.round(window.innerHeight * (PROJECTS.length - 0.4) * 0.95),
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            onUpdate: (self) => {
              targetActive.current = self.progress * (PROJECTS.length - 1);
            }
          });

          // Scrub rail width inside the HUD
          gsap.to('.pxhud__rail-fill', {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.pxexhibit',
              start: 'top top',
              end: () => st.end,
              scrub: 0.3
            }
          });

          const ticker = () => {
            currentActive.current +=
              (targetActive.current - currentActive.current) * 0.12;
            applyPanels(currentActive.current);
          };
          gsap.ticker.add(ticker);

          return () => {
            gsap.ticker.remove(ticker);
          };
        }
      );

      // MOBILE / REDUCED — vertical stack with reveal
      mm.add(
        '(max-width: 899px), (prefers-reduced-motion: reduce)',
        () => {
          gsap.set('.pxpanel', {
            clearProps: 'transform,opacity,filter,zIndex',
            autoAlpha: 0,
            y: 50,
            filter: 'blur(8px)'
          });

          ScrollTrigger.batch('.pxpanel', {
            onEnter: (els) =>
              gsap.to(els, {
                y: 0,
                autoAlpha: 1,
                filter: 'blur(0px)',
                duration: 1,
                ease: 'power3.out',
                stagger: 0.08
              }),
            start: 'top 88%'
          });
        }
      );

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    });

    return () => ctx.revert();
  }, []);

  // -----------------------------------------------------------------
  // applyPanels — direct DOM writes, once per tick (no React re-render
  // per scroll event). Panels are positioned as faces of a cylinder
  // centered on the spine: rotateY swings each panel through the core.
  // -----------------------------------------------------------------
  function applyPanels(active) {
    const panels = panelsRef.current;
    const idxItems = indexItemsRef.current;
    const nearest = Math.round(active);

    for (let i = 0; i < panels.length; i++) {
      const el = panels[i];
      if (!el) continue;
      const delta = i - active;
      const abs = Math.abs(delta);
      const angleDeg = delta * 26;
      const rad = (angleDeg * Math.PI) / 180;
      const radius = 640;

      const x = radius * Math.sin(rad);
      const z = -radius * (1 - Math.cos(rad)) - abs * 40;
      const rotY = -angleDeg;
      const opacity = Math.max(0, 1 - abs * 0.48);
      const scale = Math.max(0.72, 1 - abs * 0.07);
      const blurAmt = Math.min(9, Math.max(0, (abs - 0.25) * 3.2));
      const isActive = abs < 0.5;

      el.style.transform =
        `translate3d(calc(-50% + ${x.toFixed(1)}px), -50%, ${z.toFixed(1)}px) ` +
        `rotateY(${rotY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      el.style.opacity = opacity.toFixed(3);
      el.style.filter = `blur(${blurAmt.toFixed(2)}px)`;
      el.style.zIndex = String(1000 - Math.round(abs * 10));
      el.style.pointerEvents = isActive ? 'auto' : 'none';

      if (isActive) el.classList.add('is-active');
      else el.classList.remove('is-active');
    }

    if (lastAppliedIdxRef.current !== nearest) {
      lastAppliedIdxRef.current = nearest;
      setActiveIdx(nearest);
      for (let i = 0; i < idxItems.length; i++) {
        if (!idxItems[i]) continue;
        idxItems[i].classList.toggle('is-active', i === nearest);
      }
    }
  }

  return (
    <>
      <ProjectsWorld progressRef={progressRef} />

      <a href="/" className="pxnav__back" aria-label="Return home">
        <span aria-hidden="true">←</span> Home
      </a>

      <main className="pxpage">
        {/* ---------- Arrival ---------- */}
        <section className="pxarrival" aria-label="Arrival into the archive">
          <p className="pxarrival__marker js-rise">00 / The Archive</p>

          <h1 className="pxarrival__title">
            <span className="pxarrival__row">
              <span className="js-mask"><span>A spatial</span></span>
            </span>
            <span className="pxarrival__row">
              <span className="js-mask"><span><em>index of</em></span></span>
            </span>
            <span className="pxarrival__row">
              <span className="js-mask"><span>selected work.</span></span>
            </span>
          </h1>

          <p className="pxarrival__lead js-rise">
            {PROJECTS.length} projects, suspended around a single light core.
            Scroll to rotate the archive. Enter a face to step inside.
          </p>

          <div className="pxarrival__cue js-rise" aria-hidden="true">
            <span className="pxarrival__cue-line" />
            <span>Scroll to begin</span>
          </div>
        </section>

        {/* ---------- Exhibition ---------- */}
        <section className="pxexhibit" aria-label="Cylindrical project archive">
          <div className="pxexhibit__scrim" aria-hidden="true" />

          <nav className="pxindex" aria-label="Project index">
            <span className="pxindex__label">Index · {PROJECTS.length}</span>
            <ul>
              {PROJECTS.map((p, i) => (
                <li
                  key={p.id}
                  ref={(el) => (indexItemsRef.current[i] = el)}
                  className={i === 0 ? 'is-active' : ''}
                >
                  <span className="pxindex__num">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="pxindex__title">{p.title}</span>
                </li>
              ))}
            </ul>
          </nav>

          <div className="pxhud pxhud--top" aria-hidden="true">
            <span className="pxhud__dot" /> Rotating archive · cylinder 01
          </div>

          <div className="pxstage" aria-hidden="false">
            <div className="pxstage__inner">
              {PROJECTS.map((p, i) => (
                <article
                  key={p.id}
                  ref={(el) => (panelsRef.current[i] = el)}
                  className={`pxpanel ${i === 0 ? 'is-active' : ''}`}
                  style={{
                    '--tint': '#ff6b2c',
                    '--core': '#1b0a04',
                    '--glow': '#ffc48a'
                  }}
                >
                  <button
                    type="button"
                    className="pxpanel__hit"
                    onClick={() => setOpenProject(p)}
                    tabIndex={i === activeIdx ? 0 : -1}
                    aria-label={`Open ${p.title} case study`}
                  />
                  <div className="pxpanel__art" aria-hidden="true">
                    <div className="pxpanel__art-core" />
                    <div className="pxpanel__art-rings" />
                    <div className="pxpanel__art-grid" />
                    <div className="pxpanel__art-noise" />
                  </div>
                  <div className="pxpanel__meta">
                    <h3 className="pxpanel__title">{p.title}</h3>
                    <p className="pxpanel__desc">
                      {p.description.length > 90
                        ? p.description.slice(0, 90) + '... '
                        : p.description}
                      {p.description.length > 90 && (
                        <button
                          type="button"
                          className="pxpanel__more"
                          onClick={() => setOpenProject(p)}
                        >
                          read more
                        </button>
                      )}
                    </p>
                    <span className="pxpanel__cta" aria-hidden="true">
                      Play case study →
                    </span>
                  </div>
                  <div className="pxpanel__frame" aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>

          <div className="pxhud pxhud--bot" aria-hidden="true">
            <div className="pxhud__rail">
              <div className="pxhud__rail-fill" />
            </div>
            <span>Scroll to rotate · Tap an active face to enter</span>
          </div>
        </section>

        {/* ---------- Outro ---------- */}
        <section className="pxoutro" aria-label="Closing scene">
          <p className="pxoutro__marker js-rise">15 / Exit the archive</p>
          <h2 className="pxoutro__title js-rise">
            <em>If</em> you have a bold digital idea,
            <br />
            X Event can turn it into an <em>immersive</em> experience.
          </h2>
          <a href="mailto:sercan@x-event.com.tr" className="pxoutro__cta js-rise">
            Start a project <span aria-hidden="true">→</span>
          </a>
        </section>
      </main>

      <ProjectModal
        project={openProject}
        onClose={() => setOpenProject(null)}
      />
    </>
  );
}
