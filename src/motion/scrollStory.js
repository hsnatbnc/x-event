import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * scrollStory
 * -----------------------------------------
 * The entire page's motion vocabulary lives here.
 * One easing family, one timing scale, one reveal
 * primitive — so every section feels like part of
 * the same film. Individual sections do not register
 * their own ScrollTriggers.
 */
export default function setupScrollStory({ progressRef }) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ctx = gsap.context(() => {
    // Own all initial states in JS so GSAP's transform tracking is in sync
    // with the visual state — avoids flashes and CSS/GSAP conflicts.
    gsap.set('.js-mask > span', { yPercent: 110 });
    gsap.set('.js-rise', { y: 40, autoAlpha: 0, filter: 'blur(6px)' });
    gsap.set('.js-fade', { autoAlpha: 0 });

    // Global progress signal used by the Three.js atmosphere.
    // Not a GSAP tween — a direct scroll-mapped value ref.
    ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        if (progressRef && progressRef.current) {
          progressRef.current.value = self.progress;
        }
      }
    });

    // Progress rail
    gsap.to('.js-progress-bar', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3
      }
    });

    // --------------------------------------------------------------
    // HERO — orchestrated opening sequence
    // --------------------------------------------------------------
    const heroMasks = document.querySelectorAll('.hero .js-mask > span');
    const heroFades = document.querySelectorAll('.hero .js-fade');
    const heroRise  = document.querySelectorAll('.hero .js-rise');

    const intro = gsap.timeline({
      defaults: { ease: 'expo.out' },
      delay: 0.15
    });

    if (!reduced) {
      intro
        .to(heroFades, { autoAlpha: 1, duration: 1.2, stagger: 0.08 }, 0)
        .to(
          heroMasks,
          {
            yPercent: 0,
            duration: 1.4,
            stagger: 0.09,
            ease: 'expo.out'
          },
          0.05
        )
        .to(
          heroRise,
          {
            y: 0,
            autoAlpha: 1,
            filter: 'blur(0px)',
            duration: 1.2,
            stagger: 0.1,
            ease: 'power3.out'
          },
          0.4
        );
    } else {
      gsap.set([heroFades, heroRise], { autoAlpha: 1, filter: 'none', y: 0 });
      gsap.set(heroMasks, { yPercent: 0 });
    }

    // Hero headline drift on scroll — pulls focus down into manifesto
    if (!reduced) {
      gsap.to('.hero__headline', {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6
        }
      });
      gsap.to('.hero__footer', {
        yPercent: -40,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6
        }
      });
    }

    // --------------------------------------------------------------
    // Shared section reveal — mask headings, rise bodies
    // --------------------------------------------------------------
    const sections = gsap.utils.toArray('.scene:not(.hero)');
    sections.forEach((section) => {
      const masks = section.querySelectorAll('.js-mask > span');
      const rises = section.querySelectorAll('.js-rise');
      const fades = section.querySelectorAll('.js-fade');

      if (reduced) {
        gsap.set([rises, fades], { autoAlpha: 1, y: 0, filter: 'none' });
        gsap.set(masks, { yPercent: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          toggleActions: 'play none none none'
        }
      });

      if (masks.length) {
        tl.to(
          masks,
          {
            yPercent: 0,
            duration: 1.2,
            ease: 'expo.out',
            stagger: 0.08
          },
          0
        );
      }
      if (rises.length) {
        tl.to(
          rises,
          {
            y: 0,
            autoAlpha: 1,
            filter: 'blur(0px)',
            duration: 1,
            ease: 'power3.out',
            stagger: 0.08
          },
          0.15
        );
      }
      if (fades.length) {
        tl.to(
          fades,
          {
            autoAlpha: 1,
            duration: 1,
            ease: 'power2.out',
            stagger: 0.05
          },
          0.1
        );
      }
    });

    // --------------------------------------------------------------
    // MANIFESTO — scrubbed word-by-word reveal (scene hero moment)
    // --------------------------------------------------------------
    const manifestoWords = document.querySelectorAll('.manifesto .word');
    if (manifestoWords.length && !reduced) {
      gsap.to(manifestoWords, {
        opacity: 1,
        ease: 'none',
        stagger: { each: 0.05, from: 'start' },
        scrollTrigger: {
          trigger: '.manifesto',
          start: 'top 80%',
          end: 'bottom 70%',
          scrub: 0.6
        }
      });
    } else {
      gsap.set(manifestoWords, { opacity: 1 });
    }

    // --------------------------------------------------------------
    // CAPABILITIES — pinned rows, one highlights at a time
    // --------------------------------------------------------------
    const capRows = gsap.utils.toArray('.cap-row');
    if (capRows.length && !reduced && window.innerWidth > 760) {
      // Stage rows so the pin has visible motion to scrub through —
      // without this, the section feels frozen during the pin.
      gsap.set(capRows, { y: 40, autoAlpha: 0.2 });

      const capTl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: '.cap-pin',
          start: 'top top',
          end: () => '+=' + window.innerHeight * 1.4,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.6,
          onUpdate: (self) => {
            const raw = self.progress * capRows.length;
            const idx = Math.max(
              0,
              Math.min(capRows.length - 1, Math.floor(raw))
            );
            capRows.forEach((r, i) =>
              r.classList.toggle('is-active', i === idx)
            );
          }
        }
      });

      capRows.forEach((row, i) => {
        capTl.to(row, { y: 0, autoAlpha: 1, duration: 0.8 }, i * 0.8);
      });
      // Tail beat keeps the last row on screen before the pin releases
      capTl.to({}, { duration: 0.6 });
    } else {
      // Mobile / reduced motion: keep rows statically lit
      capRows.forEach((r) => r.classList.add('is-active'));
    }

    // --------------------------------------------------------------
    // PROJECTS — marquee drift on scroll (scrubbed parallax)
    // --------------------------------------------------------------
    const marqueeTrack = document.querySelector('.projects__marquee-track');
    if (marqueeTrack && !reduced) {
      const trackWidth = marqueeTrack.scrollWidth;
      gsap.to(marqueeTrack, {
        x: () => -(trackWidth - window.innerWidth) * 0.5,
        ease: 'none',
        scrollTrigger: {
          trigger: '.projects__marquee',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8
        }
      });
    }

    // Project card tilt/glow — tracks pointer for each card
    document.querySelectorAll('.project-card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * 100;
        const my = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', `${mx}%`);
        card.style.setProperty('--my', `${my}%`);
      });
    });

    // --------------------------------------------------------------
    // Refresh once fonts have loaded — serif metrics change layout
    // --------------------------------------------------------------
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
  });

  return ctx;
}
