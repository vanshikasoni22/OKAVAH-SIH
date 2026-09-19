"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const LOADING_MS = 550;

// Shared "leave this stage, optionally show the ship loader, then navigate"
// choreography for every inter-stage link/button in the dashboard, so the
// five stages transition consistently instead of each screen inventing its
// own timing. Under prefers-reduced-motion, every transition collapses to an
// immediate navigation — no fade, no loader.
export function useStageTransition() {
  const router = useRouter();
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState("idle"); // idle | leaving | loading
  const [loadingLabel, setLoadingLabel] = useState("Loading…");
  const pending = useRef({ href: null, showLoader: true });

  function goTo(href, { loader = true, label = "Loading…" } = {}) {
    if (reduced) {
      router.push(href);
      return;
    }
    // Without this, a stage left mid-scroll (a long form on mobile, say)
    // exits and shows the loader below the fold, where nothing is visible.
    window.scrollTo({ top: 0, behavior: "smooth" });
    pending.current = { href, showLoader: loader };
    setLoadingLabel(label);
    setPhase("leaving");
  }

  function handleExitComplete() {
    const { href, showLoader } = pending.current;
    if (!href) return;
    if (showLoader) {
      setPhase("loading");
      window.setTimeout(() => router.push(href), LOADING_MS);
    } else {
      router.push(href);
    }
  }

  return { phase, loadingLabel, goTo, handleExitComplete };
}
