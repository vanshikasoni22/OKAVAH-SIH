import Reveal from "@/components/motion/Reveal";

const FACTS = [
  {
    stat: "$10K–$30K / day",
    title: "Demurrage delays",
    desc: "Daily penalties for vessel waiting time — a 5-day Capesize wait alone risks a $125,000 loss.",
  },
  {
    stat: "25–50%",
    title: "Fuel price swings",
    desc: "Bunker costs swing this share of total shipping cost, with no forward visibility on where they're heading.",
  },
  {
    stat: "Deadfreight",
    title: "Capacity mismatch",
    desc: "Wrong vessel-size calls trigger deadfreight penalties, or spiking per-tonne rates on split orders.",
  },
  {
    stat: "Double-handling",
    title: "Infrastructure limits",
    desc: "A vessel that exceeds a port's draft forces costly double-handling before cargo ever reaches the yard.",
  },
  {
    stat: "Reactive",
    title: "Reactive chartering",
    desc: "Booking day-by-day means unexpected spot rate spikes quietly destroy forecasted margins.",
  },
];

export default function Problem() {
  return (
    <section className="relative bg-bg px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="max-w-3xl text-2xl font-medium leading-snug text-text sm:text-3xl">
            SAIL&apos;s East Coast coal imports rely on reactive, day-by-day
            spot chartering — no freight-rate foresight, no port-capability
            checks.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {FACTS.map((fact, i) => (
            <Reveal key={fact.title} delay={i * 0.06}>
              <div className="group h-full rounded-2xl border border-hairline bg-surface p-6 transition-colors duration-300 hover:border-accent/40">
                <div className="font-display text-2xl font-bold tracking-tight text-accent-soft transition-colors duration-300 group-hover:text-accent">
                  {fact.stat}
                </div>
                <div className="mt-4 text-base font-semibold text-text">
                  {fact.title}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {fact.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
