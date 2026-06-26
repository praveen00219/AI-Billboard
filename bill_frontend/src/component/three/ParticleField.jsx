import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { AdditiveBlending } from "three";
import { useReducedMotion } from "framer-motion";

/* One animated point cloud distributed inside a sphere. */
function Cloud({ count, color, size, speed }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 5 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = r * Math.cos(phi);
    }
    return p;
  }, [count]);

  useFrame((state, delta) => {
    const g = ref.current;
    if (!g) return;
    const d = Math.min(delta, 0.05); // clamp on tab refocus
    g.rotation.y += d * speed;
    g.rotation.x += d * speed * 0.35;
    // gentle pointer parallax
    g.rotation.y += state.pointer.x * 0.0008;
    g.rotation.x += state.pointer.y * 0.0008;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation
        depthWrite={false}
        opacity={0.9}
        blending={AdditiveBlending}
      />
    </Points>
  );
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

/**
 * ParticleField — lightweight 3D nebula background.
 * - Lazy-loaded by callers so three.js stays out of the main bundle.
 * - Honors prefers-reduced-motion (renders a single static frame).
 * - Falls back gracefully if WebGL is unavailable.
 */
export default function ParticleField({ className = "" }) {
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState(true);
  useEffect(() => setWebgl(hasWebGL()), []);

  if (!webgl) return null;

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 7], fov: 62 }}
        frameloop={reduced ? "demand" : "always"}
      >
        <Cloud count={1100} color="#6457f3" size={0.032} speed={0.04} />
        <Cloud count={520} color="#22d3ee" size={0.026} speed={0.05} />
      </Canvas>
    </div>
  );
}
