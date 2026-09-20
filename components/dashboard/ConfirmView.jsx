"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";
import ShipLoader from "@/components/ui/ShipLoader";
import { useBookingQuery } from "@/lib/BookingQueryContext";
import { useStageTransition } from "@/lib/useStageTransition";
import { computeLandingCost } from "@/lib/mockLandingCost";
import { generatePriceSeries } from "@/lib/mockPriceHistory";
import { assignVessel } from "@/lib/mockVessel";
import { explainSelection } from "@/lib/mockConfirmation";
import { formatDate, rateFormatter, totalFormatter } from "@/lib/format";

export default function ConfirmView() {
  const { query, selectedDate } = useBookingQuery();
  const { phase, loadingLabel, goTo, handleExitComplete } = useStageTransition();

  const result = useMemo(() => (query ? computeLandingCost(query) : null), [query]);

  const priceData = useMemo(() => {
    if (!query || !result) return null;
    return generatePriceSeries({
      pickupPort: query.pickupPort,
      dropPort: query.dropPort,
      baseRate: result.ratePerMT,
    });
  }, [query, result]);

  if (!query || !result || !priceData) {
    return (
      <main className="flex min-h-[100svh] flex-col items-center justify-center gap-6 bg-bg px-6 text-center">
        <p className="text-xl text-text-muted">
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

  const { series, events, todayIndex } = priceData;
  const selectedPoint = selectedDate ? series.find((p) => p.date === selectedDate) ?? null : null;
  const finalDate = selectedPoint ? selectedPoint.date : series[todayIndex].date;
  const finalRate = selectedPoint ? selectedPoint.close : result.ratePerMT;
  const finalTotal = finalRate * query.weight;
  const vessel = assignVessel(query.weight);
  const reasoning = explainSelection({ query, result, series, events, selectedPoint });

  return (
    <main className="relative flex min-h-[100svh] flex-col items-center overflow-hidden bg-bg px-6 py-16 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 35% at 50% 18%, rgba(217,164,65,0.08), transparent 70%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center">
        <Link href="/" className="mb-10 font-display text-xl font-bold tracking-tight text-text">
          Charter<span className="text-accent">·</span>IQ
        </Link>

        <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
          {phase === "idle" && (
            <motion.div
              key="confirm-review"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex w-full flex-col items-center text-center"
            >
              <Reveal className="flex flex-col items-center">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                  Review &amp; confirm
                </p>
                <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-text sm:text-4xl">
                  Ready to book?
                </h1>
              </Reveal>

              <Reveal delay={0.06} className="mt-8 w-full">
                <div className="rounded-3xl border border-hairline bg-surface p-8 sm:p-10">
                  <dl className="grid grid-cols-1 gap-6 text-left sm:grid-cols-2">
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                        Route
                      </dt>
                      <dd className="mt-1.5 text-xl font-semibold text-text">
                        {query.pickupPort} → {query.dropPort}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                        Date
                      </dt>
                      <dd className="mt-1.5 text-xl font-semibold text-text">
                        {formatDate(finalDate)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                        Vessel size
                      </dt>
                      <dd className="mt-1.5 text-xl font-semibold text-text">
                        {vessel.name}{" "}
                        <span className="text-sm font-normal text-text-muted">
                          · {vessel.dwt}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                        Cargo weight
                      </dt>
                      <dd className="mt-1.5 text-xl font-semibold text-text">
                        {query.weight.toLocaleString("en-IN")} MT
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-8 border-t border-hairline pt-8 text-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                      Final landing cost
                    </p>
                    <div className="mt-2 flex flex-wrap items-baseline justify-center gap-x-2">
                      <span className="font-display text-4xl font-bold tracking-tight text-text sm:text-6xl">
                        {rateFormatter.format(finalRate)}
                      </span>
                      <span className="text-xl text-text-muted">/ MT</span>
                    </div>
                    <p className="mt-2 text-text-muted">
                      ≈ {totalFormatter.format(finalTotal)} total for{" "}
                      {query.weight.toLocaleString("en-IN")} MT
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.12} className="mt-6 w-full">
                <div className="rounded-2xl border border-accent/25 bg-accent/5 p-6 text-left">
                  <p className="text-sm font-semibold uppercase tracking-widest text-accent-soft">
                    Why this works
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-text-muted">{reasoning}</p>
                </div>
              </Reveal>

              <Reveal
                delay={0.18}
                className="mt-10 flex w-full flex-col-reverse items-center justify-center gap-4 sm:flex-row"
              >
                <button
                  type="button"
                  onClick={() => goTo("/dashboard/results", { loader: false })}
                  className="inline-flex items-center justify-center rounded-full border border-hairline px-6 py-3 text-sm font-semibold text-text-muted transition-colors hover:border-accent/30 hover:text-text"
                >
                  Go back
                </button>
                <button
                  type="button"
                  onClick={() =>
                    goTo("/dashboard/confirmed", { label: "Locking in your booking…" })
                  }
                  className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-bg transition-transform duration-300 hover:scale-[1.02] hover:bg-accent-soft"
                >
                  Confirm booking
                </button>
              </Reveal>
            </motion.div>
          )}
          {phase === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex min-h-[50vh] items-center justify-center"
            >
              <ShipLoader label={loadingLabel} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
