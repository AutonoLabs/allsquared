import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";

export const metadata: Metadata = {
  title: {
    default: "AllSquared — UK Construction Payment Recovery",
    template: "%s | AllSquared",
  },
  description:
    "Check if your payer served a valid pay less notice, and find out what you're owed.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DisclaimerBanner />
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-12">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
