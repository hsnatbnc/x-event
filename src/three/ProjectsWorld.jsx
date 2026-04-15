import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ProjectsWorld
 * --------------------------------------------------------------------
 * The sculptural 3D environment behind the /projects exhibition.
 *
 * Everything in the scene is a side-character to the DOM panels — the
 * spine sets mood, the particles dilate space, the halo quietly backs
 * the active project. The scene never competes for the eye; it holds
 * the room so the panels can be read.
 *
 * Layers:
 *   - inner core       — thin pulsing cylinder running floor→ceiling
 *   - helical tube     — twisted shader strand spiraling around the core
 *   - halo rings       — horizontal light rings stacked along Y
 *   - particle field   — instanced drifting points in a void cylinder
 *   - volumetric halo  — backside-rendered sphere that rims the spine
 *
 * Scroll hookup: `progressRef.current.value` (0..1) is written by the
 * page's ScrollTrigger and drives spine rotation + camera Y drift.
 * Reduced motion: the scene still renders, but particle count is lower
 * and auto-rotation is gentled.
 */
export default function ProjectsWorld({ progressRef }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.setClearColor(0x03040a, 1);
    renderer.domElement.style.display = 'block';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x03040a, 9, 28);

    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      90
    );
    camera.position.set(0, 0, 11);
    camera.lookAt(0, 0, 0);

    // ---------------------------------------------------------------
    // Shared uniforms (time + scroll progress)
    // ---------------------------------------------------------------
    const shared = {
      uTime: { value: 0 },
      uProgress: { value: 0 }
    };

    const spine = new THREE.Group();
    scene.add(spine);

    // ---------------------------------------------------------------
    // Helical tube — the main sculptural ribbon around the spine
    // ---------------------------------------------------------------
    const helixPoints = [];
    const HELIX_HEIGHT = 18;
    for (let i = 0; i < 260; i++) {
      const t = i / 259;
      const y = (t - 0.5) * HELIX_HEIGHT;
      const r = 0.85 + Math.sin(t * Math.PI * 4.0) * 0.09;
      const a = t * Math.PI * 11;
      helixPoints.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
    }
    const helixCurve = new THREE.CatmullRomCurve3(helixPoints, false, 'catmullrom', 0);
    const helixGeom = new THREE.TubeGeometry(helixCurve, 520, 0.052, 12, false);

    const helixMat = new THREE.ShaderMaterial({
      uniforms: shared,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        varying vec3 vPos;
        varying vec3 vNormal;
        varying float vY;
        void main() {
          vPos = (modelMatrix * vec4(position, 1.0)).xyz;
          vNormal = normalize(normalMatrix * normal);
          vY = (position.y + 9.0) / 18.0;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform float uProgress;
        varying vec3 vPos;
        varying vec3 vNormal;
        varying float vY;

        void main() {
          vec3 viewDir = normalize(cameraPosition - vPos);
          float fres   = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.0);

          // Hue family: deep violet → magenta → cyan, with warm ember bleed
          vec3 violet  = vec3(0.52, 0.34, 1.00);
          vec3 magenta = vec3(1.00, 0.22, 0.74);
          vec3 cyan    = vec3(0.43, 0.94, 1.00);
          vec3 warm    = vec3(1.00, 0.42, 0.18);

          vec3 low = mix(violet, magenta, smoothstep(0.10, 0.55, vY));
          vec3 col = mix(low, cyan, smoothstep(0.55, 0.95, vY));
          col = mix(col, warm, smoothstep(0.30, 0.42, vY) - smoothstep(0.42, 0.55, vY));

          // travelling shimmer along the ribbon
          float shimmer = 0.5 + 0.5 * sin(vY * 64.0 - uTime * 2.4 + uProgress * 6.283);
          col += shimmer * 0.14;

          float a = clamp(fres * 1.2 + 0.28, 0.0, 1.0);
          gl_FragColor = vec4(col * (fres + 0.45) * 1.55, a);
        }
      `
    });
    const helix = new THREE.Mesh(helixGeom, helixMat);
    spine.add(helix);

    // ---------------------------------------------------------------
    // Inner core — thin pulsing cylinder, the "spine line"
    // ---------------------------------------------------------------
    const coreGeom = new THREE.CylinderGeometry(0.04, 0.04, HELIX_HEIGHT, 20, 1, true);
    const coreMat = new THREE.ShaderMaterial({
      uniforms: shared,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        varying float vY;
        void main() {
          vY = (position.y + 9.0) / 18.0;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        varying float vY;
        void main() {
          vec3 warm = vec3(1.00, 0.62, 0.24);
          vec3 cold = vec3(0.58, 0.44, 1.00);
          vec3 col  = mix(warm, cold, vY);
          float pulse = 0.5 + 0.5 * sin(uTime * 2.4 - vY * 12.0);
          col *= 1.25 + pulse * 0.35;
          gl_FragColor = vec4(col, 0.95);
        }
      `
    });
    const core = new THREE.Mesh(coreGeom, coreMat);
    spine.add(core);

    // ---------------------------------------------------------------
    // Halo rings — horizontal "floors" of the exhibition cylinder
    // ---------------------------------------------------------------
    const ringGroup = new THREE.Group();
    spine.add(ringGroup);
    const ringCount = 9;
    const ringMeshes = [];
    for (let i = 0; i < ringCount; i++) {
      const t = i / (ringCount - 1);
      const y = (t - 0.5) * (HELIX_HEIGHT - 2);
      const radius = 1.15 + (i % 3) * 0.35;
      const rg = new THREE.RingGeometry(radius, radius + 0.014, 160);
      const hue = 0.68 + (i * 0.04);
      const rm = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(hue % 1, 0.85, 0.72),
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const ring = new THREE.Mesh(rg, rm);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = y;
      ring.userData.speed = 0.04 + Math.random() * 0.11;
      ringGroup.add(ring);
      ringMeshes.push(ring);
    }

    // ---------------------------------------------------------------
    // Particle field — atmospheric motes drifting in a void cylinder
    // ---------------------------------------------------------------
    const particleCount = reduced ? 500 : 1800;
    const pgeom = new THREE.BufferGeometry();
    const ppos = new Float32Array(particleCount * 3);
    const pseed = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const r = 1.3 + Math.random() * 6.5;
      const a = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 20;
      ppos[i * 3 + 0] = Math.cos(a) * r;
      ppos[i * 3 + 1] = y;
      ppos[i * 3 + 2] = Math.sin(a) * r;
      pseed[i] = Math.random();
    }
    pgeom.setAttribute('position', new THREE.BufferAttribute(ppos, 3));
    pgeom.setAttribute('seed', new THREE.BufferAttribute(pseed, 1));

    const pmat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: shared.uTime,
        uSize: { value: dpr * 1.7 },
        uDrift: { value: reduced ? 0.0 : 1.0 }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        attribute float seed;
        uniform float uTime;
        uniform float uSize;
        uniform float uDrift;
        varying float vSeed;
        varying float vDist;
        void main() {
          vSeed = seed;
          vec3 p = position;
          float t = uTime * 0.12 * uDrift;
          p.y += sin(t + seed * 6.283) * 0.42;
          p.x += sin(t * 0.73 + seed * 12.56) * 0.28;
          p.z += cos(t * 0.63 + seed * 9.42) * 0.28;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          vDist = -mv.z;
          gl_PointSize = uSize * (240.0 / -mv.z) * (0.35 + seed * 1.0);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vSeed;
        varying float vDist;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          float alpha = smoothstep(0.5, 0.0, d);
          vec3 violet = vec3(0.56, 0.42, 1.00);
          vec3 pink   = vec3(1.00, 0.46, 0.86);
          vec3 cyan   = vec3(0.50, 0.92, 1.00);
          vec3 col = mix(violet, pink, vSeed);
          col = mix(col, cyan, step(0.72, vSeed));
          float fade = smoothstep(28.0, 6.0, vDist);
          gl_FragColor = vec4(col, alpha * 0.75 * fade);
        }
      `
    });
    const particles = new THREE.Points(pgeom, pmat);
    scene.add(particles);

    // ---------------------------------------------------------------
    // Volumetric halo — soft backside sphere rims the spine area
    // ---------------------------------------------------------------
    const haloGeom = new THREE.SphereGeometry(2.6, 40, 26);
    const haloMat = new THREE.ShaderMaterial({
      uniforms: shared,
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        varying vec3 vNormal;
        varying vec3 vWorld;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vNormal;
        varying vec3 vWorld;
        uniform float uTime;
        uniform float uProgress;
        void main() {
          float rim = pow(max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0))), 1.6);
          vec3 deep  = vec3(0.10, 0.05, 0.28);
          vec3 flare = mix(vec3(0.85, 0.30, 0.80), vec3(0.50, 0.94, 1.0),
                           smoothstep(0.2, 0.8, fract(uProgress + 0.15)));
          vec3 col = mix(deep, flare, rim);
          float shim = 0.5 + 0.5 * sin(uTime * 0.6 + vWorld.y * 1.3);
          gl_FragColor = vec4(col * (0.8 + shim * 0.2), rim * 0.42);
        }
      `
    });
    const halo = new THREE.Mesh(haloGeom, haloMat);
    spine.add(halo);

    // ---------------------------------------------------------------
    // Interaction — resize + render loop
    // ---------------------------------------------------------------
    function onResize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let rafId = 0;
    function tick() {
      const dt = Math.min(clock.getDelta(), 0.05);
      shared.uTime.value += dt;

      const p =
        (progressRef && progressRef.current && progressRef.current.value) || 0;
      shared.uProgress.value += (p - shared.uProgress.value) * 0.08;

      // Spine rotates slowly on its own + scroll sweeps it through 2π.
      // Scroll rotation is the "rotating carousel" beat the DOM panels ride.
      spine.rotation.y =
        shared.uTime.value * (reduced ? 0.025 : 0.06) + p * Math.PI * 2.2;

      // Rings spin independently at different speeds so the cylinder
      // feels like layered machinery, not a single rigid tube.
      for (let i = 0; i < ringMeshes.length; i++) {
        ringMeshes[i].rotation.z += ringMeshes[i].userData.speed * dt;
      }

      // Camera drifts vertically with scroll — the viewer "travels"
      // down the spine as they advance through the archive.
      camera.position.y = (p - 0.5) * 2.6;
      if (!reduced) {
        camera.position.x = Math.sin(shared.uTime.value * 0.2) * 0.35;
      }
      camera.lookAt(0, camera.position.y * 0.4, 0);

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      helixGeom.dispose();
      helixMat.dispose();
      coreGeom.dispose();
      coreMat.dispose();
      pgeom.dispose();
      pmat.dispose();
      haloGeom.dispose();
      haloMat.dispose();
      ringMeshes.forEach((r) => {
        r.geometry.dispose();
        r.material.dispose();
      });
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [progressRef]);

  return <div className="pxworld__bg" ref={mountRef} aria-hidden="true" />;
}
