import Reveal from "@/components/motion/Reveal";

const STEPS = [
  {
    index: "01",
    title: "Advanced AI model",
    desc: "Prunes impossible vessel-port pairings, predicts 30–90 day freight trends, and signals the optimal market entry.",
  },
  {
    index: "02",
    title: "Portal",
    desc: "Real-time landed costs in $/MT, optimal booking windows, and side-by-side multi-country sourcing comparison.",
  },
  {
    index: "03",
    title: "Port & risk intelligence radar",
    desc: "Anchorage queue monitoring, early cyclone alerts, and daily demurrage exposure, calculated automatically.",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative bg-surface px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display text-3xl font-bold tracking-tight text-text sm:text-4xl">
            How Charter-IQ works
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
          {STEPS.map((step, i) => (
            <Reveal key={step.index} delay={i * 0.08}>
              <div className="h-full border-t border-hairline pt-6">
                <div className="font-display text-sm font-semibold tracking-[0.2em] text-accent">
                  {step.index}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-text">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
