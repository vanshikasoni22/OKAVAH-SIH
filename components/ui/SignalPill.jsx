export default function SignalPill({
  className = "",
  children = "Market signal — WAIT · 12 days",
}) {
  return (
    <div
      className={`inline-flex items-center gap-2.5 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium tracking-wide text-accent-soft backdrop-blur-sm ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
      </span>
      {children}
    </div>
  );
}
