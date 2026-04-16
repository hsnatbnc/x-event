import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * AtmosphereCanvas
 * --------------------------------------------------
 * A single fixed full-viewport shader plane that
 * underlies every section. It shifts palette based
 * on `progressRef.current.value` (0..1) so the scroll
 * journey reads as one continuous scene rather than
 * disconnected blocks. Mouse gently warps the field
 * for a subtle living-background feel.
 *
 * If the user prefers reduced motion, the canvas still
 * renders but stops animating time / mouse — preserving
 * the static composition without visual drift.
 */
export default function AtmosphereCanvas({ progressRef }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance'
    });
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.domElement.style.display = 'block';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uProgress: { value: 0 },
      uIntensity: { value: reduced ? 0.0 : 1.0 },
      uLogo: { value: null },
      uLogoAspect: { value: 375.0 / 254.0 },
      uLogoReady: { value: 0.0 }
    };

    // Load the XE mark and plug it into the shader once ready.
    // The logo lives *inside* the atmosphere shader as an alpha mask so
    // the smoke field can diffuse, occlude and bloom around it — rather
    // than pasting a DOM <img> on top of the scene.
    const loader = new THREE.TextureLoader();
    loader.load('/xe-mark.png', (tex) => {
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy?.() || 1, 8);
      tex.generateMipmaps = true;
      if ('colorSpace' in tex) tex.colorSpace = THREE.SRGBColorSpace;
      if (tex.image && tex.image.width && tex.image.height) {
        uniforms.uLogoAspect.value = tex.image.width / tex.image.height;
      }
      uniforms.uLogo.value = tex;
      uniforms.uLogoReady.value = 1.0;
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;

        uniform float uTime;
        uniform vec2  uResolution;
        uniform vec2  uMouse;
        uniform float uProgress;
        uniform float uIntensity;
        uniform sampler2D uLogo;
        uniform float uLogoAspect;
        uniform float uLogoReady;

        varying vec2 vUv;

        // --- noise utils --------------------------------------------------
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
            u.y
          );
        }

        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
          for (int i = 0; i < 5; i++) {
            v += a * noise(p);
            p = rot * p * 2.03;
            a *= 0.5;
          }
          return v;
        }

        // --- logo sampler -------------------------------------------------
        // 9-tap box-ish blur reading only the alpha channel. We drive all
        // logo visuals from the mask so the original white pixels are never
        // composited directly — instead we tint the mask with ember light so
        // the mark reads as a warm celestial form behind the smoke.
        float sampleLogoAlpha(vec2 uv, float r) {
          float s  = texture2D(uLogo, uv).a * 0.20;
          s += texture2D(uLogo, uv + vec2( r,  0.0)).a * 0.11;
          s += texture2D(uLogo, uv + vec2(-r,  0.0)).a * 0.11;
          s += texture2D(uLogo, uv + vec2( 0.0,  r)).a * 0.11;
          s += texture2D(uLogo, uv + vec2( 0.0, -r)).a * 0.11;
          s += texture2D(uLogo, uv + vec2( r*0.7,  r*0.7)).a * 0.09;
          s += texture2D(uLogo, uv + vec2(-r*0.7,  r*0.7)).a * 0.09;
          s += texture2D(uLogo, uv + vec2( r*0.7, -r*0.7)).a * 0.09;
          s += texture2D(uLogo, uv + vec2(-r*0.7, -r*0.7)).a * 0.09;
          return s;
        }

        // palette mixing — six "acts" in the scroll journey
        vec3 palette(float p, float tm) {
          // 00 hero — blue #1c43a5 (same as manifesto, continuous blue field)
          vec3 heroAccent = vec3(0.11, 0.26, 0.65);

          // Tint the dark base toward blue.
          vec3 ink   = vec3(0.022, 0.026, 0.042) + heroAccent * 0.018;
          vec3 ember = heroAccent;

          // 01 manifesto — blue #1c43a5
          vec3 blue1 = vec3(0.02,  0.03,  0.065);
          vec3 blue2 = vec3(0.11,  0.26,  0.65);

          // 02 studio — green #84f354
          vec3 grn1  = vec3(0.025, 0.05,  0.02);
          vec3 grn2  = vec3(0.52,  0.95,  0.33);

          // 03 capabilities — orange #e06537
          vec3 org1  = vec3(0.055, 0.03,  0.02);
          vec3 org2  = vec3(0.88,  0.40,  0.22);

          // 04 projects — blue #1c43a5
          vec3 proj1 = vec3(0.02,  0.03,  0.065);
          vec3 proj2 = vec3(0.11,  0.26,  0.65);

          // 05 contact — quiet steel
          vec3 steel1 = vec3(0.035, 0.045, 0.065);
          vec3 steel2 = vec3(0.12,  0.12,  0.16);

          // blend based on progress (0..1) across six acts
          vec3 base, accent;
          if (p < 0.17) {
            float t = smoothstep(0.0, 0.17, p);
            base   = mix(ink,   blue1, t);
            accent = mix(ember, blue2, t);
          } else if (p < 0.34) {
            float t = smoothstep(0.17, 0.34, p);
            base   = mix(blue1, grn1, t);
            accent = mix(blue2, grn2, t);
          } else if (p < 0.51) {
            float t = smoothstep(0.34, 0.51, p);
            base   = mix(grn1,  org1, t);
            accent = mix(grn2,  org2, t);
          } else if (p < 0.68) {
            float t = smoothstep(0.51, 0.68, p);
            base   = mix(org1,  proj1, t);
            accent = mix(org2,  proj2, t);
          } else if (p < 0.85) {
            float t = smoothstep(0.68, 0.85, p);
            base   = mix(proj1, steel1, t);
            accent = mix(proj2, steel2, t);
          } else {
            base   = steel1;
            accent = steel2;
          }

          return base + accent;
        }

        void main() {
          vec2 uv = vUv;
          float aspect = uResolution.x / uResolution.y;
          vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

          float t = uTime * 0.04 * uIntensity;

          // domain warp — creates that slow smoky movement
          vec2 q = vec2(
            fbm(p * 1.3 + vec2(0.0, t)),
            fbm(p * 1.3 + vec2(5.2, -t * 1.1))
          );
          vec2 r = vec2(
            fbm(p + q * 1.5 + vec2(1.7 + t, 9.2)),
            fbm(p + q * 1.5 + vec2(8.3, 2.8 - t))
          );
          float f = fbm(p + r * 1.6);

          vec3 pal = palette(uProgress, uTime);
          // split base/accent by sampling palette at two points
          vec3 base   = palette(uProgress, uTime) * 0.15;
          vec3 accent = palette(uProgress, uTime) * 1.1;

          // core field — base + noise-driven accent bloom
          vec3 col = base;
          col = mix(col, accent, smoothstep(0.25, 0.85, f + r.x * 0.4));
          col = mix(col, accent * 1.25, smoothstep(0.55, 1.0, f * f * 1.2));

          // soft mouse glow — gives the field a subtle living response
          vec2 mp = (uMouse - 0.5) * vec2(aspect, 1.0);
          float mdist = distance(p, mp);
          float glow = smoothstep(0.9, 0.0, mdist) * 0.35 * uIntensity;
          col += accent * glow;

          // --- XE mark — moon behind drifting smoke clouds ----------------
          // Visible in the hero and contact acts; fades out for the middle
          // journey so later sections stay pure atmosphere, then returns
          // as the closing scene bookends the opening.
          float heroWeight    = 1.0 - smoothstep(0.0, 0.16, uProgress);
          float contactWeight = smoothstep(0.85, 0.95, uProgress);
          float logoWeight    = max(heroWeight, contactWeight);
          if (uLogoReady > 0.5 && logoWeight > 0.001) {
            // Weather-driven scale: logo grows when clouds clear,
            // shrinks as clouds roll in. Phase starts at -π/2 so
            // the cycle begins at its trough (hidden, small) and
            // the first motion is always the logo emerging.
            float weatherForScale = smoothstep(0.0, 1.0, sqrt(
              sin(uTime * 0.25 - 1.5708) * 0.5 + 0.5
            ));
            // Intro: fade from zero over the first ~4s so the logo
            // doesn't pop in — it grows out of the atmosphere.
            float intro = smoothstep(0.0, 4.0, uTime);
            weatherForScale *= intro;
            // Shrink to 82% at peak cover, full size when clear.
            float weatherScale = mix(0.82, 1.0, weatherForScale);

            float drift = weatherScale
              + sin(uTime * 0.037) * 0.012 * uIntensity
              + sin(uTime * 0.061 + 1.3) * 0.006 * uIntensity;

            // Place the logo in the optical center.
            // Contact section renders at 60% of hero size.
            float sizeScale = mix(1.0, 0.6, contactWeight);
            vec2 center = vec2(0.5, 0.5);
            vec2 pxOff = (uv - center) * uResolution;
            float targetW = min(uResolution.x * 0.46, 760.0) * drift * sizeScale;
            float targetH = (targetW / uLogoAspect);
            vec2 logoUv = pxOff / vec2(targetW, targetH) + 0.5;

            // Keep the surrounding area clean — any samples off-texture fall
            // to zero so the mark never wraps or hard-edges.
            float insideMask =
                step(0.0, logoUv.x) * step(logoUv.x, 1.0)
              * step(0.0, logoUv.y) * step(logoUv.y, 1.0);

            float softA = sampleLogoAlpha(logoUv, 0.0045) * insideMask;
            float glowA = sampleLogoAlpha(logoUv, 0.028)  * insideMask;
            float haloA = sampleLogoAlpha(logoUv, 0.075)  * insideMask;

            // --- Drifting cloud cover ------------------------------------
            // A second noise layer that physically sweeps across the moon.
            // Keeping it at 2 noise() taps (not full fbm) so we don't blow
            // the per-pixel cost in the heaviest part of the shader.
            float ct = uTime * 0.018 * uIntensity;
            vec2 cloudUv = p;
            float drift1 = noise(cloudUv * 1.8  + vec2(-ct,         ct * 0.25));
            float drift2 = noise(cloudUv * 3.2  + vec2(-ct * 0.45, -ct * 0.15) + vec2(3.1, 2.3));
            // Blend with the background fbm so passing clouds still belong
            // to the same atmosphere — they're not a foreign overlay layer.
            float cloudField = f * 0.55 + (drift1 * 0.65 + drift2 * 0.35) * 0.55;

            // Weather cycle (~10s). Controls how much cloud the
            // noise field pushes over the logo. The smoothstep
            // easing removes any stall at the peaks.
            // ~25s full weather cycle. Square root skews the wave
            // so it lingers in the clear phase (~17s visible) and
            // passes through the hidden dip quickly (~8s).
            // Same phase as scale so clouds and size stay in lockstep.
            // Starts at trough = full cloud cover on page load.
            float weatherSin = sin(uTime * 0.25 - 1.5708) * 0.5 + 0.5;
            float weather = smoothstep(0.0, 1.0, sqrt(weatherSin)) * intro;
            weather = mix(0.55, weather, uIntensity);

            // Threshold driven by weather — this is what makes
            // actual cloud shapes drift across the logo rather
            // than a flat global fade.
            // Low weather  → threshold low  → most noise passes → thick clouds
            // High weather → threshold high → less noise passes → thinner clouds
            float threshold = mix(-0.15, 0.38, weather);
            float cover = smoothstep(threshold, threshold + 0.45, cloudField);

            // Floor: 10-20% cloud always lingers (peak visibility ~80-90%).
            // Ceiling: 1.0 — clouds fully bury the mark, nothing bleeds.
            cover = clamp(cover, 0.12, 1.0);

            float coreOcc = 1.0 - cover;
            float glowOcc = 1.0 - cover;
            float haloOcc = 1.0 - cover;

            // Subdued moon — visible but never blown-out white.
            vec3 moonCore = vec3(0.55, 0.58, 0.70);
            vec3 moonGlow = vec3(0.40, 0.42, 0.55);
            vec3 moonDeep = vec3(0.22, 0.22, 0.30);

            float softVis = coreOcc * logoWeight;
            float glowVis = glowOcc * logoWeight * 0.85;
            float haloVis = haloOcc * logoWeight * 0.55;

            // Layer the three passes: broad halo, mid bloom, soft core.
            col += moonDeep * haloA * haloVis * 0.45;
            col += moonGlow * glowA * glowVis * 0.65;
            col = mix(col, col + moonCore * 0.8, softA * softVis * 0.6);

            // Faint backlit rim — just enough warmth to sense
            // the mark's presence even when nearly buried.
            float backLight = haloA * cover * logoWeight * (1.0 - cover);
            col += moonGlow * backLight * 0.18;
          }

          // Extra dark-fog density for the Event Ecosystem section so
          // text stays readable against the bright green atmosphere.
          float ecoZone = smoothstep(0.12, 0.20, uProgress)
                        * (1.0 - smoothstep(0.30, 0.38, uProgress));
          col *= mix(1.0, 0.4, ecoZone);

          // vignette — pulls the eye toward center content
          float vig = smoothstep(1.4, 0.25, length(p));
          col *= vig * 0.9 + 0.18;

          // darken top and bottom slightly so text never competes
          float topShade = smoothstep(0.0, 0.35, uv.y);
          col *= mix(0.55, 1.0, topShade);
          float botShade = 1.0 - smoothstep(0.75, 1.0, uv.y);
          col *= mix(0.55, 1.0, botShade);

          // subtle film grain — ship only a whisper
          float grain = (hash(uv * uResolution.xy + uTime) - 0.5) * 0.035;
          col += grain;

          gl_FragColor = vec4(col, 1.0);
        }
      `
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // --- interaction ---------------------------------------------------
    const targetMouse = new THREE.Vector2(0.5, 0.5);
    const currentMouse = new THREE.Vector2(0.5, 0.5);

    function onPointerMove(e) {
      targetMouse.x = e.clientX / window.innerWidth;
      targetMouse.y = 1.0 - e.clientY / window.innerHeight;
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    function onResize() {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);

    // --- render loop ---------------------------------------------------
    const clock = new THREE.Clock();
    let rafId = 0;
    function tick() {
      const dt = clock.getDelta();
      uniforms.uTime.value += dt;

      // smooth mouse
      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.04;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.04;
      uniforms.uMouse.value.copy(currentMouse);

      // scroll progress — shared ref updated by scrollStory.js
      const p = (progressRef && progressRef.current && progressRef.current.value) || 0;
      uniforms.uProgress.value += (p - uniforms.uProgress.value) * 0.06;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [progressRef]);

  return <div className="atmosphere" ref={mountRef} aria-hidden="true" />;
}
