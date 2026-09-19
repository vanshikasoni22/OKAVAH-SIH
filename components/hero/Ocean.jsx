"use client";

import * as THREE from "three";
import { useRef } from "react";
import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

const vertexShader = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vElevation;

  float waveHeight(vec2 pos, float t) {
    float e = 0.0;
    e += sin(dot(pos, vec2(0.98, 0.30)) * 0.055 + t * 1.05) * 0.55;
    e += sin(dot(pos, vec2(-0.51, 0.86)) * 0.11 + t * 0.7) * 0.32;
    e += sin(dot(pos, vec2(0.19, -0.98)) * 0.22 + t * 1.6) * 0.16;
    e += sin(dot(pos, vec2(0.71, 0.71)) * 0.42 + t * 2.3) * 0.06;
    return e;
  }

  void main() {
    vec3 pos = position;
    vec2 p = pos.xz;
    float e = waveHeight(p, uTime);
    pos.y += e;
    vElevation = e;

    float d = 0.6;
    float ex = waveHeight(p + vec2(d, 0.0), uTime);
    float ez = waveHeight(p + vec2(0.0, d), uTime);

    vec3 tangentX = normalize(vec3(d, ex - e, 0.0));
    vec3 tangentZ = normalize(vec3(0.0, ez - e, d));
    vNormal = normalize(cross(tangentZ, tangentX));

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPos = worldPos.xyz;

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = `
  uniform vec3 uDeepColor;
  uniform vec3 uShallowColor;
  uniform vec3 uFoamColor;
  uniform vec3 uSunDirection;
  uniform float uOpacity;

  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vElevation;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPos);

    float fresnel = pow(1.0 - clamp(dot(normal, viewDir), 0.0, 1.0), 3.0);
    vec3 baseColor = mix(uDeepColor, uShallowColor, fresnel * 0.85);

    vec3 halfVec = normalize(uSunDirection + viewDir);
    float spec = pow(max(dot(normal, halfVec), 0.0), 70.0);
    vec3 specColor = uFoamColor * spec * 1.8;

    float crestGlow = smoothstep(0.32, 0.66, vElevation) * 0.12;
    vec3 color = baseColor + specColor + uFoamColor * crestGlow;

    gl_FragColor = vec4(color, uOpacity);
  }
`;

const OceanMaterial = shaderMaterial(
  {
    uTime: 0,
    uDeepColor: new THREE.Color("#0d0a1f"),
    uShallowColor: new THREE.Color("#362852"),
    uFoamColor: new THREE.Color("#d9a441"),
    uSunDirection: new THREE.Vector3(0.5, 0.6, 0.3).normalize(),
    uOpacity: 1,
  },
  vertexShader,
  fragmentShader
);

extend({ OceanMaterial });

export default function Ocean() {
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, 0]}>
      <planeGeometry args={[360, 360, 140, 140]} />
      <oceanMaterial ref={materialRef} transparent />
    </mesh>
  );
}
