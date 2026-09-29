// A real three-step ramp, not one color at three opacities: Low reads calm
// (the same amber the rest of the app uses for "this is fine"), Medium
// shifts hue entirely into the warn tone, High keeps that hue but adds
// weight and a border so it doesn't rely on color alone to read as worse.
const LEVEL_STYLES = {
  Low: "border border-accent/25 bg-accent/10 text-accent-soft",
  Medium: "border border-warn/25 bg-warn/10 text-warn",
  High: "border border-warn/60 bg-warn/20 font-bold text-warn",
};

function LevelTag({ level }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
        LEVEL_STYLES[level] ?? LEVEL_STYLES.Medium
      }`}
    >
      {level}
    </span>
  );
}

export default function RiskPanel({ risk }) {
  const metrics = [
    {
      label: "Port congestion delay",
      value: `${risk.congestion.days} day${risk.congestion.days === 1 ? "" : "s"}`,
      level: risk.congestion.level,
    },
    {
      label: "Demurrage exposure",
      value: `$${risk.demurrage.low.toLocaleString("en-US")}–$${risk.demurrage.high.toLocaleString(
        "en-US"
      )}/day`,
      level: risk.demurrage.level,
    },
    { label: "Weather disruption", value: risk.weather.level, level: risk.weather.level },
    {
      label: "Rate volatility",
      value: `Z ${risk.volatility.z > 0 ? "+" : ""}${risk.volatility.z}`,
      level: risk.volatility.level,
    },
  ];

  return (
    <div className="sheen w-full rounded-2xl border border-hairline bg-surface p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
        Risk &amp; demurrage
      </p>

      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="sheen flex items-center justify-between rounded-xl border border-hairline bg-surface-2/50 px-3.5 py-2.5"
          >
            <div>
              <p className="text-sm text-text-muted">{metric.label}</p>
              <p className="mt-0.5 font-mono text-base font-semibold text-text">{metric.value}</p>
            </div>
            <LevelTag level={metric.level} />
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 divide-y divide-hairline border-t border-hairline pt-3 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <div className="pb-3 sm:pb-0 sm:pr-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            Demurrage budget
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-text">
            ${risk.demurrageBudget.toLocaleString("en-US")}
          </p>
          <p className="text-xs text-text-muted">Estimated total exposure at current congestion</p>
        </div>
        <div className="pt-3 sm:pl-5 sm:pt-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            Dispatch opportunity
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-accent-soft">
            +${risk.dispatchBonus.toLocaleString("en-US")}/day
          </p>
          <p className="text-xs text-text-muted">
            Bonus available for fast unloading at this port
          </p>
        </div>
      </div>
    </div>
  );
}
