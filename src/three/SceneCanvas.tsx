import { useEffect, useLayoutEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { sceneRuntime, setSceneReady, setSceneFailed } from '../state/intro';
import type { Quality } from '../hooks/useMedia';

/* -------------------------------------------------------------------------- */
/* Original 3D environment: a glowing orb with an orbit ring, faceted rocks,   */
/* lime/lavender crystals and drifting particles on three depth layers.        */
/* Collision avoidance: lightweight bounding-sphere repulsion, delta-time      */
/* based, preserving all existing animations and camera movement.              */
/* -------------------------------------------------------------------------- */

export type SceneMode = 'hero' | 'ambient';

interface Props {
  mode: SceneMode;
  quality: Quality;
  reduced: boolean;
  paused: boolean;
}

type Layer = 'bg' | 'mid' | 'fg';
type Kind = 'rock' | 'crystal';

interface Spec {
  id: number;
  kind: Kind;
  layer: Layer;
  base: [number, number, number];
  scale: number;
  color: string;
  emissive: string;
  variant: number;
  speed: number;
  amp: number;
  spin: [number, number, number];
  phase: number;
}

type Smooth = MutableRefObject<{ x: number; y: number }>;

/**
 * Shared registry of live world-space positions for all Floaters.
 * Updated once per frame by each Floater before the repulsion pass,
 * read in the same frame by all neighbours.
 */
interface FloaterEntry {
  id: number;
  /** Approximate bounding sphere radius (world units, includes scale). */
  radius: number;
  pos: THREE.Vector3;
}
type PositionsRegistry = MutableRefObject<FloaterEntry[]>;

/** Pointer response per depth layer: parallax (world units), tilt (radians), push strength. */
const DEPTH = {
  bg: { par: 0.35, rot: 0.2, push: 0 },
  mid: { par: 0.95, rot: 0.45, push: 0.9 },
  fg: { par: 1.9, rot: 0.8, push: 1.6 },
} as const;

const CAM_TIGHT = 5.2;
const CAM_WIDE = 14;

/* ----------------------------- helpers ----------------------------------- */

const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** Faceted rock: displace icosahedron vertices by a position-hash so shared vertices stay joined. */
const makeRock = (seed: number) => {
  const g = new THREE.IcosahedronGeometry(1, 1);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const rnd = mulberry32(seed);
  const ox = rnd() * 50;
  const oy = rnd() * 50;
  const oz = rnd() * 50;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const h = Math.sin((v.x + ox) * 12.9898 + (v.y + oy) * 78.233 + (v.z + oz) * 37.719) * 43758.5453;
    const n = h - Math.floor(h);
    v.multiplyScalar(0.78 + n * 0.46);
    pos.setXYZ(i, v.x, v.y * 0.86, v.z);
  }
  g.computeVertexNormals();
  return g;
};

const ROCK_COLORS = ['#2a1458', '#3b1c7a', '#5a2bc2', '#170b30', '#4a2399'];
const CRYSTAL_COLORS: [string, string][] = [
  ['#b8f55a', '#6ea61c'],
  ['#d4c4ff', '#8a6ee0'],
  ['#9a63ff', '#5a2bc2'],
];

const buildSpecs = (quality: Quality, mode: SceneMode): Spec[] => {
  const counts = {
    high: { rocks: 13, crystals: 7 },
    medium: { rocks: 8, crystals: 4 },
    low: { rocks: 5, crystals: 3 },
  }[quality];
  const factor = mode === 'ambient' ? 0.6 : 1;
  const rocks = Math.round(counts.rocks * factor);
  const crystals = Math.round(counts.crystals * factor);

  const rnd = mulberry32(2024);
  const specs: Spec[] = [];
  const total = rocks + crystals;

  for (let i = 0; i < total; i++) {
    const kind: Kind = i < rocks ? 'rock' : 'crystal';
    const r = rnd();
    const layer: Layer = r < 0.4 ? 'bg' : r < 0.75 ? 'mid' : 'fg';
    const z =
      layer === 'bg' ? -9 + rnd() * 4 : layer === 'mid' ? -4 + rnd() * 4 : 1.5 + rnd() * 2.5;

    // Visible half-extents at that depth from the final camera position.
    const dist = CAM_WIDE - z;
    const halfH = Math.tan((22.5 * Math.PI) / 180) * dist;
    const halfW = halfH * 1.78;

    let x = (rnd() < 0.5 ? -1 : 1) * (0.14 + rnd() * 0.8) * halfW;
    // keep the central reading column clear for non-background objects
    if (layer !== 'bg' && Math.abs(x) < halfW * 0.3) x = Math.sign(x || 1) * halfW * (0.32 + rnd() * 0.3);
    const y = (rnd() * 2 - 1) * halfH * 0.85;

    const scale =
      kind === 'crystal'
        ? 0.28 + rnd() * 0.3
        : layer === 'bg'
          ? 0.5 + rnd() * 0.6
          : layer === 'mid'
            ? 0.7 + rnd() * 0.7
            : 1.1 + rnd() * 1.0;

    const crystal = CRYSTAL_COLORS[Math.floor(rnd() * CRYSTAL_COLORS.length)];
    specs.push({
      id: i,
      kind,
      layer,
      base: [x, y, z],
      scale,
      color: kind === 'rock' ? ROCK_COLORS[Math.floor(rnd() * ROCK_COLORS.length)] : crystal[0],
      emissive: kind === 'rock' ? '#1a0a3a' : crystal[1],
      variant: Math.floor(rnd() * 3),
      speed: 0.25 + rnd() * 0.4,
      amp: 0.12 + rnd() * 0.22,
      spin: [(rnd() - 0.5) * 0.25, (rnd() - 0.5) * 0.3, (rnd() - 0.5) * 0.15],
      phase: rnd() * Math.PI * 2,
    });
  }
  return specs;
};

/* ----------------------------- rig --------------------------------------- */

/** Smooths the pointer once per frame and drives the camera. Must be mounted before the floaters. */
const Rig = ({ smooth, reduced }: { smooth: Smooth; reduced: boolean }) => {
  const { camera, size, invalidate } = useThree();
  const aspect = size.width / size.height;

  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = aspect < 1 ? 56 : 45;
    cam.updateProjectionMatrix();
  }, [camera, aspect]);

  const place = (t: number) => {
    const portrait = aspect < 1 ? 1 + (1 - aspect) * 0.35 : 1;
    camera.position.set(
      smooth.current.x * 0.6 * t,
      0.5 + smooth.current.y * 0.35 * t,
      THREE.MathUtils.lerp(CAM_TIGHT, CAM_WIDE, t) * portrait,
    );
    camera.lookAt(0, 0.7, -2);
    camera.rotation.z += (1 - t) * -0.05;
  };

  // Reduced motion: a single static, fully pulled-back frame.
  useLayoutEffect(() => {
    if (!reduced) return;
    sceneRuntime.cameraIntro = 1;
    place(1);
    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, aspect]);

  useFrame((_, delta) => {
    if (reduced) return;
    const dt = Math.min(delta, 0.05);
    const p = sceneRuntime.pointer;
    smooth.current.x = THREE.MathUtils.damp(smooth.current.x, p.x, 2.4, dt);
    smooth.current.y = THREE.MathUtils.damp(smooth.current.y, p.y, 2.4, dt);
    place(sceneRuntime.cameraIntro);
  });

  return null;
};

/* ----------------------------- objects ----------------------------------- */

interface FloaterProps {
  spec: Spec;
  geometry: THREE.BufferGeometry;
  smooth: Smooth;
  reduced: boolean;
  shadows: boolean;
  /** Shared registry of all floater positions — used for soft collision avoidance. */
  registry: PositionsRegistry;
}

const Floater = ({ spec, geometry, smooth, reduced, shadows, registry }: FloaterProps) => {
  const root = useRef<THREE.Group>(null!);
  const body = useRef<THREE.Mesh>(null!);
  const push = useRef({ x: 0, y: 0 });
  /** Smooth repulsion displacement applied on top of the base animation. */
  const repulse = useRef(new THREE.Vector3());
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const k = DEPTH[spec.layer];

  /**
   * Approximate bounding sphere: crystals are slender, rocks are rounder.
   * 1.15x scale ensures a protective buffer preventing surface penetration.
   */
  const boundingRadius = spec.scale * (spec.kind === 'crystal' ? 0.65 : 1.15);

  const entryRef = useRef<FloaterEntry>({
    id: spec.id,
    radius: boundingRadius,
    pos: new THREE.Vector3(spec.base[0], spec.base[1], spec.base[2]),
  });

  // Register this floater in the shared registry.
  useLayoutEffect(() => {
    const entry = entryRef.current;
    entry.radius = boundingRadius;
    registry.current.push(entry);
    return () => {
      registry.current = registry.current.filter((e) => e !== entry);
    };
  }, [boundingRadius, registry]);

  // Static placement (also the final pose for reduced motion).
  useLayoutEffect(() => {
    root.current.position.set(spec.base[0], spec.base[1], spec.base[2]);
    body.current.rotation.set(spec.phase, spec.phase * 0.7, 0);
  }, [spec]);

  useFrame((state, delta) => {
    if (reduced) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const aspect = state.size.width / state.size.height;
    const spread = THREE.MathUtils.clamp(aspect / 1.78, 0.4, 1);
    const intro = Math.max(sceneRuntime.cameraIntro, 0.35);

    const px = smooth.current.x * k.par * intro;
    const py = smooth.current.y * k.par * 0.65 * intro;

    // Gentle push away from the pointer (mid/foreground only).
    let tx = 0;
    let ty = 0;
    if (k.push > 0 && sceneRuntime.pointerActive) {
      tmp.set(
        root.current.position.x,
        root.current.position.y,
        root.current.position.z,
      ).project(state.camera);
      const dx = (tmp.x - sceneRuntime.pointer.x) * aspect;
      const dy = tmp.y - sceneRuntime.pointer.y;
      const d = Math.hypot(dx, dy);
      const R = 0.5;
      if (d < R && d > 1e-4) {
        const f = (1 - d / R) ** 2;
        tx = (dx / d / aspect) * f * k.push * spec.scale;
        ty = (dy / d) * f * k.push * spec.scale;
      }
    }
    push.current.x = THREE.MathUtils.damp(push.current.x, tx, 3, dt);
    push.current.y = THREE.MathUtils.damp(push.current.y, ty, 3, dt);

    // Compute the intended position for this frame (before repulsion).
    const ix = spec.base[0] * spread + Math.sin(t * spec.speed + spec.phase) * spec.amp * 0.7 + px + push.current.x;
    const iy = spec.base[1] + Math.cos(t * spec.speed * 0.8 + spec.phase) * spec.amp + py + push.current.y;
    const iz = spec.base[2];

    // --- Soft 3D collision avoidance via bounding spheres ---
    let repX = 0;
    let repY = 0;
    let repZ = 0;
    const myRadius = boundingRadius;
    const reg = registry.current;

    for (let n = 0; n < reg.length; n++) {
      const other = reg[n];
      if (other.id === spec.id) continue;

      const dx = ix - other.pos.x;
      const dy = iy - other.pos.y;
      const dz = iz - other.pos.z;
      const dist3D = Math.hypot(dx, dy, dz);
      const minDist = myRadius + other.radius;

      if (dist3D < minDist && dist3D > 1e-4) {
        // Overlap ratio (0 at surface touch, approaching 1 at center overlap)
        const overlap = minDist - dist3D;
        const factor = Math.min(overlap / minDist, 1);
        // Smooth quadratic repulsive force
        const force = factor * factor * minDist * 0.45;

        let nx = dx / dist3D;
        let ny = dy / dist3D;
        let nz = dz / dist3D;

        // Tangential deflection: allows objects to glide naturally around each other
        const dist2D = Math.hypot(dx, dy);
        if (dist2D < minDist * 0.5) {
          const tx = -ny || Math.cos(spec.phase);
          const ty = nx || Math.sin(spec.phase);
          nx += tx * 0.35;
          ny += ty * 0.35;
          const len = Math.hypot(nx, ny, nz) || 1;
          nx /= len;
          ny /= len;
          nz /= len;
        }

        repX += nx * force;
        repY += ny * force;
        repZ += nz * force * 0.35;
      }
    }

    // Gentle central orb repulsion in hero mode
    const orbDist = Math.hypot(ix - smooth.current.x * 0.3, iy - 1.5, iz - (-2));
    const orbMinDist = myRadius + 2.0;
    if (orbDist < orbMinDist && orbDist > 1e-4) {
      const orbOverlap = orbMinDist - orbDist;
      const orbFactor = Math.min(orbOverlap / orbMinDist, 1);
      const orbForce = orbFactor * orbFactor * 1.2;
      repX += ((ix - smooth.current.x * 0.3) / orbDist) * orbForce;
      repY += ((iy - 1.5) / orbDist) * orbForce;
    }

    // Smooth the repulsion to prevent jitter; decays smoothly to 0 when clear
    const dampRate = 2.8;
    repulse.current.x = THREE.MathUtils.damp(repulse.current.x, repX, dampRate, dt);
    repulse.current.y = THREE.MathUtils.damp(repulse.current.y, repY, dampRate, dt);
    repulse.current.z = THREE.MathUtils.damp(repulse.current.z, repZ, dampRate, dt);

    // Apply final position: intended trajectory + smoothed repulsion
    const fx = ix + repulse.current.x;
    const fy = iy + repulse.current.y;
    const fz = iz + repulse.current.z;

    root.current.position.set(fx, fy, fz);
    root.current.rotation.y = smooth.current.x * k.rot * 0.5;
    root.current.rotation.x = -smooth.current.y * k.rot * 0.35;

    body.current.rotation.x += spec.spin[0] * dt;
    body.current.rotation.y += spec.spin[1] * dt;
    body.current.rotation.z += spec.spin[2] * dt;

    // Direct reference update — zero allocation, zero search overhead
    entryRef.current.pos.set(fx, fy, fz);
  });

  const isCrystal = spec.kind === 'crystal';
  return (
    <group ref={root}>
      <mesh ref={body} geometry={geometry} scale={spec.scale} castShadow={shadows}>
        <meshStandardMaterial
          color={spec.color}
          emissive={spec.emissive}
          emissiveIntensity={isCrystal ? 0.9 : 0.22}
          flatShading
          roughness={isCrystal ? 0.25 : 0.85}
          metalness={isCrystal ? 0.25 : 0.05}
        />
      </mesh>
    </group>
  );
};

const Orb = ({ smooth, reduced, shadows }: { smooth: Smooth; reduced: boolean; shadows: boolean }) => {
  const group = useRef<THREE.Group>(null!);
  const orbit = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    if (reduced) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    group.current.position.set(smooth.current.x * 0.3, 1.5 + Math.sin(t * 0.5) * 0.12 + smooth.current.y * 0.15, -2);
    group.current.rotation.y = smooth.current.x * 0.25;
    group.current.rotation.x = -smooth.current.y * 0.12;
    orbit.current.rotation.z += dt * 0.35;
  });

  return (
    <group ref={group} position={[0, 1.5, -2]}>
      <mesh castShadow={shadows}>
        <sphereGeometry args={[1.7, 64, 48]} />
        <meshStandardMaterial color="#6a35e0" roughness={0.4} metalness={0.15} emissive="#2a0f66" emissiveIntensity={0.7} />
      </mesh>
      {/* soft rim glow */}
      <mesh scale={1.14}>
        <sphereGeometry args={[1.7, 40, 28]} />
        <meshBasicMaterial color="#9a63ff" transparent opacity={0.13} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      {/* orbit ring with a lime bead */}
      <group rotation={[1.15, 0.3, 0]}>
        <mesh>
          <torusGeometry args={[2.55, 0.028, 12, 180]} />
          <meshBasicMaterial color="#d4c4ff" transparent opacity={0.7} />
        </mesh>
        <group ref={orbit}>
          <mesh position={[2.55, 0, 0]}>
            <icosahedronGeometry args={[0.14, 0]} />
            <meshBasicMaterial color="#b8f55a" />
          </mesh>
        </group>
      </group>
    </group>
  );
};

const Particles = ({ count, smooth, reduced }: { count: number; smooth: Smooth; reduced: boolean }) => {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const rnd = mulberry32(77);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rnd() * 2 - 1) * 18;
      arr[i * 3 + 1] = (rnd() * 2 - 1) * 10;
      arr[i * 3 + 2] = -10 + rnd() * 15;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y += Math.min(delta, 0.05) * 0.01;
    ref.current.position.x = smooth.current.x * 0.9;
    ref.current.position.y = smooth.current.y * 0.5 + Math.sin(t * 0.12) * 0.25;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#d4c4ff" transparent opacity={0.65} sizeAttenuation depthWrite={false} />
    </points>
  );
};

const KeyLight = ({ shadows }: { shadows: boolean }) => {
  const ref = useRef<THREE.DirectionalLight>(null!);
  useLayoutEffect(() => {
    const l = ref.current;
    if (!shadows) return;
    l.shadow.mapSize.set(1024, 1024);
    const c = l.shadow.camera;
    c.left = -18;
    c.right = 18;
    c.top = 14;
    c.bottom = -14;
    c.near = 1;
    c.far = 45;
    c.updateProjectionMatrix();
    l.shadow.bias = -0.0005;
  }, [shadows]);
  return <directionalLight ref={ref} castShadow={shadows} position={[-3, 5, 10]} intensity={2.6} color="#e6dcff" />;
};

/* ----------------------------- floating islands --------------------------- */

interface IslandConfig {
  /** World-space base position */
  base: [number, number, number];
  /** Uniform scale applied to the whole island group */
  scale: number;
  /** Parallax depth multiplier (how strongly mouse moves this island) */
  parallax: number;
  /** Float-cycle speed multiplier */
  floatSpeed: number;
  /** Float amplitude (world units) */
  floatAmp: number;
  /** Slow y-rotation speed (rad/s) */
  rotSpeed: number;
  /** Animation phase offset */
  phase: number;
}

/** A single low-poly floating island built entirely from Three.js primitives. */
const FloatingIsland = ({
  cfg,
  smooth,
  reduced,
}: {
  cfg: IslandConfig;
  smooth: Smooth;
  reduced: boolean;
}) => {
  const root = useRef<THREE.Group>(null!);

  /* ---- shared materials (memoised per island so they're not recreated) ---- */
  const mats = useMemo(() => {
    const rock = new THREE.MeshStandardMaterial({
      color: '#1e0d40',
      emissive: '#0d0520',
      emissiveIntensity: 0.3,
      flatShading: true,
      roughness: 0.9,
      metalness: 0.05,
    });
    const terrain = new THREE.MeshStandardMaterial({
      color: '#2d1b5e',
      emissive: '#160a30',
      emissiveIntensity: 0.2,
      flatShading: true,
      roughness: 0.85,
      metalness: 0.08,
    });
    const foliage = new THREE.MeshStandardMaterial({
      color: '#1a3d4a',
      emissive: '#0d2230',
      emissiveIntensity: 0.25,
      flatShading: true,
      roughness: 0.8,
    });
    const trunk = new THREE.MeshStandardMaterial({
      color: '#3b1c5e',
      emissive: '#1a0a30',
      emissiveIntensity: 0.1,
      flatShading: true,
      roughness: 0.95,
    });
    const accent = new THREE.MeshStandardMaterial({
      color: '#7a3df0',
      emissive: '#5a1dc0',
      emissiveIntensity: 0.6,
      flatShading: true,
      roughness: 0.3,
      metalness: 0.3,
    });
    const crystal = new THREE.MeshStandardMaterial({
      color: '#00d4ff',
      emissive: '#006080',
      emissiveIntensity: 0.9,
      flatShading: true,
      roughness: 0.15,
      metalness: 0.4,
      transparent: true,
      opacity: 0.85,
    });
    return { rock, terrain, foliage, trunk, accent, crystal };
  }, []);

  /* ---- geometry (memoised, disposed on unmount) ---- */
  const geoms = useMemo(() => {
    // Rocky underside: squashed icosahedron
    const base = new THREE.IcosahedronGeometry(1.0, 1);
    // Flatten underside and push verts downward
    const bp = base.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < bp.count; i++) {
      const y = bp.getY(i);
      if (y < 0) bp.setY(i, y * 0.55 - 0.1);
      else bp.setY(i, y * 0.35);
    }
    base.computeVertexNormals();

    // Top terrain cap: flat cylinder (the island surface)
    const cap = new THREE.CylinderGeometry(1.05, 0.9, 0.22, 7, 1, false);

    // Tree trunk
    const trkGeom = new THREE.CylinderGeometry(0.045, 0.06, 0.38, 5, 1, false);

    // Tree foliage cone (3 stacked tiers)
    const cone1 = new THREE.ConeGeometry(0.28, 0.42, 5);
    const cone2 = new THREE.ConeGeometry(0.22, 0.34, 5);
    const cone3 = new THREE.ConeGeometry(0.15, 0.26, 5);

    // Tiny structure: box + flat roof
    const bldBase = new THREE.BoxGeometry(0.28, 0.32, 0.22);
    const bldRoof = new THREE.CylinderGeometry(0, 0.21, 0.22, 4);

    // Crystal shard
    const shard = new THREE.OctahedronGeometry(0.12, 0);
    shard.scale(0.5, 1.4, 0.5);

    return { base, cap, trkGeom, cone1, cone2, cone3, bldBase, bldRoof, shard };
  }, []);

  useEffect(() => {
    const { mats: m } = { mats };
    return () => {
      Object.values(m).forEach((mat) => mat.dispose());
      Object.values(geoms).forEach((g) => g.dispose());
    };
  }, [geoms, mats]);

  useFrame((state, delta) => {
    if (reduced) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const intro = Math.max(sceneRuntime.cameraIntro, 0.35);

    // Gentle float animation
    const floatY = Math.sin(t * cfg.floatSpeed + cfg.phase) * cfg.floatAmp;
    // Slow rotation around Y
    const rotY = t * cfg.rotSpeed;
    // Mouse parallax (shallower than the mid-layer asteroids)
    const px = smooth.current.x * cfg.parallax * intro;
    const py = smooth.current.y * cfg.parallax * 0.5 * intro;

    root.current.position.set(cfg.base[0] + px, cfg.base[1] + floatY + py, cfg.base[2]);
    root.current.rotation.y = rotY + smooth.current.x * 0.06;
    root.current.rotation.x = -smooth.current.y * 0.03;

    void dt; // suppress unused warning
  });

  /* ---- static placement for reduced-motion ---- */
  useLayoutEffect(() => {
    root.current.position.set(...cfg.base);
  }, [cfg]);

  return (
    <group ref={root} scale={cfg.scale}>
      {/* Rocky underside */}
      <mesh geometry={geoms.base} material={mats.rock} position={[0, -0.1, 0]} />

      {/* Terrain top cap */}
      <mesh geometry={geoms.cap} material={mats.terrain} position={[0, 0.11, 0]} />

      {/* Tree cluster — left side */}
      <group position={[-0.52, 0.22, 0.1]}>
        <mesh geometry={geoms.trkGeom} material={mats.trunk} position={[0, 0.19, 0]} />
        <mesh geometry={geoms.cone3} material={mats.foliage} position={[0, 0.63, 0]} />
        <mesh geometry={geoms.cone2} material={mats.foliage} position={[0, 0.52, 0]} />
        <mesh geometry={geoms.cone1} material={mats.foliage} position={[0, 0.38, 0]} />
      </group>

      {/* Tree — right back */}
      <group position={[0.44, 0.22, -0.3]} scale={0.72}>
        <mesh geometry={geoms.trkGeom} material={mats.trunk} position={[0, 0.19, 0]} />
        <mesh geometry={geoms.cone3} material={mats.foliage} position={[0, 0.63, 0]} />
        <mesh geometry={geoms.cone2} material={mats.foliage} position={[0, 0.52, 0]} />
        <mesh geometry={geoms.cone1} material={mats.foliage} position={[0, 0.38, 0]} />
      </group>

      {/* Small structure */}
      <group position={[0.28, 0.22, 0.32]}>
        <mesh geometry={geoms.bldBase} material={mats.accent} position={[0, 0.16, 0]} />
        <mesh geometry={geoms.bldRoof} material={mats.rock} position={[0, 0.38, 0]} />
      </group>

      {/* Crystal shard accent */}
      <mesh geometry={geoms.shard} material={mats.crystal} position={[-0.2, 0.28, 0.45]} />
    </group>
  );
};

const ISLAND_CONFIGS: IslandConfig[] = [
  // Large island — right side, mid-background depth
  {
    base: [4.2, -1.0, -6.5],
    scale: 1.45,
    parallax: 0.55,
    floatSpeed: 0.38,
    floatAmp: 0.18,
    rotSpeed: 0.022,
    phase: 0,
  },
  // Smaller island — left side, slightly further back
  {
    base: [-4.0, 1.1, -7.8],
    scale: 0.82,
    parallax: 0.4,
    floatSpeed: 0.45,
    floatAmp: 0.14,
    rotSpeed: 0.016,
    phase: Math.PI * 0.65,
  },
];

/* ----------------------------- world ------------------------------------- */

const World = ({ mode, quality, reduced }: Omit<Props, 'paused'>) => {
  const smooth = useRef({ x: 0, y: 0 });
  const invalidate = useThree((s) => s.invalidate);
  const shadows = quality === 'high' && !reduced;
  const specs = useMemo(() => buildSpecs(quality, mode), [quality, mode]);
  const rockGeoms = useMemo(() => [makeRock(11), makeRock(23), makeRock(37)], []);
  const crystalGeom = useMemo(() => {
    const g = new THREE.OctahedronGeometry(1, 0);
    g.scale(0.38, 1.2, 0.38);
    return g;
  }, []);
  const particleCount = quality === 'high' ? 260 : quality === 'medium' ? 140 : 60;

  /**
   * Shared bounding-sphere registry.
   * Each Floater writes its live position here every frame; all Floaters read it.
   */
  const registry: PositionsRegistry = useRef([]);

  useEffect(() => () => {
    rockGeoms.forEach((g) => g.dispose());
    crystalGeom.dispose();
  }, [rockGeoms, crystalGeom]);

  // Mark the scene ready after a few real frames (shaders compiled, first paint done).
  const frames = useRef(0);
  useFrame(() => {
    if (frames.current < 4) {
      frames.current++;
      if (frames.current === 4) setSceneReady();
    }
  });
  useEffect(() => {
    if (!reduced) return;
    invalidate();
    let a = 0;
    let b = 0;
    a = requestAnimationFrame(() => {
      b = requestAnimationFrame(() => setSceneReady());
    });
    return () => {
      cancelAnimationFrame(a);
      cancelAnimationFrame(b);
    };
  }, [reduced, invalidate]);

  return (
    <>
      <Rig smooth={smooth} reduced={reduced} />
      <fog attach="fog" args={['#0b0614', 16, 40]} />
      <hemisphereLight args={['#b79cff', '#1a1030', 1.25]} />
      <KeyLight shadows={shadows} />
      <directionalLight position={[9, 3, -5]} intensity={3} color="#7a3df0" />
      <pointLight position={[3, -2, 3]} intensity={30} color="#b8f55a" distance={14} />

      {mode === 'hero' && <Orb smooth={smooth} reduced={reduced} shadows={shadows} />}

      {/* Floating islands — hero mode only, skipped on low quality for performance */}
      {mode === 'hero' &&
        quality !== 'low' &&
        ISLAND_CONFIGS.map((cfg, i) => (
          <FloatingIsland key={i} cfg={cfg} smooth={smooth} reduced={reduced} />
        ))}

      {specs.map((s) => (
        <Floater
          key={s.id}
          spec={s}
          geometry={s.kind === 'rock' ? rockGeoms[s.variant % rockGeoms.length] : crystalGeom}
          smooth={smooth}
          reduced={reduced}
          shadows={shadows}
          registry={registry}
        />
      ))}

      <Particles count={particleCount} smooth={smooth} reduced={reduced} />

      {shadows && (
        <mesh receiveShadow position={[0, 0, -7]}>
          <planeGeometry args={[70, 40]} />
          <shadowMaterial opacity={0.4} color="#0a0018" />
        </mesh>
      )}
    </>
  );
};

/* ----------------------------- canvas ------------------------------------ */

export default function SceneCanvas({ mode, quality, reduced, paused }: Props) {
  // Pointer → shared runtime object. No React state, no re-renders.
  useEffect(() => {
    if (reduced) return;
    let recenter = 0;
    const onMove = (e: PointerEvent) => {
      sceneRuntime.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      sceneRuntime.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
      sceneRuntime.pointerActive = true;
      window.clearTimeout(recenter);
      if (e.pointerType !== 'mouse') {
        // touch: ease back to neutral shortly after the finger stops
        recenter = window.setTimeout(() => {
          sceneRuntime.pointer.x = 0;
          sceneRuntime.pointer.y = 0;
          sceneRuntime.pointerActive = false;
        }, 1100);
      }
    };
    const onLeave = () => {
      sceneRuntime.pointerActive = false;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      window.clearTimeout(recenter);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [reduced]);

  return (
    <Canvas
      frameloop={reduced ? 'demand' : paused ? 'never' : 'always'}
      shadows={quality === 'high' && !reduced ? 'soft' : false}
      dpr={quality === 'high' ? [1, 1.75] : [1, 1.25]}
      camera={{ fov: 45, near: 0.1, far: 60, position: [0, 0.5, CAM_TIGHT] }}
      gl={{ antialias: quality !== 'low', alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          setSceneFailed();
        });
      }}
    >
      <World mode={mode} quality={quality} reduced={reduced} />
    </Canvas>
  );
}
