import Reveal from "@/components/motion/Reveal";

export default function Shift() {
  return (
    <section className="relative bg-bg px-6 py-36 sm:py-48">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <p className="font-display text-2xl font-semibold leading-[1.1] tracking-tight text-text sm:text-6xl">
            We turn &ldquo;check the market every day and hope&rdquo; into{" "}
            <span className="text-accent">
              &ldquo;know the market weeks out and act.&rdquo;
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
