"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useBookingQuery } from "@/lib/BookingQueryContext";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const PICKUP_PORTS = [
  "Newcastle (Australia)",
  "Richards Bay (South Africa)",
  "Hampton Roads (US)",
  "Vostochny (Russia)",
];

const DROP_PORTS = ["Paradip", "Visakhapatnam", "Gangavaram", "Haldia", "Dhamra"];

const INITIAL_FORM = {
  startDate: "",
  endDate: "",
  pickupPort: "",
  dropPort: "",
  weight: "",
};

const inputClass =
  "w-full rounded-xl border border-hairline bg-surface-2 px-4 py-3 text-base text-text outline-none transition-colors focus:border-accent/50 [color-scheme:dark]";

const selectClass =
  "w-full appearance-none rounded-xl border border-hairline bg-surface-2 px-4 py-3 pr-10 text-base text-text outline-none transition-colors focus:border-accent/50";

function Field({ label, htmlFor, error, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-text-muted">
        {label}
      </label>
      {children}
      {error && <p className="text-sm text-warn">{error}</p>}
    </div>
  );
}

function Chevron() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M5 7.5 10 12.5 15 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BookingForm() {
  const router = useRouter();
  const { setQuery } = useBookingQuery();
  const reduced = usePrefersReducedMotion();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [leaving, setLeaving] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate(values) {
    const next = {};
    if (!values.startDate) next.startDate = "Start date is required.";
    if (!values.endDate) next.endDate = "End date is required.";
    if (values.startDate && values.endDate && values.endDate <= values.startDate) {
      next.endDate = "End date must be after the start date.";
    }
    if (!values.pickupPort) next.pickupPort = "Choose a pickup port.";
    if (!values.dropPort) next.dropPort = "Choose a drop port.";
    if (!values.weight) {
      next.weight = "Cargo weight is required.";
    } else if (!(Number(values.weight) > 0)) {
      next.weight = "Enter a weight greater than 0.";
    }
    return next;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setQuery({ ...form, weight: Number(form.weight) });

    if (reduced) {
      router.push("/dashboard/results");
      return;
    }
    setLeaving(true);
  }

  return (
    <AnimatePresence mode="wait" onExitComplete={() => router.push("/dashboard/results")}>
      {!leaving && (
        <motion.div
          key="booking-query"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl"
        >
          <div className="mb-10 text-center">
            <h1 className="font-display text-3xl font-bold tracking-tight text-text sm:text-4xl">
              Where and when?
            </h1>
            <p className="mt-3 text-base text-text-muted">
              We&apos;ll calculate landed cost and the optimal booking window.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-3xl border border-hairline bg-surface p-8 sm:p-12"
          >
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field label="Start date" htmlFor="startDate" error={errors.startDate}>
                  <input
                    id="startDate"
                    type="date"
                    className={inputClass}
                    value={form.startDate}
                    onChange={(e) => update("startDate", e.target.value)}
                  />
                </Field>
                <Field label="End date" htmlFor="endDate" error={errors.endDate}>
                  <input
                    id="endDate"
                    type="date"
                    min={form.startDate || undefined}
                    className={inputClass}
                    value={form.endDate}
                    onChange={(e) => update("endDate", e.target.value)}
                  />
                </Field>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex-1">
                  <Field label="Pickup port" htmlFor="pickupPort" error={errors.pickupPort}>
                    <div className="relative">
                      <select
                        id="pickupPort"
                        className={selectClass}
                        value={form.pickupPort}
                        onChange={(e) => update("pickupPort", e.target.value)}
                      >
                        <option value="" disabled>
                          Select pickup port
                        </option>
                        {PICKUP_PORTS.map((port) => (
                          <option key={port} value={port}>
                            {port}
                          </option>
                        ))}
                      </select>
                      <Chevron />
                    </div>
                  </Field>
                </div>

                <div className="flex items-center justify-center pt-8 text-lg text-accent sm:pt-9">
                  <span className="sm:hidden">↓</span>
                  <span className="hidden sm:inline">→</span>
                </div>

                <div className="flex-1">
                  <Field label="Drop port" htmlFor="dropPort" error={errors.dropPort}>
                    <div className="relative">
                      <select
                        id="dropPort"
                        className={selectClass}
                        value={form.dropPort}
                        onChange={(e) => update("dropPort", e.target.value)}
                      >
                        <option value="" disabled>
                          Select drop port
                        </option>
                        {DROP_PORTS.map((port) => (
                          <option key={port} value={port}>
                            {port}
                          </option>
                        ))}
                      </select>
                      <Chevron />
                    </div>
                  </Field>
                </div>
              </div>

              <Field label="Cargo weight (tonnes)" htmlFor="weight" error={errors.weight}>
                <div className="relative">
                  <input
                    id="weight"
                    type="number"
                    min="0"
                    step="any"
                    inputMode="decimal"
                    placeholder="e.g. 75,000"
                    className={`${inputClass} pr-14`}
                    value={form.weight}
                    onChange={(e) => update("weight", e.target.value)}
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-text-muted">
                    MT
                  </span>
                </div>
              </Field>

              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-bg transition-transform duration-300 hover:scale-[1.01] hover:bg-accent-soft"
              >
                Get landing cost
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
