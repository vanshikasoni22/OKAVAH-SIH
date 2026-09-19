import { Big_Shoulders, Inter } from "next/font/google";
import "./globals.css";

const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Charter-IQ — AI Freight Forecasting for SAIL",
  description:
    "Charter-IQ predicts freight rates, tells you when to book vs. wait, matches the right vessel to the right port, and shows the reasoning behind every call.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${bigShoulders.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg font-sans text-text">
        {children}
      </body>
    </html>
  );
}
