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

        // palette mixing — five "acts" in the scroll journey
        vec3 palette(float p, float tm) {
          // 00 hero — deep ink + slowly cycling blue / red / purple accent.
          // The three stops are tuned to near-equal luminance so the smoke
          // keeps the same contrast as the eye moves through the hues — only
          // the *temperature* of the scene shifts, never its weight.
          vec3 heroBlue   = vec3(0.18, 0.40, 1.00);
          vec3 heroRed    = vec3(1.00, 0.22, 0.30);
          vec3 heroOrange = vec3(1.00, 0.42, 0.17);

          // ~30s full loop (cyc = tm * 0.033 → period ≈ 30s). Three equal
          // thirds with smoothstep easing on each leg so transitions slow-in
          // and slow-out rather than clipping between colors.
          float phase = fract(tm * 0.033);
          vec3 heroAccent;
          if (phase < 0.3333) {
            heroAccent = mix(heroOrange, heroRed,    smoothstep(0.0,    0.3333, phase));
          } else if (phase < 0.6666) {
            heroAccent = mix(heroRed,    heroBlue,   smoothstep(0.3333, 0.6666, phase));
          } else {
            heroAccent = mix(heroBlue,   heroOrange, smoothstep(0.6666, 1.0,    phase));
          }

          // Tint the dark base a hair toward the current hero hue so the
          // shadows and highlights belong to the same world.
          vec3 ink   = vec3(0.022, 0.026, 0.042) + heroAccent * 0.018;
          vec3 coal  = heroAccent * 0.35;
          vec3 ember = heroAccent;

          // 01 manifesto — quiet steel
          vec3 steel1 = vec3(0.035, 0.045, 0.065);
          vec3 steel2 = vec3(0.12,  0.12,  0.16);

          // 02 studio — warm umber
          vec3 umber1 = vec3(0.06,  0.045, 0.035);
          vec3 umber2 = vec3(0.55,  0.24,  0.09);

          // 03 capabilities — midnight graphite
          vec3 graph1 = vec3(0.03,  0.035, 0.05);
          vec3 graph2 = vec3(0.22,  0.14,  0.28);

          // 04 projects — amber horizon
          vec3 amber1 = vec3(0.05,  0.04,  0.055);
          vec3 amber2 = vec3(0.85,  0.52,  0.18);

          // 05 contact — calm dusk
          vec3 dusk1  = vec3(0.04,  0.035, 0.05);
          vec3 dusk2  = vec3(0.92,  0.38,  0.14);

          // blend based on progress (0..1) across six acts
          vec3 base, accent;
          if (p < 0.18) {
            float t = smoothstep(0.0, 0.18, p);
            base   = mix(ink,    steel1, t);
            accent = mix(ember,  steel2, t);
          } else if (p < 0.38) {
            float t = smoothstep(0.18, 0.38, p);
            base   = mix(steel1, umber1, t);
            accent = mix(steel2, umber2, t);
          } else if (p < 0.6) {
            float t = smoothstep(0.38, 0.6, p);
            base   = mix(umber1, graph1, t);
            accent = mix(umber2, graph2, t);
          } else if (p < 0.82) {
            float t = smoothstep(0.6, 0.82, p);
            base   = mix(graph1, amber1, t);
            accent = mix(graph2, amber2, t);
          } else {
            float t = smoothstep(0.82, 1.0, p);
            base   = mix(amber1, dusk1, t);
            accent = mix(amber2, dusk2, t);
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
          // Only blended into the hero act; the logo fades out as the next
          // scene takes over so later sections stay pure atmosphere.
          float heroWeight = 1.0 - smoothstep(0.0, 0.16, uProgress);
          if (uLogoReady > 0.5 && heroWeight > 0.001) {
            // Very slow scale breathing so the mark feels like it's drifting
            // through depth rather than sitting flat.
            float drift = 1.0
              + sin(uTime * 0.037) * 0.012 * uIntensity
              + sin(uTime * 0.061 + 1.3) * 0.006 * uIntensity;

            // Place the logo in the optical center.
            vec2 center = vec2(0.5, 0.5);
            vec2 pxOff = (uv - center) * uResolution;
            float targetW = min(uResolution.x * 0.46, 760.0) * drift;
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
            float ct = uTime * 0.05 * uIntensity;
            vec2 cloudUv = p;
            float drift1 = noise(cloudUv * 2.7  + vec2(-ct,         ct * 0.30));
            float drift2 = noise(cloudUv * 5.3  + vec2(-ct * 0.55, -ct * 0.18) + vec2(3.1, 2.3));
            // Blend with the background fbm so passing clouds still belong
            // to the same atmosphere — they're not a foreign overlay layer.
            float cloudField = f * 0.55 + (drift1 * 0.65 + drift2 * 0.35) * 0.55;

            // Slow weather front (~14s period). Low weather = thick cover,
            // high weather = clear sky. The threshold range crosses zero so
            // peak coverage genuinely buries the moon end-to-end, and peak
            // clearing fully reveals it.
            float weatherRaw = sin(uTime * 0.45 + 0.3) * 0.5 + 0.5;
            weatherRaw += sin(uTime * 0.17 + 1.7) * 0.05;
            float weather = clamp(weatherRaw, 0.0, 1.0);
            weather = mix(0.55, weather, uIntensity);
            float threshold = mix(-0.10, 0.55, weather);
            float cover = smoothstep(threshold, threshold + 0.32, cloudField);

            // Per-layer occlusion — thick smoke hides the disc completely
            // but the outer halo bleeds through (atmospheric scatter), so
            // even at full cover you sense a warm presence behind the cloud.
            float coreOcc = 1.0 - cover;
            float glowOcc = 1.0 - cover * 0.88;
            float haloOcc = 1.0 - cover * 0.55;

            // Ember palette — warm moon core + deeper coal halo.
            vec3 moonCore = vec3(1.00, 0.66, 0.34);
            vec3 moonGlow = vec3(1.00, 0.42, 0.14);
            vec3 moonDeep = vec3(0.55, 0.16, 0.05);

            float softVis = coreOcc * heroWeight;
            float glowVis = glowOcc * heroWeight * 0.95;
            float haloVis = haloOcc * heroWeight * 0.7;

            // Layer the three passes: broad halo, mid bloom, soft core.
            col += moonDeep * haloA * haloVis * 0.55;
            col += moonGlow * glowA * glowVis * 0.85;
            col = mix(col, col + moonCore * 1.35, softA * softVis * 0.78);

            // Backlit smoke: where cloud sits over the halo, paint a warm
            // rim into the cloud itself so the smoke reads as moonlit
            // vapour, not a black void crossing the disc.
            float backLight = haloA * cover * heroWeight;
            col += moonGlow * backLight * 0.22;
          }

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
