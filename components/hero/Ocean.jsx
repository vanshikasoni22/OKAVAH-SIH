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
  uniform vec3 uSkyColor;
  uniform vec3 uFoamColor;
  uniform vec3 uSunDirection;
  uniform float uOpacity;
  uniform float uCameraDist;

  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vElevation;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPos);

    // Base water tone: distinctly lighter than the void behind it so the
    // plane reads as a surface even where nothing else lights it up.
    float fresnel = pow(1.0 - clamp(dot(normal, viewDir), 0.0, 1.0), 2.2);
    vec3 baseColor = mix(uDeepColor, uShallowColor, fresnel);

    // Broad, soft sky-light sheen at grazing angles — a cheap stand-in for a
    // true planar reflection: the water picks up the same amber-lit purple
    // sky tone the ship itself is lit by, instead of staying a flat fill.
    vec3 skySheen = uSkyColor * fresnel * 0.55;

    // Two specular lobes: a tight hot glint plus a much wider, softer sheen,
    // so sunlight reads as a glittering patch across the water rather than
    // one pinpoint that's only visible from a single angle.
    vec3 halfVec = normalize(uSunDirection + viewDir);
    float specSharp = pow(max(dot(normal, halfVec), 0.0), 48.0);
    float specWide = pow(max(dot(normal, halfVec), 0.0), 6.0);
    vec3 specColor = uFoamColor * (specSharp * 2.2 + specWide * 0.22);

    float crestGlow = smoothstep(0.22, 0.6, vElevation) * 0.22;
    vec3 color = baseColor + skySheen + specColor + uFoamColor * crestGlow;

    // Fade smoothly into the fog/background toward the horizon instead of a
    // hard edge, while keeping nearby water solidly opaque and visible.
    float distFade = smoothstep(90.0, 20.0, uCameraDist);
    float alpha = uOpacity * mix(0.55, 1.0, distFade);

    gl_FragColor = vec4(color, alpha);
  }
`;

const OceanMaterial = shaderMaterial(
  {
    uTime: 0,
    uDeepColor: new THREE.Color("#1a1436"),
    uShallowColor: new THREE.Color("#5b447f"),
    uSkyColor: new THREE.Color("#7d6ac2"),
    uFoamColor: new THREE.Color("#e8c27a"),
    uSunDirection: new THREE.Vector3(0.5, 0.6, 0.3).normalize(),
    uOpacity: 1,
    uCameraDist: 20,
  },
  vertexShader,
  fragmentShader
);

extend({ OceanMaterial });

export default function Ocean() {
  const materialRef = useRef();
  const meshRef = useRef();
  const worldPos = useRef(new THREE.Vector3());

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
      if (meshRef.current) {
        meshRef.current.getWorldPosition(worldPos.current);
        materialRef.current.uCameraDist = state.camera.position.distanceTo(worldPos.current);
      }
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, 0]}>
      <planeGeometry args={[360, 360, 180, 180]} />
      <oceanMaterial ref={materialRef} transparent />
    </mesh>
  );
}
