import Link from "next/link";
import BookingForm from "@/components/dashboard/BookingForm";

export const metadata = {
  title: "New booking query — Charter-IQ",
};

export default function DashboardPage() {
  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-bg px-6 py-20">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 35% at 50% 28%, rgba(217,164,65,0.08), transparent 70%)",
        }}
      />

      <Link
        href="/"
        className="relative z-10 mb-10 font-display text-lg font-bold tracking-tight text-text"
      >
        Charter<span className="text-accent">·</span>IQ
      </Link>

      <div className="relative z-10 flex w-full flex-1 items-center justify-center">
        <BookingForm />
      </div>
    </main>
  );
}
