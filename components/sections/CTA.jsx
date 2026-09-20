import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import HeroFallback from "@/components/hero/HeroFallback";

export default function CTA() {
  return (
    <section className="relative overflow-hidden px-6 py-32 sm:py-40">
      <HeroFallback />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-6xl">
            Stop reacting to the market.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mx-auto mt-5 max-w-xl text-base text-text-muted sm:text-xl">
            Freight forecasts, landed costs, and port risk — in one view,
            with the reasoning shown at every step.
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <Link
            href="/dashboard"
            className="mt-10 inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-bg transition-transform duration-300 hover:scale-[1.03] hover:bg-accent-soft"
          >
            Launch dashboard
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
