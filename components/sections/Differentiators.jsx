import Reveal from "@/components/motion/Reveal";

const POINTS = [
  {
    title: "Two-layer hybrid architecture",
    desc: "Prunes physically impossible routes before forecasting — preventing impossible charter recommendations from ever reaching a decision-maker.",
  },
  {
    title: "PSU-tailored engine",
    desc: "Solves India-specific port constraints — draft limits, monsoon windows, PSU procurement cycles — where generic global freight tools fall short.",
  },
];

export default function Differentiators() {
  return (
    <section className="relative bg-surface px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-4xl">
            What sets us apart
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {POINTS.map((point, i) => {
            const isFirst = i === 0;
            return (
              <Reveal key={point.title} delay={i * 0.1}>
                <div
                  className={`sheen h-full rounded-2xl border p-8 ${
                    isFirst
                      ? "border-accent/20 bg-surface-2"
                      : "border-hairline bg-surface-2/60"
                  }`}
                >
                  <div className={`h-px w-12 ${isFirst ? "bg-accent" : "bg-hairline"}`} />
                  <h3 className="mt-6 text-xl font-semibold text-text sm:text-2xl">
                    {point.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-text-muted">
                    {point.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
