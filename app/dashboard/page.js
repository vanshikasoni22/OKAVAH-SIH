import Link from "next/link";

export const metadata = {
  title: "Dashboard — Charter-IQ",
};

export default function DashboardPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-bg px-6 py-32 text-center">
      <span className="inline-flex items-center gap-2.5 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent-soft">
        Coming next
      </span>
      <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-text sm:text-5xl">
        The dashboard is being built.
      </h1>
      <p className="mt-4 max-w-lg text-base text-text-muted">
        Freight-rate forecasts, landed-cost comparisons, and port risk
        intelligence will live here next.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex items-center justify-center rounded-full border border-hairline px-6 py-3 text-sm font-semibold text-text transition-colors hover:border-accent/40 hover:text-accent-soft"
      >
        ← Back to homepage
      </Link>
    </main>
  );
}
