import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://codemaster.club"),
  title: "codemaster.club — Web tools & SaaS studio",
  description:
    "codemaster.club is a product studio shipping fast, well-engineered web tools and SaaS platforms developers love.",
  robots: { index: true, follow: true, "max-image-preview": "large" } as Metadata["robots"],
  alternates: { canonical: "https://codemaster.club/" },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    siteName: "codemaster.club",
    title: "codemaster.club — Web tools & SaaS studio",
    description:
      "A product studio shipping fast, well-engineered web tools and SaaS platforms developers love.",
    url: "https://codemaster.club/",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "codemaster.club — Web tools & SaaS studio",
    description:
      "A product studio shipping fast, well-engineered web tools and SaaS platforms developers love.",
  },
};

export const viewport: Viewport = {
  themeColor: "#05060a",
  width: "device-width",
  initialScale: 1,
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
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Asap+Condensed:wght@500;600;700&family=Geist:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
