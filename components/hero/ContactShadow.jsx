"use client";

import * as THREE from "three";
import { useRef } from "react";
import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

// A soft radial dark patch under the hull, sitting just above the ocean
// plane. It's a cheap stand-in for a real planar reflection: without it the
// ship's waterline has no anchor to the surface below and reads as pasted
// on rather than sitting in the water.
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 centered = (vUv - 0.5) * vec2(1.0, 2.2);
    float dist = length(centered);
    float shadow = 1.0 - smoothstep(0.15, 0.5, dist);
    float ripple = sin(dist * 18.0 - uTime * 1.4) * 0.04;
    gl_FragColor = vec4(0.0, 0.0, 0.0, clamp(shadow + ripple * shadow, 0.0, 0.6));
  }
`;

const ContactShadowMaterial = shaderMaterial({ uTime: 0 }, vertexShader, fragmentShader);

extend({ ContactShadowMaterial });

export default function ContactShadow({ length = 17, width = 5 }) {
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) materialRef.current.uTime = state.clock.elapsedTime;
  });

  return (
    <mesh position={[0, -0.43, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[length, width, 1, 1]} />
      <contactShadowMaterial ref={materialRef} transparent depthWrite={false} />
    </mesh>
  );
}
