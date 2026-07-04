"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Float, OrbitControls } from "@react-three/drei";
import { Camera } from "lucide-react";
import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import * as THREE from "three";

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () =>
      setMobile(window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

function fallbackPattern() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="#151827"/><circle cx="256" cy="256" r="160" fill="#d44a3d"/><circle cx="256" cy="256" r="92" fill="#c9984a"/><text x="256" y="276" text-anchor="middle" font-size="44" font-family="sans-serif" fill="#e8e4dd">非遗有灵</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export type ShowroomVariant = "vase" | "hoop" | "fabric";

function usePatternTexture(textureUrl?: string, repeat = 1.15) {
  const loadedTexture = useLoader(THREE.TextureLoader, textureUrl || fallbackPattern());
  const texture = useMemo(() => {
    const t = loadedTexture.clone();
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat, repeat);
    t.anisotropy = 8;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.generateMipmaps = true;
    t.needsUpdate = true;
    return t;
  }, [loadedTexture, repeat]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

/* Mobile-optimized 3D renderer — uses simplified geometry & lower resolution */
function MobileScene({ textureUrl, variant }: { textureUrl?: string; variant: ShowroomVariant }) {
  const texture = usePatternTexture(textureUrl, 1.0);

  return (
    <>
      <color attach="background" args={["#151827"]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 3]} intensity={2.5} color="#ffe8c0" />
      <directionalLight position={[-2, 2, -2]} intensity={1.2} color="#9fb8ff" />
      <pointLight position={[0, -1, 3]} intensity={8} color="#ffd9a0" />

      {variant === "vase" && <MobileVase texture={texture} />}
      {variant === "hoop" && <MobileHoop texture={texture} />}
      {variant === "fabric" && <MobileFabric texture={texture} />}

      <ContactShadows position={[0, -1.55, 0]} opacity={0.5} scale={5} blur={3} far={4} />
      <OrbitControls
        enablePan={false}
        minDistance={2.8}
        maxDistance={6}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI * 0.72}
        enableDamping
        dampingFactor={0.1}
      />
      <Environment preset="apartment" />
    </>
  );
}

/* Simplified vase for mobile - fewer segments */
function MobileVase({ texture }: { texture: THREE.Texture }) {
  const vaseGeo = useMemo(() => {
    const control = [
      [0.40, -1.35], [0.52, -1.28], [0.66, -1.05], [0.80, -0.72],
      [0.95, -0.32], [1.05, 0.10], [1.06, 0.45], [0.98, 0.78],
      [0.82, 1.02], [0.66, 1.16], [0.58, 1.26], [0.64, 1.36],
    ];
    const curve = new THREE.CatmullRomCurve3(
      control.map(([r, y]) => new THREE.Vector3(r, y, 0)),
    );
    const pts = curve.getPoints(48).map((p) => new THREE.Vector2(Math.max(0.02, p.x), p.y));
    return new THREE.LatheGeometry(pts, 64);
  }, []);

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
      <group rotation={[0, -0.35, 0]}>
        <mesh castShadow geometry={vaseGeo}>
          <meshPhysicalMaterial
            map={texture}
            roughness={0.2}
            metalness={0.15}
            clearcoat={0.8}
            clearcoatRoughness={0.1}
            reflectivity={0.7}
            envMapIntensity={1.2}
          />
        </mesh>
        {[
          { y: 1.3, r: 0.6, tube: 0.03 },
          { y: 0.78, r: 0.85, tube: 0.02 },
          { y: 0.1, r: 1.06, tube: 0.022 },
          { y: -0.72, r: 0.83, tube: 0.02 },
          { y: -1.28, r: 0.46, tube: 0.028 },
        ].map((b, i) => (
          <mesh key={i} position={[0, b.y, 0]} castShadow>
            <torusGeometry args={[b.r, b.tube, 16, 64]} />
            <meshPhysicalMaterial color="#d4a84b" metalness={1} roughness={0.12} />
          </mesh>
        ))}
        <mesh position={[0, -1.46, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.58, 0.16, 48]} />
          <meshPhysicalMaterial color="#8b6914" metalness={0.9} roughness={0.25} />
        </mesh>
      </group>
    </Float>
  );
}

/* Simplified hoop for mobile */
function MobileHoop({ texture }: { texture: THREE.Texture }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} rotation={[0.08, -0.4, 0]}>
        <mesh castShadow>
          <torusGeometry args={[1.14, 0.07, 24, 96]} />
          <meshPhysicalMaterial color="#c69a54" roughness={0.45} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0, -0.01]} castShadow>
          <sphereGeometry args={[1.04, 48, 48, 0, Math.PI * 2, 0, 0.28]} />
          <meshStandardMaterial map={texture} side={THREE.DoubleSide} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0, -0.02]}>
          <circleGeometry args={[1.03, 48]} />
          <meshStandardMaterial map={texture} roughness={0.85} />
        </mesh>
        <mesh position={[0, -1.16, -0.01]} castShadow>
          <cylinderGeometry args={[0.03, 0.04, 1.85, 16]} />
          <meshStandardMaterial color="#7a5c2e" roughness={0.5} />
        </mesh>
        <mesh position={[0, -2.08, -0.01]} castShadow>
          <cylinderGeometry args={[0.4, 0.46, 0.12, 32]} />
          <meshStandardMaterial color="#6e4d22" roughness={0.45} />
        </mesh>
      </group>
    </Float>
  );
}

/* Simplified fabric for mobile */
function MobileFabric({ texture }: { texture: THREE.Texture }) {
  return (
    <group rotation={[0.02, -0.2, 0]}>
      <mesh position={[0, 0, 0]} castShadow>
        <planeGeometry args={[2.4, 2.9, 20, 20]} />
        <meshStandardMaterial map={texture} side={THREE.DoubleSide} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 2.8, 16]} />
        <meshStandardMaterial color="#5e3d1a" roughness={0.5} />
      </mesh>
    </group>
  );
}

/* Jingtai Cloisonné Vase */
function VaseModel({ textureUrl }: { textureUrl?: string }) {
  const texture = usePatternTexture(textureUrl, 1.0);
  const groupRef = useRef<THREE.Group>(null);

  const vaseGeo = useMemo(() => {
    const control = [
      [0.40, -1.35], [0.52, -1.28], [0.66, -1.05], [0.80, -0.72],
      [0.95, -0.32], [1.05, 0.10], [1.06, 0.45], [0.98, 0.78],
      [0.82, 1.02], [0.66, 1.16], [0.58, 1.26], [0.64, 1.36],
    ];
    const curve = new THREE.CatmullRomCurve3(
      control.map(([r, y]) => new THREE.Vector3(r, y, 0)),
    );
    const pts = curve.getPoints(64).map((p) => new THREE.Vector2(Math.max(0.02, p.x), p.y));
    return new THREE.LatheGeometry(pts, 128);
  }, []);

  const goldBands = [
    { y: 1.3, r: 0.6, tube: 0.03 },
    { y: 0.78, r: 0.85, tube: 0.02 },
    { y: 0.1, r: 1.06, tube: 0.022 },
    { y: -0.72, r: 0.83, tube: 0.02 },
    { y: -1.28, r: 0.46, tube: 0.028 },
  ];

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
      <group ref={groupRef} rotation={[0, -0.35, 0]}>
        <mesh castShadow receiveShadow geometry={vaseGeo}>
          <meshPhysicalMaterial
            map={texture}
            roughness={0.18}
            metalness={0.15}
            clearcoat={1}
            clearcoatRoughness={0.08}
            reflectivity={0.75}
            envMapIntensity={1.4}
            sheen={0.5}
            sheenColor={new THREE.Color("#e8c66a")}
          />
        </mesh>
        {goldBands.map((b, i) => (
          <mesh key={i} position={[0, b.y, 0]} castShadow>
            <torusGeometry args={[b.r, b.tube, 24, 128]} />
            <meshPhysicalMaterial
              color="#d4a84b"
              metalness={1}
              roughness={0.12}
              clearcoat={0.6}
              envMapIntensity={2}
            />
          </mesh>
        ))}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (Math.PI * 2 * i) / 12;
          return (
            <mesh
              key={`w${i}`}
              position={[Math.cos(a) * 1.02, 0.1, Math.sin(a) * 1.02]}
              rotation={[0, -a, 0]}
              castShadow
            >
              <boxGeometry args={[0.012, 0.9, 0.012]} />
              <meshPhysicalMaterial
                color="#c9982e"
                metalness={1}
                roughness={0.2}
                envMapIntensity={1.6}
              />
            </mesh>
          );
        })}
        <mesh position={[0, -1.46, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.58, 0.16, 96]} />
          <meshPhysicalMaterial
            color="#8b6914"
            metalness={0.9}
            roughness={0.25}
            clearcoat={0.4}
            envMapIntensity={1.5}
          />
        </mesh>
      </group>
    </Float>
  );
}

/* Miao Embroidery Hoop */
function HoopModel({ textureUrl }: { textureUrl?: string }) {
  const texture = usePatternTexture(textureUrl, 1.0);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} rotation={[0.08, -0.4, 0]}>
        <mesh castShadow receiveShadow>
          <torusGeometry args={[1.14, 0.07, 40, 160]} />
          <meshPhysicalMaterial
            color="#c69a54"
            roughness={0.45}
            metalness={0.05}
            clearcoat={0.5}
            clearcoatRoughness={0.3}
            envMapIntensity={1}
          />
        </mesh>
        <mesh castShadow>
          <torusGeometry args={[1.05, 0.045, 32, 160]} />
          <meshPhysicalMaterial color="#a97f3c" roughness={0.5} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0, -0.01]} castShadow receiveShadow>
          <sphereGeometry args={[1.04, 96, 96, 0, Math.PI * 2, 0, 0.28]} />
          <meshStandardMaterial
            map={texture}
            side={THREE.DoubleSide}
            roughness={0.85}
            metalness={0}
          />
        </mesh>
        <mesh position={[0, 0, -0.02]}>
          <circleGeometry args={[1.03, 96]} />
          <meshStandardMaterial map={texture} roughness={0.85} />
        </mesh>
        <mesh position={[0, 1.14, 0.02]} castShadow>
          <cylinderGeometry args={[0.05, 0.04, 0.14, 24]} />
          <meshPhysicalMaterial
            color="#b8894a"
            metalness={0.8}
            roughness={0.3}
            envMapIntensity={1.4}
          />
        </mesh>
        <mesh position={[0, -1.16, -0.01]} castShadow>
          <cylinderGeometry args={[0.03, 0.04, 1.85, 24]} />
          <meshStandardMaterial color="#7a5c2e" roughness={0.5} />
        </mesh>
        <mesh position={[0, -2.08, -0.01]} castShadow>
          <cylinderGeometry args={[0.4, 0.46, 0.12, 48]} />
          <meshStandardMaterial color="#6e4d22" roughness={0.45} />
        </mesh>
        {[-0.7, -0.35, 0, 0.35, 0.7].map((x, i) => (
          <mesh key={i} position={[x, -1.2, 0.03]} castShadow>
            <cylinderGeometry args={[0.01, 0.004, 0.24 + i * 0.02, 8]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#b9362d" : "#c8912d"}
              roughness={0.6}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

/* Tie-dye / Blueprint hanging fabric */
function FabricModel({ textureUrl }: { textureUrl?: string }) {
  const texture = usePatternTexture(textureUrl, 1.0);
  const meshRef = useRef<THREE.Mesh>(null);
  const frameRef = useRef(0);

  useFrame((state) => {
    if (!meshRef.current) return;
    frameRef.current += 1;
    if (frameRef.current % 2 !== 0) return;
    const geo = meshRef.current.geometry as THREE.PlaneGeometry;
    const pos = geo.attributes.position;
    const time = state.clock.elapsedTime * 0.6;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const wave =
        Math.sin(x * 2 + time) * 0.035 +
        Math.sin(y * 1.5 + time * 0.7) * 0.028;
      pos.setZ(i, wave);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  });

  return (
    <group rotation={[0.02, -0.2, 0]}>
      <mesh ref={meshRef} position={[0, 0, 0]} castShadow receiveShadow>
        <planeGeometry args={[2.4, 2.9, 40, 40]} />
        <meshStandardMaterial
          map={texture}
          side={THREE.DoubleSide}
          roughness={0.9}
          metalness={0}
        />
      </mesh>
      <mesh position={[0, 1.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 2.8, 24]} />
        <meshStandardMaterial color="#5e3d1a" roughness={0.5} />
      </mesh>
      {[-1.42, 1.42].map((x) => (
        <mesh key={x} position={[x, 1.5, 0]} castShadow>
          <sphereGeometry args={[0.07, 24, 24]} />
          <meshPhysicalMaterial
            color="#3d2810"
            roughness={0.35}
            metalness={0.2}
            envMapIntensity={1}
          />
        </mesh>
      ))}
    </group>
  );
}

function TexturedObject({
  textureUrl,
  variant,
}: {
  textureUrl?: string;
  variant: ShowroomVariant;
}) {
  if (variant === "hoop") return <HoopModel textureUrl={textureUrl} />;
  if (variant === "fabric") return <FabricModel textureUrl={textureUrl} />;
  return <VaseModel textureUrl={textureUrl} />;
}

export function ShowroomScene({
  textureUrl,
  variant = "vase",
  showDownload = true,
  className = "h-[420px]",
}: {
  textureUrl?: string;
  variant?: ShowroomVariant;
  showDownload?: boolean;
  className?: string;
}) {
  const isMobile = useIsMobile();
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const supported = !!(
        c.getContext("webgl2") || c.getContext("webgl")
      );
      setWebglSupported(supported);
    } catch {
      setWebglSupported(false);
    }
  }, []);

  function downloadShot() {
    const canvas = document.querySelector<HTMLCanvasElement>(
      "#feiyi-showroom-canvas canvas",
    );
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL("image/png");
      if (!dataUrl || dataUrl === "data:,") {
        alert("3D场景截图失败，请重试");
        return;
      }
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `feiyi-3d-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      alert("3D截图失败，请重试");
    }
  }

  /* Mobile + WebGL supported: use lightweight 3D scene */
  if (isMobile && webglSupported) {
    return (
      <div
        className={`relative overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--bg-surface)] ${className}`}
        id="feiyi-showroom-canvas"
      >
        {showDownload ? (
          <button
            onClick={downloadShot}
            className="quiet-button absolute right-3 top-3 z-10 flex items-center gap-2 bg-[var(--bg-surface)]/86 px-3 py-2 text-sm"
            aria-label="下载3D截图"
          >
            <Camera size={15} />
            <span className="hidden sm:inline">3D截图</span>
          </button>
        ) : null}
        <Canvas
          camera={{ position: [0, 0.6, 4.4], fov: 38 }}
          shadows
          dpr={[1, 1]}
          gl={{
            preserveDrawingBuffer: true,
            antialias: false,
            powerPreference: "low-power",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
          }}
          performance={{ min: 0.5 }}
        >
          <Suspense fallback={null}>
            <MobileScene textureUrl={textureUrl} variant={variant} />
          </Suspense>
        </Canvas>
      </div>
    );
  }

  /* Mobile without WebGL: show pattern image fallback */
  if (isMobile && !webglSupported) {
    return (
      <div
        className={`relative grid place-items-center overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--bg-surface)] ${className}`}
      >
        {textureUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={textureUrl}
            alt="纹样预览"
            className="h-full w-full object-cover opacity-90"
          />
        ) : (
          <div className="text-center text-[var(--foreground-dim)]">
            <p className="text-lg font-black">3D 展厅</p>
            <p className="mt-1 text-xs">纹样生成后可查看贴图效果</p>
          </div>
        )}
      </div>
    );
  }

  /* Desktop: full-quality 3D */
  return (
    <div
      className={`relative overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--bg-surface)] ${className}`}
      id="feiyi-showroom-canvas"
    >
      {showDownload ? (
        <button
          onClick={downloadShot}
          className="quiet-button absolute right-3 top-3 z-10 flex items-center gap-2 bg-[var(--bg-surface)]/86 px-3 py-2 text-sm sm:right-4 sm:top-4"
          aria-label="下载3D截图"
        >
          <Camera size={15} />
          <span className="hidden sm:inline">3D截图</span>
        </button>
      ) : null}
      <Canvas
        camera={{ position: [0, 0.6, 4.4], fov: 38 }}
        shadows
        dpr={[1, 1.5]}
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={["#151827"]} />
          <ambientLight intensity={0.5} />
          <spotLight
            position={[5, 6, 4]}
            angle={0.5}
            penumbra={0.8}
            intensity={110}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight
            position={[-4, 3, -2]}
            intensity={1.4}
            color="#9fb8ff"
          />
          <pointLight position={[0, -1, 3]} intensity={12} color="#ffd9a0" />
          <TexturedObject textureUrl={textureUrl} variant={variant} />
          <ContactShadows
            position={[0, -1.55, 0]}
            opacity={0.5}
            scale={6}
            blur={3}
            far={4.5}
          />
          <OrbitControls
            enablePan={false}
            minDistance={2.6}
            maxDistance={7}
            autoRotate
            autoRotateSpeed={0.7}
            maxPolarAngle={Math.PI * 0.72}
          />
          <Environment preset="apartment" />
        </Suspense>
      </Canvas>
    </div>
  );
}