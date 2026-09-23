import { rateFormatter, totalFormatter } from "@/lib/format";

const BREAKDOWN_ROWS = [
  { key: "baseFreight", label: "Base Freight" },
  { key: "portTariff", label: "Port Tariff" },
  { key: "idleDelay", label: "Idle Delay" },
  { key: "riskPremium", label: "Risk Premium" },
  { key: "scaleAdj", label: "Scale / Deadfreight Adj." },
];

function formatDelta(value) {
  const formatted = totalFormatter.format(Math.abs(value));
  return value < 0 ? `-${formatted}` : `+${formatted}`;
}

function VesselOptionCard({ option, weight }) {
  const isOptimal = option.rank === 1;

  return (
    <div
      className={`flex h-full flex-col rounded-2xl border p-6 ${
        isOptimal ? "border-accent/30" : "border-hairline bg-surface"
      }`}
      style={
        isOptimal
          ? {
              background:
                "radial-gradient(120% 100% at 8% 0%, rgba(217,164,65,0.1), transparent 60%), var(--color-surface)",
            }
          : undefined
      }
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-lg font-bold text-text-muted">#{option.rank}</span>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            isOptimal ? "bg-accent/15 text-accent-soft" : "bg-surface-2 text-text-muted"
          }`}
        >
          {option.tag}
        </span>
      </div>

      <p className="mt-3 text-xl font-semibold text-text">{option.vesselName}</p>
      <p className="text-xs text-text-muted">{option.dwt}</p>

      <div className="mt-4 border-t border-hairline pt-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          Total landing cost
        </p>
        <p className="mt-1 font-display text-2xl font-bold text-text">
          {totalFormatter.format(option.totalCost)}
        </p>
        <p className="text-xs text-text-muted">
          {rateFormatter.format(option.totalCost / weight)} / MT
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-1.5 border-t border-hairline pt-4 text-sm">
        {BREAKDOWN_ROWS.map(({ key, label }) => {
          const value = option.breakdown[key];
          const isAdj = key === "scaleAdj";
          return (
            <div key={key} className="flex items-center justify-between gap-2">
              <span className="text-text-muted">{label}</span>
              <span
                className={isAdj ? (value < 0 ? "text-accent-soft" : "text-warn") : "text-text"}
              >
                {isAdj ? formatDelta(value) : totalFormatter.format(value)}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-4 border-t border-hairline pt-4 text-sm leading-relaxed text-text-muted">
        {option.insight}
      </p>
    </div>
  );
}

export default function VesselOptions({ options, weight }) {
  return (
    <div className="w-full">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
        Vessel options
      </p>
      <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-text">
        Ranked by landing cost
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {options.map((option) => (
          <VesselOptionCard key={option.rank} option={option} weight={weight} />
        ))}
      </div>
    </div>
  );
}
