"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { HeroPills } from "@/components/marketing/hero-pills";

function GradientTorus() {
  const ref = useRef<THREE.Mesh>(null);
  const geom = useMemo(() => {
    const g = new THREE.TorusGeometry(1.05, 0.16, 48, 128);
    const colors: number[] = [];
    const pos = g.attributes.position;
    const amber = new THREE.Color("#E8B86D");
    const teal = new THREE.Color("#3D9B8F");
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const t = (x + 1.5) / 3;
      c.copy(amber).lerp(teal, Math.min(1, Math.max(0, t)));
      colors.push(c.r, c.g, c.b);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return g;
  }, []);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.1);
    const t = performance.now() / 1000;
    if (ref.current) {
      const s = 1 + Math.sin(t * 0.7) * 0.02;
      ref.current.scale.setScalar(s);
      ref.current.rotation.z += d * 0.06;
    }
  });

  return (
    <mesh ref={ref} geometry={geom} rotation={[Math.PI / 2.2, 0.12, 0]} position={[0, 0.22, 0]}>
      <meshPhysicalMaterial
        vertexColors
        transmission={0.62}
        thickness={0.4}
        roughness={0.16}
        metalness={0.05}
        ior={1.45}
        transparent
        opacity={0.96}
        attenuationColor="#f4f1ea"
        attenuationDistance={2.4}
      />
    </mesh>
  );
}

function ClayToken({
  position,
  color,
  child,
}: {
  position: [number, number, number];
  color: string;
  child: "eth" | "usd";
}) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.34, 48]} />
        <meshStandardMaterial color={color} roughness={0.82} metalness={0.04} />
      </mesh>
      {child === "eth" ? (
        <mesh position={[0, 0.26, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <octahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial color="#c4b49a" roughness={0.55} />
        </mesh>
      ) : (
        <>
          <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.18, 0.03, 12, 40]} />
            <meshStandardMaterial color="#2c7369" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.1, 0.026, 12, 32]} />
            <meshStandardMaterial color="#2c7369" roughness={0.5} />
          </mesh>
        </>
      )}
    </group>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#F4F1EA"]} />
      <hemisphereLight args={["#fff6e8", "#c4b8a4", 0.9]} />
      <directionalLight position={[3, 5, 2]} intensity={1.35} castShadow color="#fff3d8" />
      <directionalLight position={[-3, 2, -2]} intensity={0.32} color="#3d9b8f" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.42, 0]} receiveShadow>
        <circleGeometry args={[3.2, 64]} />
        <meshStandardMaterial color="#e4d9c6" roughness={1} />
      </mesh>
      <ClayToken position={[-0.42, -0.2, 0.08]} color="#cbb79a" child="eth" />
      <ClayToken position={[0.42, -0.2, -0.04]} color="#7aa8a0" child="usd" />
      <GradientTorus />
    </>
  );
}

export function BandField({ className }: { className?: string }) {
  const [mode, setMode] = useState<"still" | "3d">("still");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 767px)").matches;
    setMode(reduce || narrow ? "still" : "3d");
    const onNarrow = (e: MediaQueryListEvent) => {
      const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setMode(r || e.matches ? "still" : "3d");
    };
    const mq = window.matchMedia("(max-width: 767px)");
    mq.addEventListener("change", onNarrow);
    return () => mq.removeEventListener("change", onNarrow);
  }, []);

  if (mode === "still") {
    // Mobile / reduced-motion: CSS hero — never a broken photo.
    return <HeroPills className={className} />;
  }

  return (
    <div className={className} style={{ borderRadius: 24, overflow: "hidden", height: "100%", width: "100%" }}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 1.55, 4.6], fov: 34 }}
        gl={{ antialias: true, alpha: false }}
        shadows
      >
        <Scene />
      </Canvas>
    </div>
  );
}
