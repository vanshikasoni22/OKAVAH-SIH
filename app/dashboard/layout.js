import { BookingQueryProvider } from "@/lib/BookingQueryContext";

export default function DashboardLayout({ children }) {
  return <BookingQueryProvider>{children}</BookingQueryProvider>;
}
