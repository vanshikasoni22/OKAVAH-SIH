import Reveal from "@/components/motion/Reveal";

const STEPS = [
  {
    index: "01",
    title: "Advanced AI model",
    desc: "Prunes impossible vessel-port pairings, predicts 30–90 day freight trends, and signals the optimal market entry.",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="4" cy="5.5" r="1.6" />
        <circle cx="16" cy="5.5" r="1.6" />
        <circle cx="10" cy="15" r="1.6" />
        <path d="M5.4 6.5 8.8 13.4M14.6 6.5 11.2 13.4M5.6 5.5H14.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    index: "02",
    title: "Portal",
    desc: "Real-time landed costs in $/MT, optimal booking windows, and side-by-side multi-country sourcing comparison.",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2.5" y="4" width="15" height="10" rx="1.5" />
        <path d="M7 17h6M10 14v3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    index: "03",
    title: "Port & risk intelligence radar",
    desc: "Anchorage queue monitoring, early cyclone alerts, and daily demurrage exposure, calculated automatically.",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="10" cy="10" r="7" />
        <circle cx="10" cy="10" r="3.2" opacity="0.5" />
        <path d="M10 10 15 6" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="relative bg-surface px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-4xl">
            How Charter-IQ works
          </h2>
        </Reveal>

        <div className="relative mt-16">
          <div
            aria-hidden="true"
            className="flow-line absolute left-5 top-0 h-[calc(100%-2.5rem)] w-px md:left-0 md:top-5 md:h-px md:w-full"
          />

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map((step, i) => (
              <Reveal key={step.index} delay={i * 0.1}>
                <div className="flex gap-4 md:block">
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-surface text-accent-soft md:mb-6">
                    {step.icon}
                  </div>
                  <div className="pt-1 md:pt-0">
                    <div className="font-display text-sm font-semibold tracking-[0.14em] text-accent">
                      {step.index}
                    </div>
                    <h3 className="mt-1 text-xl font-semibold text-text md:mt-3">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-muted">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
