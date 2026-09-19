"use client";

import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import { useBookingQuery } from "@/lib/BookingQueryContext";

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

  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center bg-bg px-6 py-20 text-center">
      <Reveal className="flex flex-col items-center">
        <span className="inline-flex items-center gap-2.5 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent-soft">
          Coming next
        </span>
        <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-text sm:text-5xl">
          Crunching your landing cost.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base text-text-muted">
          {query.weight.toLocaleString("en-IN")} MT from{" "}
          <span className="text-text">{query.pickupPort}</span> to{" "}
          <span className="text-text">{query.dropPort}</span>,{" "}
          {formatDate(query.startDate)} – {formatDate(query.endDate)}.
        </p>
        <p className="mt-2 max-w-lg text-sm text-text-muted">
          Freight-rate forecasts, landed-cost breakdowns, and the optimal
          booking window will live here next.
        </p>
        <Link
          href="/dashboard"
          className="mt-10 inline-flex items-center justify-center rounded-full border border-hairline px-6 py-3 text-sm font-semibold text-text transition-colors hover:border-accent/40 hover:text-accent-soft"
        >
          ← Edit query
        </Link>
      </Reveal>
    </main>
  );
}
