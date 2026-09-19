export default function ShipLoader({ label = "Loading…", className = "" }) {
  return (
    <div role="status" aria-live="polite" className={`flex flex-col items-center gap-4 ${className}`}>
      <svg viewBox="0 0 120 64" className="h-14 w-32" aria-hidden="true">
        <path
          d="M0 44 Q 15 36 30 44 T 60 44 T 90 44 T 120 44"
          fill="none"
          stroke="var(--color-hairline)"
          strokeWidth="2"
        />
        <path
          className="ship-loader-wave"
          d="M0 44 Q 15 36 30 44 T 60 44 T 90 44 T 120 44"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <g className="ship-loader-hull">
          <path d="M42 40 L78 40 L70 50 L50 50 Z" fill="var(--color-accent)" />
          <rect x="56" y="30" width="8" height="10" rx="1" fill="var(--color-accent-soft)" />
          <line
            x1="60"
            y1="22"
            x2="60"
            y2="30"
            stroke="var(--color-accent-soft)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      </svg>
      <p className="text-sm font-medium tracking-wide text-text-muted">{label}</p>
    </div>
  );
}
