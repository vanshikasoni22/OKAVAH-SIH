const LEVEL_STYLES = {
  Low: "bg-accent/15 text-accent-soft",
  Medium: "bg-warn/15 text-warn",
  High: "bg-warn/25 text-warn",
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
    <div className="w-full rounded-2xl border border-hairline bg-surface p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
        Risk &amp; demurrage
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex items-center justify-between rounded-xl border border-hairline bg-surface-2/50 px-4 py-3"
          >
            <div>
              <p className="text-sm text-text-muted">{metric.label}</p>
              <p className="mt-0.5 text-base font-semibold text-text">{metric.value}</p>
            </div>
            <LevelTag level={metric.level} />
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 border-t border-hairline pt-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            Demurrage budget
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-text">
            ${risk.demurrageBudget.toLocaleString("en-US")}
          </p>
          <p className="text-xs text-text-muted">Estimated total exposure at current congestion</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            Dispatch opportunity
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-accent-soft">
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
