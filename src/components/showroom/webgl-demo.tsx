"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function makeDemoTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#15304a";
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = "#f0d06a";
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI * 2 * i) / 12;
    ctx.beginPath();
    ctx.ellipse(128 + Math.cos(a) * 62, 128 + Math.sin(a) * 62, 24, 9, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#b9362d";
  ctx.beginPath();
  ctx.arc(128, 128, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#fff5d8";
  ctx.lineWidth = 5;
  ctx.stroke();
  return new THREE.CanvasTexture(canvas);
}

function DemoVase() {
  const ref = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => makeDemoTexture(), []);
  const geometry = useMemo(() => {
    const points = [
      [0.36, -1.25],
      [0.64, -0.95],
      [0.86, -0.25],
      [0.78, 0.52],
      [0.48, 1.02],
      [0.42, 1.24],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(points, 48);
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.32;
  });

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshStandardMaterial map={texture || undefined} roughness={0.42} metalness={0.08} />
    </mesh>
  );
}

export function WebglDemo() {
  return (
    <div className="relative h-[520px] overflow-hidden rounded-[28px] border border-[var(--line)] bg-[#101625]">
      <Canvas
        frameloop="always"
        dpr={[1, 1]}
        camera={{ position: [0, 0.2, 4.2], fov: 42 }}
        gl={{ antialias: false, powerPreference: "low-power" }}
      >
        <color attach="background" args={["#101625"]} />
        <ambientLight intensity={1.1} />
        <directionalLight position={[3, 4, 4]} intensity={2.2} />
        <DemoVase />
        <OrbitControls enablePan={false} minDistance={3} maxDistance={6} />
      </Canvas>
      <div className="pointer-events-none absolute left-5 top-5 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white/80 backdrop-blur">
        低配 WebGL 独立演示
      </div>
    </div>
  );
}
