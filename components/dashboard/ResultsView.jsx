"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";
import SignalPill from "@/components/ui/SignalPill";
import ShipLoader from "@/components/ui/ShipLoader";
import PriceTrendChart from "@/components/dashboard/PriceTrendChart";
import { useBookingQuery } from "@/lib/BookingQueryContext";
import { useStageTransition } from "@/lib/useStageTransition";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { computeLandingCost } from "@/lib/mockLandingCost";
import { generatePriceSeries } from "@/lib/mockPriceHistory";
import { formatDate, rateFormatter, totalFormatter } from "@/lib/format";

const CHART_LOAD_MS = 700;

export default function ResultsView() {
  const { query, selectedDate, setSelectedDate } = useBookingQuery();
  const { phase, loadingLabel, goTo, handleExitComplete } = useStageTransition();
  const reduced = usePrefersReducedMotion();
  const [chartReady, setChartReady] = useState(false);

  const result = useMemo(() => (query ? computeLandingCost(query) : null), [query]);

  const priceData = useMemo(() => {
    if (!query || !result) return null;
    return generatePriceSeries({
      pickupPort: query.pickupPort,
      dropPort: query.dropPort,
      baseRate: result.ratePerMT,
    });
  }, [query, result]);

  useEffect(() => {
    if (!priceData) return;
    const timer = window.setTimeout(
      () => setChartReady(true),
      reduced ? 0 : CHART_LOAD_MS
    );
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, reduced]);

  if (!query || !result || !priceData) {
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

  const { series, events, todayIndex } = priceData;
  const selectedPoint = selectedDate ? series.find((p) => p.date === selectedDate) ?? null : null;
  const displayRate = selectedPoint ? selectedPoint.close : result.ratePerMT;
  const displayTotal = displayRate * query.weight;
  const chartSelectedDate = selectedPoint ? selectedPoint.date : series[todayIndex].date;

  function handleSelectDate(dateStr) {
    const point = series.find((p) => p.date === dateStr);
    if (point) setSelectedDate(point.date);
  }

  return (
    <main className="relative flex min-h-[100svh] flex-col items-center overflow-hidden bg-bg px-6 py-16 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 35% at 50% 18%, rgba(217,164,65,0.08), transparent 70%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center">
        <Link href="/" className="mb-10 font-display text-lg font-bold tracking-tight text-text">
          Charter<span className="text-accent">·</span>IQ
        </Link>

        <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
          {phase === "idle" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex w-full flex-col items-center"
            >
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
                  {selectedPoint ? `Rate for ${formatDate(selectedPoint.date)}` : "Landing cost"}
                </p>
                <div className="mt-4 flex flex-wrap items-baseline justify-center gap-x-3">
                  <span className="font-display text-7xl font-bold leading-none tracking-tight text-text sm:text-8xl">
                    {rateFormatter.format(displayRate)}
                  </span>
                  <span className="text-xl text-text-muted sm:text-2xl">/ MT</span>
                </div>
                <p className="mt-4 text-lg text-text-muted">
                  ≈ {totalFormatter.format(displayTotal)} total for{" "}
                  {query.weight.toLocaleString("en-IN")} MT
                </p>
                {selectedPoint && (
                  <button
                    type="button"
                    onClick={() => setSelectedDate(null)}
                    className="mt-2 text-sm text-accent-soft underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent"
                  >
                    ← Use today&apos;s recommended rate
                  </button>
                )}

                <SignalPill className="mt-8 px-5 py-2 text-base">
                  {result.recommendation.label}
                </SignalPill>

                <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-text-muted">
                  {result.insight}
                </p>
              </Reveal>

              <Reveal delay={0.1} className="mt-14 w-full">
                {chartReady ? (
                  <PriceTrendChart
                    series={series}
                    events={events}
                    todayIndex={todayIndex}
                    selectedDate={chartSelectedDate}
                    onSelectDate={handleSelectDate}
                  />
                ) : (
                  <div className="flex h-[420px] items-center justify-center rounded-3xl border border-hairline bg-surface sm:h-[460px]">
                    <ShipLoader label="Loading 45 days of freight data…" />
                  </div>
                )}
              </Reveal>

              <Reveal
                delay={0.15}
                className="mt-12 flex flex-col-reverse items-center gap-4 sm:flex-row"
              >
                <button
                  type="button"
                  onClick={() => goTo("/dashboard", { loader: false })}
                  className="inline-flex items-center justify-center rounded-full border border-hairline px-6 py-3 text-sm font-semibold text-text transition-colors hover:border-accent/40 hover:text-accent-soft"
                >
                  ← Edit query
                </button>
                <button
                  type="button"
                  onClick={() =>
                    goTo("/dashboard/confirm", { label: "Preparing your summary…" })
                  }
                  className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-bg transition-transform duration-300 hover:scale-[1.02] hover:bg-accent-soft"
                >
                  Review &amp; confirm →
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
