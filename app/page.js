import Hero from "@/components/hero/Hero";
import Problem from "@/components/sections/Problem";
import Shift from "@/components/sections/Shift";
import HowItWorks from "@/components/sections/HowItWorks";
import Impact from "@/components/sections/Impact";
import Differentiators from "@/components/sections/Differentiators";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <main className="flex-1 bg-bg">
      <Hero />
      <Problem />
      <Shift />
      <HowItWorks />
      <Impact />
      <Differentiators />
      <CTA />
    </main>
  );
}
