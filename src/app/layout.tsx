import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070A12",
};

export const metadata: Metadata = {
  title: {
    template: "%s | EdSecure Hub - Cybercrime Response & Security Platform",
    default: "EdSecure Hub — Cybercrime Assistance, Fraud Reporting & Safety Platform",
  },
  description:
    "Production-grade cybersecurity platform providing structured cyber fraud reporting, incident tracking, cyber-cell authority workflows, and community safety intelligence.",
  keywords: [
    "cybercrime reporting",
    "cyber fraud assistance",
    "phishing prevention",
    "cyber cell complaint tracking",
    "online safety",
    "identity theft",
    "financial fraud recovery",
  ],
  authors: [{ name: "EdSecure Platform Directorate" }],
  openGraph: {
    title: "EdSecure Hub — Enterprise Cybersecurity & Cybercrime Response Platform",
    description: "Prevent. Detect. Report. Recover. Multi-tier cybersecurity assistance for citizens and cyber-cell authorities.",
    type: "website",
    locale: "en_US",
    siteName: "EdSecure Hub",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
