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

  void main() {
    float along = vUv.x;
    float across = vUv.y * 2.0 - 1.0;

    float widthFalloff = smoothstep(0.0, 0.12, along) * (1.0 - smoothstep(0.55, 1.0, along));
    float taper = mix(0.06, 1.0, along);
    float edge = 1.0 - smoothstep(0.0, taper, abs(across));

    float noise = hash(vec2(floor(vUv.x * 40.0), floor(uTime * 4.0)));
    float shimmer = 0.75 + noise * 0.25;

    float alpha = widthFalloff * edge * shimmer * 0.35;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

const WakeMaterial = shaderMaterial(
  { uTime: 0, uColor: new THREE.Color("#efe3c8") },
  vertexShader,
  fragmentShader
);

extend({ WakeMaterial });

export default function Wake({ anchorX = -8, length = 9, width = 1.6 }) {
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) materialRef.current.uTime = state.clock.elapsedTime;
  });

  return (
    <mesh
      position={[anchorX - length / 2 + 0.5, -0.42, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[length, width, 1, 1]} />
      <wakeMaterial ref={materialRef} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}
