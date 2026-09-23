export default function FeasibilityCheck({ feasibility, vesselName, dropPort }) {
  const { checks, passed } = feasibility;

  return (
    <div
      className={`w-full rounded-2xl border p-6 ${
        passed ? "border-accent/25 bg-accent/5" : "border-warn/40 bg-warn/5"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
            Physical feasibility
          </p>
          <p className="mt-1 text-sm text-text-muted">
            {vesselName} vs. {dropPort}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${
            passed ? "bg-accent/15 text-accent-soft" : "bg-warn/15 text-warn"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${passed ? "bg-accent" : "bg-warn"}`} />
          {passed ? "Passed" : "Failed"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {checks.map((check) => (
          <div
            key={check.label}
            className="rounded-xl border border-hairline bg-surface-2/50 px-3 py-2.5 text-center"
          >
            <p className="text-xs text-text-muted">{check.label}</p>
            <p className={`mt-1 text-sm font-semibold ${check.pass ? "text-text" : "text-warn"}`}>
              {check.vessel}
              {check.unit}{" "}
              <span className="font-normal text-text-muted">
                / {check.limit}
                {check.unit}
              </span>
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-muted">
        {passed
          ? "Compatibility PASSED: draft and beam within destination limits."
          : "Compatibility FAILED: draft exceeds destination limits — a smaller vessel class or lightering will be required."}
      </p>
    </div>
  );
}
