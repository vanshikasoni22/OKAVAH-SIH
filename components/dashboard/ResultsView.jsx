"use client";

import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import SignalPill from "@/components/ui/SignalPill";
import { useBookingQuery } from "@/lib/BookingQueryContext";
import { computeLandingCost } from "@/lib/mockLandingCost";

const rateFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const totalFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatDate(value) {
  if (!value) return value;
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ResultsView() {
  const { query } = useBookingQuery();

  if (!query) {
    return (
      <main className="flex min-h-[100svh] flex-col items-center justify-center gap-6 bg-bg px-6 text-center">
        <p className="text-lg text-text-muted">
          No booking query yet — start one to see landing costs.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-full border border-hairline px-6 py-3 text-sm font-semibold text-text transition-colors hover:border-accent/40 hover:text-accent-soft"
        >
          ← Start a new query
        </Link>
      </main>
    );
  }

  const result = computeLandingCost(query);

  return (
    <main className="relative flex min-h-[100svh] flex-col items-center overflow-hidden bg-bg px-6 py-16 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 35% at 50% 22%, rgba(217,164,65,0.08), transparent 70%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center">
        <Link href="/" className="mb-10 font-display text-lg font-bold tracking-tight text-text">
          Charter<span className="text-accent">·</span>IQ
        </Link>

        <Reveal className="flex w-full flex-col items-center text-center">
          <div className="mb-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-text-muted">
            <span className="text-text">{query.pickupPort}</span>
            <span className="text-accent">→</span>
            <span className="text-text">{query.dropPort}</span>
            <span aria-hidden="true">·</span>
            <span>
              {formatDate(query.startDate)} – {formatDate(query.endDate)}
            </span>
            <span aria-hidden="true">·</span>
            <span>{query.weight.toLocaleString("en-IN")} MT</span>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
            Landing cost
          </p>
          <div className="mt-4 flex flex-wrap items-baseline justify-center gap-x-3">
            <span className="font-display text-7xl font-bold leading-none tracking-tight text-text sm:text-8xl">
              {rateFormatter.format(result.ratePerMT)}
            </span>
            <span className="text-xl text-text-muted sm:text-2xl">/ MT</span>
          </div>
          <p className="mt-4 text-lg text-text-muted">
            ≈ {totalFormatter.format(result.totalCost)} total for{" "}
            {query.weight.toLocaleString("en-IN")} MT
          </p>

          <SignalPill className="mt-8 px-5 py-2 text-base">
            {result.recommendation.label}
          </SignalPill>

          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-text-muted">
            {result.insight}
          </p>

          <Link
            href="/dashboard"
            className="mt-12 inline-flex items-center justify-center rounded-full border border-hairline px-6 py-3 text-sm font-semibold text-text transition-colors hover:border-accent/40 hover:text-accent-soft"
          >
            ← Edit query
          </Link>
        </Reveal>
      </div>
    </main>
  );
}
