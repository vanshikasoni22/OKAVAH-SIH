"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import Wake from "./Wake";

const MODEL_BASE = "/models/cruiser-2012/";
const TARGET_LENGTH = 15.5;

export default function Ship() {
  const group = useRef();

  const materials = useLoader(MTLLoader, `${MODEL_BASE}Cruiser_2012.mtl`);

  const obj = useLoader(OBJLoader, `${MODEL_BASE}Cruiser_2012.obj`, (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  const { ship, halfLength } = useMemo(() => {
    const clone = obj.clone(true);

    const rawBox = new THREE.Box3().setFromObject(clone);
    const rawSize = new THREE.Vector3();
    rawBox.getSize(rawSize);

    // Normalize so the hull's long axis lies along local +X, regardless of
    // how the source mesh was authored.
    if (rawSize.z > rawSize.x) {
      clone.rotation.y = Math.PI / 2;
    }

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const scale = TARGET_LENGTH / Math.max(size.x, size.z);
    clone.scale.setScalar(scale);

    const scaledBox = new THREE.Box3().setFromObject(clone);
    const scaledCenter = new THREE.Vector3();
    scaledBox.getCenter(scaledCenter);

    clone.position.x -= scaledCenter.x;
    clone.position.z -= scaledCenter.z;
    clone.position.y -= scaledBox.min.y + (scaledBox.max.y - scaledBox.min.y) * 0.085;

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
        child.frustumCulled = false;
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat) => {
          if (!mat) return;
          mat.side = THREE.FrontSide;
          if ("shininess" in mat) mat.shininess = 18;
          if ("specular" in mat) mat.specular = new THREE.Color(0x3a2f52);
        });
      }
    });

    return { ship: clone, halfLength: TARGET_LENGTH / 2 };
  }, [obj]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!group.current) return;
    group.current.position.y = Math.sin(t * 0.45) * 0.16;
    group.current.rotation.z = Math.sin(t * 0.3) * 0.018;
    group.current.rotation.x = Math.sin(t * 0.22 + 1.4) * 0.01;
    group.current.position.x = Math.sin(t * 0.045) * 2.2;
    group.current.position.z = Math.cos(t * 0.03) * 1.1 - 1;
  });

  return (
    <group ref={group} rotation={[0, -Math.PI * 0.13, 0]}>
      <primitive object={ship} />
      <Wake anchorX={-halfLength} />
    </group>
  );
}
