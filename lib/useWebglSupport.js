"use client";

export function detectWebglSupport() {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return !!(window.WebGLRenderingContext && gl);
  } catch (error) {
    return false;
  }
}
