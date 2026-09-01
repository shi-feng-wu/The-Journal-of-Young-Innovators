import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import { DM_Serif_Display } from "next/font/google";
import { Source_Sans_3 } from "next/font/google";

import "./globals.css";
import { Providers } from "./providers.tsx";
import BackToTop from "./components/BackToTop";
import Footer from "./components/Footer";
import WebVitals from "./components/WebVitals";

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif-display",
  subsets: ["latin"],
  weight: "400",
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans-3",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://young-innovator.org"),
  title: {
    default: "The Journal of Young Innovators",
    template: "%s | JYI",
  },
  description:
    "Peer-reviewed journal of high school and college student research across disciplines — business, science, humanities, healthcare, policy, and AI.",
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: "The Journal of Young Innovators" },
      ],
    },
  },
  openGraph: {
    type: "website",
    url: "https://young-innovator.org",
    siteName: "The Journal of Young Innovators",
    title: "The Journal of Young Innovators",
    description:
      "Peer-reviewed journal of high school and college student research across disciplines — business, science, humanities, healthcare, policy, and AI.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Journal of Young Innovators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Journal of Young Innovators",
    description:
      "Peer-reviewed journal of high school and college student research across disciplines — business, science, humanities, healthcare, policy, and AI.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/logodark.ico", media: "(prefers-color-scheme: light)" },
      { url: "/logolight.ico", media: "(prefers-color-scheme: dark)" },
    ],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? "",
    },
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "The Journal of Young Innovators",
  alternateName: "JYI",
  url: "https://young-innovator.org/",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Periodical",
  name: "The Journal of Young Innovators",
  alternateName: "JYI",
  issn: "3070-8885",
  url: "https://young-innovator.org",
  logo: "https://young-innovator.org/logodark.png",
  description:
    "A global community of young scholars exploring artificial intelligence and innovation across disciplines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body
        className={`${dmSerifDisplay.variable} ${robotoMono.variable} ${sourceSans3.variable} antialiased`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-primary"
        >
          Skip to content
        </a>
        <Providers>
          <WebVitals />
          <div className="min-h-screen flex flex-col relative">
            <main id="main" className="flex-grow">
              {children}
            </main>
            <BackToTop />
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
