"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Ocean from "./Ocean";
import Ship from "./Ship";
import CameraRig from "./CameraRig";

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.35,
      }}
      camera={{ position: [3, 6.8, 17], fov: 44, near: 0.1, far: 400 }}
    >
      <color attach="background" args={["#0a0714"]} />
      <fogExp2 attach="fog" args={["#0a0714", 0.022]} />

      <ambientLight intensity={0.7} color="#6a5b96" />
      <hemisphereLight args={["#6a5b96", "#0d0818", 0.7]} />
      <directionalLight position={[16, 14, 7]} intensity={4.2} color="#e3ac4d" />
      <directionalLight position={[-12, 6, -14]} intensity={0.9} color="#7d6ac2" />
      <pointLight position={[0, 4, 10]} intensity={0.6} color="#d9a441" distance={40} />

      <Suspense fallback={null}>
        <Ship />
      </Suspense>
      <Ocean />
      <CameraRig />
    </Canvas>
  );
}
