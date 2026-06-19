import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gorgias CX — AI Adoption Dashboard",
  description: "24h AI adoption performance dashboard for Gorgias CX org",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
