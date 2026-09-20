"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import SignalPill from "@/components/ui/SignalPill";
import HeroFallback from "./HeroFallback";
import SceneErrorBoundary from "./SceneErrorBoundary";
import { detectWebglSupport } from "@/lib/useWebglSupport";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  // Safe to compute once, synchronously: rendering stays gated on `mounted`
  // (client-only) below, so this can never disagree with the server markup.
  const [webglOk] = useState(() => detectWebglSupport());
  const [sceneError, setSceneError] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const showScene = mounted && webglOk && !sceneError;

  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-bg">
      <div className="absolute inset-0">
        {showScene ? (
          <SceneErrorBoundary onError={() => setSceneError(true)}>
            <HeroScene />
          </SceneErrorBoundary>
        ) : (
          <HeroFallback />
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/30 via-bg/15 to-bg" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 42% at 50% 46%, rgba(6,4,14,0.6), transparent 72%)",
        }}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-[16vw] font-bold uppercase leading-[0.85] tracking-tight text-text sm:text-[10vw] lg:text-[7rem]">
          Charter<span className="text-accent">·</span>IQ
        </h1>
        <p className="mt-6 max-w-xl text-balance text-base text-text-muted sm:text-xl">
          Know the market weeks out. Act, don&apos;t react.
        </p>
        <SignalPill className="mt-8" />
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-text-muted/70">
        <div className="h-9 w-px animate-pulse bg-gradient-to-b from-text-muted/60 to-transparent motion-reduce:animate-none" />
      </div>
    </section>
  );
}
