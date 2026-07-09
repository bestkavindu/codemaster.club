import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

const SITE_URL = "https://codemaster.club";
const DESCRIPTION =
  "A one-person studio shipping practical developer tools and SaaS products. Designed, built, and maintained end to end.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "codemaster.club",
    template: "%s · codemaster.club",
  },
  description: DESCRIPTION,
  applicationName: "codemaster.club",
  keywords: [
    "developer tools",
    "SaaS",
    "indie maker",
    "Laravel",
    "Livewire",
    "PostgreSQL",
    "database schema",
    "certification exam prep",
  ],
  authors: [{ name: "codemaster.club" }],
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "codemaster.club",
    title: "codemaster.club",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "codemaster.club",
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0A0C10",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body>{children}</body>
    </html>
  );
}
