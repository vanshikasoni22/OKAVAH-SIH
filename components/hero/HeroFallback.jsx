export default function HeroFallback() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(120% 55% at 50% 12%, rgba(217,164,65,0.18), transparent 60%)," +
          "linear-gradient(180deg, #0a0714 0%, #150e26 42%, #1b1030 68%, #0a0714 100%)",
      }}
    >
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 opacity-60"
        style={{
          background:
            "repeating-linear-gradient(180deg, rgba(156,147,176,0.06) 0px, rgba(156,147,176,0.06) 1px, transparent 1px, transparent 10px)",
          maskImage: "linear-gradient(180deg, transparent, black 30%)",
        }}
      />
    </div>
  );
}
