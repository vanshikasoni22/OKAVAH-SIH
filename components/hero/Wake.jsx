"use client";

import * as THREE from "three";
import { useRef } from "react";
import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453);
  }

  // A V-shaped bow wake instead of a flat rectangle: two foam edges that
  // spread apart moving away from the hull, with a turbulent churn right
  // behind the stern and a calmer, wider trail further back.
  void main() {
    float along = vUv.x;
    float across = vUv.y * 2.0 - 1.0;

    float spread = mix(0.12, 1.0, along);
    float edgeDist = abs(abs(across) - spread * 0.62);
    float edgeLine = 1.0 - smoothstep(0.0, 0.16, edgeDist);

    float churn = 1.0 - smoothstep(0.0, 0.22, along);
    float churnFill = churn * (1.0 - smoothstep(0.0, spread * 0.62, abs(across)));

    float widthFalloff = smoothstep(0.0, 0.06, along) * (1.0 - smoothstep(0.6, 1.0, along));

    float noise = hash(vec2(floor(vUv.x * 50.0), floor(uTime * 5.0)));
    float noise2 = hash(vec2(floor(vUv.x * 22.0 + 7.0), floor(uTime * 2.6)));
    float shimmer = 0.7 + noise * 0.3;

    float shape = max(edgeLine * 0.9, churnFill * 0.6) + noise2 * 0.08 * widthFalloff;
    float alpha = widthFalloff * shape * shimmer * 0.65;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

const WakeMaterial = shaderMaterial(
  { uTime: 0, uColor: new THREE.Color("#f3ead2") },
  vertexShader,
  fragmentShader
);

extend({ WakeMaterial });

export default function Wake({ anchorX = -8, length = 13, width = 3.2 }) {
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) materialRef.current.uTime = state.clock.elapsedTime;
  });

  return (
    <mesh
      position={[anchorX - length / 2 + 0.5, -0.44, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[length, width, 1, 1]} />
      <wakeMaterial ref={materialRef} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}
