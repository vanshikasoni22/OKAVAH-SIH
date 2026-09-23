"use client";

// One-click demo runs. Exists purely so a live demo never depends on typing
// going right on stage — click a preset and the form (and the submit) is
// already done.

const PRESETS = [
  {
    label: "Newcastle → Paradip (75K MT)",
    values: {
      pickupPort: "Newcastle 🇦🇺",
      dropPort: "Paradip Port (Odisha)",
      weight: "75000",
      commodity: "Thermal Coal",
    },
  },
  {
    label: "Newcastle → Gangavaram (150K MT)",
    values: {
      pickupPort: "Newcastle 🇦🇺",
      dropPort: "Gangavaram Port (Andhra Pradesh)",
      weight: "150000",
      commodity: "Coking Coal",
    },
  },
  {
    label: "Samarinda → Haldia (30K MT)",
    values: {
      pickupPort: "Samarinda 🇮🇩",
      dropPort: "Haldia Dock Complex (West Bengal)",
      weight: "30000",
      commodity: "Thermal Coal",
    },
  },
];

function isoDateFromNow(daysFromNow) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().slice(0, 10);
}

export default function QuickPresets({ onApply }) {
  return (
    <div className="mb-6 w-full max-w-2xl">
      <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
        Quick demo presets
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() =>
              onApply({
                ...preset.values,
                startDate: isoDateFromNow(3),
                endDate: isoDateFromNow(24),
              })
            }
            className="rounded-full border border-hairline bg-surface-2/60 px-4 py-2 text-xs font-medium text-text-muted transition-colors hover:border-accent/40 hover:text-accent-soft"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
