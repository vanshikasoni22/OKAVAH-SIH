"use client";

import * as THREE from "three";
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";

// Keep the ship's on-screen *width* roughly constant across aspect ratios by
// deriving vertical FOV from a fixed horizontal FOV, instead of the usual
// fixed-vertical-FOV default (which crops badly on narrow/portrait screens).
const HORIZONTAL_FOV = THREE.MathUtils.degToRad(58);

export default function CameraRig() {
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const cam = state.camera;
    const aspect = state.size.width / state.size.height;

    const verticalFov = THREE.MathUtils.radToDeg(
      2 * Math.atan(Math.tan(HORIZONTAL_FOV / 2) / aspect)
    );
    const clampedFov = THREE.MathUtils.clamp(verticalFov, 32, 100);
    if (Math.abs(cam.fov - clampedFov) > 0.1) {
      cam.fov = clampedFov;
      cam.updateProjectionMatrix();
    }

    target.set(
      Math.sin(t * 0.035) * 3.4,
      6.6 + Math.sin(t * 0.05 + 1.1) * 0.55,
      18 + Math.cos(t * 0.028) * 1.8
    );
    cam.position.lerp(target, 0.015);
    cam.lookAt(0, -0.3, 0);
  });

  return null;
}
