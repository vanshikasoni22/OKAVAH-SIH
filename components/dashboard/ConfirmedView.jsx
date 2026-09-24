"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";
import ShipLoader from "@/components/ui/ShipLoader";
import { useBookingQuery } from "@/lib/BookingQueryContext";
import { useStageTransition } from "@/lib/useStageTransition";
import { computeLandingCost } from "@/lib/mockLandingCost";
import { generatePriceSeries } from "@/lib/mockPriceHistory";
import { assignVessel } from "@/lib/mockVessel";
import { formatDate, rateFormatter, totalFormatter } from "@/lib/format";
import { submitFeedback } from "@/lib/feedbackStore";

const REJECT_REASONS = [
  "Price still too high",
  "Timing doesn't fit our schedule",
  "Vessel type not preferred",
  "Other — specify",
];

const OTHER_REASON = "Other — specify";

export default function ConfirmedView() {
  const { query, selectedDate } = useBookingQuery();
  const { phase, loadingLabel, goTo, handleExitComplete } = useStageTransition();

  const [path, setPath] = useState(null); // null | "accept" | "reject"
  const [status, setStatus] = useState("idle"); // idle | submitting | submitted
  const [comment, setComment] = useState("");
  const [reason, setReason] = useState("");
  const [otherText, setOtherText] = useState("");

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
          No booking to review yet — start a query first.
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

  const { series, todayIndex } = priceData;
  const selectedPoint = selectedDate ? series.find((p) => p.date === selectedDate) ?? null : null;
  const finalDate = selectedPoint ? selectedPoint.date : series[todayIndex].date;
  const finalRate = selectedPoint ? selectedPoint.close : result.ratePerMT;
  const finalTotal = finalRate * query.weight;
  const vessel = assignVessel(query.weight);

  const bookingSummary = {
    route: `${query.pickupPort} → ${query.dropPort}`,
    date: finalDate,
    vessel: vessel.name,
    rate: finalRate,
    weight: query.weight,
  };

  async function handleAcceptSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    await submitFeedback({ type: "accept", comment, ...bookingSummary });
    setStatus("submitted");
  }

  async function handleRejectSubmit(event) {
    event.preventDefault();
    if (!reason) return;
    setStatus("submitting");
    await submitFeedback({
      type: "reject",
      reason,
      otherText: reason === OTHER_REASON ? otherText : undefined,
      ...bookingSummary,
    });
    setStatus("submitted");
  }

  function startOver() {
    setPath(null);
    setStatus("idle");
    setComment("");
    setReason("");
    setOtherText("");
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

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center">
        <Link href="/" className="mb-10 font-display text-xl font-bold tracking-tight text-text">
          Charter<span className="text-accent">·</span>IQ
        </Link>

        <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
          {phase === "idle" && (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex w-full flex-col items-center"
            >
              <Reveal className="flex flex-col items-center text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                  Booking confirmed
                </p>
                <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-text sm:text-4xl">
                  One last thing.
                </h1>
                <p className="mt-3 max-w-md text-base text-text-muted">
                  Was this the right call? Your read helps tune future
                  recommendations.
                </p>
              </Reveal>

              <Reveal delay={0.06} className="mt-8 w-full">
                <div className="sheen rounded-3xl border border-hairline bg-surface p-6 sm:p-8">
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-5 text-left sm:grid-cols-4">
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                        Route
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-text">
                        {query.pickupPort} → {query.dropPort}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                        Date
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-text">
                        {formatDate(finalDate)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                        Vessel
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-text">{vessel.name}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                        Landing cost
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-text">
                        {rateFormatter.format(finalRate)} / MT
                        <span className="block font-normal text-text-muted">
                          {totalFormatter.format(finalTotal)} total
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </Reveal>

              <Reveal delay={0.12} className="mt-6 w-full">
                {status === "submitted" ? (
                  <SubmittedState
                    path={path}
                    onStartOver={() => goTo("/dashboard", { loader: false })}
                  />
                ) : path === null ? (
                  <PromptState onChoose={setPath} />
                ) : path === "accept" ? (
                  <AcceptForm
                    comment={comment}
                    onCommentChange={setComment}
                    onSubmit={handleAcceptSubmit}
                    onBack={startOver}
                    submitting={status === "submitting"}
                  />
                ) : (
                  <RejectForm
                    reason={reason}
                    onReasonChange={setReason}
                    otherText={otherText}
                    onOtherTextChange={setOtherText}
                    onSubmit={handleRejectSubmit}
                    onBack={startOver}
                    submitting={status === "submitting"}
                  />
                )}
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

function PromptState({ onChoose }) {
  return (
    <div className="sheen rounded-2xl border border-hairline bg-surface p-6 text-center sm:p-8">
      <p className="text-base font-medium text-text">How did this recommendation land?</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-text-muted">
        Log audit approval or override notes back to the optimization reward.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={() => onChoose("accept")}
          className="inline-flex items-center justify-center rounded-full border border-accent/40 bg-accent/10 px-6 py-3 text-sm font-semibold text-accent-soft transition-colors hover:border-accent/70 hover:text-accent"
        >
          Approve Rate
        </button>
        <button
          type="button"
          onClick={() => onChoose("reject")}
          className="inline-flex items-center justify-center rounded-full border border-hairline px-6 py-3 text-sm font-semibold text-text-muted transition-colors hover:border-warn/50 hover:text-warn"
        >
          Override
        </button>
      </div>
    </div>
  );
}

function AcceptForm({ comment, onCommentChange, onSubmit, onBack, submitting }) {
  return (
    <form
      onSubmit={onSubmit}
      className="sheen rounded-2xl border border-hairline bg-surface p-6 text-left sm:p-8"
    >
      <label htmlFor="accept-comment" className="text-sm font-medium text-text">
        Anything about this recommendation worth noting?{" "}
        <span className="font-normal text-text-muted">(optional)</span>
      </label>
      <textarea
        id="accept-comment"
        rows={4}
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
        placeholder="e.g. Good timing call, vessel size was spot on…"
        className="mt-3 w-full rounded-xl border border-hairline bg-surface-2 px-4 py-3 text-base text-text outline-none transition-colors focus:border-accent/50"
      />
      <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-full border border-hairline px-6 py-3 text-sm font-semibold text-text-muted transition-colors hover:border-accent/30 hover:text-text"
        >
          ← Choose differently
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-bg transition-transform duration-300 hover:scale-[1.02] hover:bg-accent-soft disabled:opacity-60"
        >
          {submitting ? "Logging…" : "Log approval"}
        </button>
      </div>
    </form>
  );
}

function RejectForm({
  reason,
  onReasonChange,
  otherText,
  onOtherTextChange,
  onSubmit,
  onBack,
  submitting,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="sheen rounded-2xl border border-hairline bg-surface p-6 text-left sm:p-8"
    >
      <p className="text-sm font-medium text-text">What did the system miss?</p>
      <div className="mt-4 flex flex-col gap-3">
        {REJECT_REASONS.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-start gap-3 text-sm text-text-muted"
          >
            <input
              type="radio"
              name="reject-reason"
              value={option}
              checked={reason === option}
              onChange={(e) => onReasonChange(e.target.value)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-full border-2 border-hairline bg-transparent transition-colors checked:border-accent checked:bg-accent"
            />
            <span className={reason === option ? "text-text" : undefined}>{option}</span>
          </label>
        ))}
      </div>

      {reason === OTHER_REASON && (
        <textarea
          rows={3}
          value={otherText}
          onChange={(e) => onOtherTextChange(e.target.value)}
          placeholder="Tell us more (optional)"
          className="mt-4 w-full rounded-xl border border-hairline bg-surface-2 px-4 py-3 text-base text-text outline-none transition-colors focus:border-accent/50"
        />
      )}

      <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-full border border-hairline px-6 py-3 text-sm font-semibold text-text-muted transition-colors hover:border-accent/30 hover:text-text"
        >
          ← Choose differently
        </button>
        <button
          type="submit"
          disabled={!reason || submitting}
          className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-bg transition-transform duration-300 hover:scale-[1.02] hover:bg-accent-soft disabled:opacity-60"
        >
          {submitting ? "Logging…" : "Log override"}
        </button>
      </div>
    </form>
  );
}

function SubmittedState({ path, onStartOver }) {
  const message = path === "accept" ? "Approval logged." : "Override logged — thank you.";

  return (
    <div className="sheen rounded-2xl border border-accent/25 bg-accent/5 p-8 text-center">
      <p className="text-xl font-semibold text-text">{message}</p>
      <p className="mt-2 text-sm text-text-muted">
        This feeds back into the optimization reward, tuning future
        recommendations.
      </p>
      <button
        type="button"
        onClick={onStartOver}
        className="mt-6 inline-flex items-center justify-center rounded-full border border-hairline px-6 py-3 text-sm font-semibold text-text transition-colors hover:border-accent/40 hover:text-accent-soft"
      >
        Start a new query
      </button>
    </div>
  );
}
