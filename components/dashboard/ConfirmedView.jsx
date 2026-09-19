"use client";

import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import SignalPill from "@/components/ui/SignalPill";
import { useBookingQuery } from "@/lib/BookingQueryContext";

export default function ConfirmedView() {
  const { query } = useBookingQuery();

  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center bg-bg px-6 py-20 text-center">
      <Reveal className="flex flex-col items-center">
        <SignalPill>Coming next</SignalPill>
        <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-text sm:text-5xl">
          Booking request received.
        </h1>
        <p className="mt-4 max-w-lg text-base text-text-muted">
          {query
            ? `Confirmation, charter documents, and live tracking for ${query.pickupPort} → ${query.dropPort} will live here next.`
            : "Charter documents and live tracking will live here next."}
        </p>
        <Link
          href="/dashboard"
          className="mt-10 inline-flex items-center justify-center rounded-full border border-hairline px-6 py-3 text-sm font-semibold text-text transition-colors hover:border-accent/40 hover:text-accent-soft"
        >
          ← Start a new query
        </Link>
      </Reveal>
    </main>
  );
}
