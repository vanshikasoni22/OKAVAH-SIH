import Reveal from "@/components/motion/Reveal";
import CountUp from "@/components/motion/CountUp";

const STATS = [
  { value: "85–90%", label: "Prediction accuracy" },
  { value: "8–12%", label: "Landed cost reduction" },
  { value: "100%", label: "Elimination of draft/LOA violations" },
  { value: "40–50%", label: "Shift to multi-voyage contracts" },
  { value: "30–40%", label: "Reduction in idle time & demurrage" },
  { value: "15–20%", label: "Faster berth clearance" },
];

export default function Impact() {
  return (
    <section className="relative bg-bg px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Projected impact
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Reveal className="col-span-2 row-span-2">
            <div className="flex h-full flex-col justify-between rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/15 via-surface to-surface p-8">
              <div className="font-display text-4xl font-bold tracking-tight text-accent-soft sm:text-6xl">
                ₹45–<CountUp to={60} duration={1.8} />&nbsp;Cr
              </div>
              <p className="mt-4 text-base font-medium text-text">
                Projected annual savings
              </p>
            </div>
          </Reveal>

          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={0.05 + i * 0.05}>
              <div className="flex h-full flex-col justify-between rounded-2xl border border-hairline bg-surface p-6">
                <div className="font-display text-3xl font-bold tracking-tight text-text">
                  {stat.value}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <p className="mt-10 max-w-3xl text-sm italic leading-relaxed text-text-muted">
            Directional estimates from published freight-forecasting
            literature and route benchmarking — to be validated against SAIL
            pilot data.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
