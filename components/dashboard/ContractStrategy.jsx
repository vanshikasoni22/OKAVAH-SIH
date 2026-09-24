export default function ContractStrategy({ strategies }) {
  return (
    <div className="w-full">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
        Contract strategy
      </p>
      <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-text">
        Shift from spot to a laddered contract
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {strategies.map((strategy) => {
          const isRecommended = strategy.tag === "Recommended";
          return (
            <div
              key={strategy.id}
              className={`sheen h-full rounded-2xl border p-6 ${
                isRecommended ? "border-accent/30 bg-surface" : "border-hairline bg-surface-2/60"
              }`}
            >
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                  isRecommended ? "bg-accent/15 text-accent-soft" : "bg-surface-2 text-text-muted"
                }`}
              >
                {strategy.tag}
              </span>
              <h3 className="mt-3 text-xl font-semibold text-text">{strategy.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {strategy.description}
              </p>
              <p className="mt-3 text-sm italic leading-relaxed text-text-muted/80">
                {strategy.detail}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
