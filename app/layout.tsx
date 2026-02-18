import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import { MuseoModerno } from "next/font/google";
import { DM_Serif_Display } from "next/font/google";
import { Source_Sans_3 } from "next/font/google";

import "./globals.css";
import { Providers } from "./providers.tsx";
import BackToTop from "./components/BackToTop";
import Footer from "./components/Footer";

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

const museoModerno = MuseoModerno({
  variable: "--font-museo-moderno",
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
    default: "JYI | The Journal of Young Innovators",
    template: "%s | JYI",
  },
  description:
    "JYI (The Journal of Young Innovators) is a global community of young scholars exploring artificial intelligence and innovation across disciplines. Leadership. Innovation. AI.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "JYI",
    "Journal of Young Innovators",
    "young innovators journal",
    "student research journal",
    "AI research students",
    "high school research journal",
    "college research journal",
  ],
  openGraph: {
    type: "website",
    url: "https://young-innovator.org",
    siteName: "JYI | The Journal of Young Innovators",
    title: "JYI | The Journal of Young Innovators",
    description:
      "A global community of young scholars exploring artificial intelligence and innovation across disciplines.",
    images: [
      {
        url: "/logolight.png",
        width: 1200,
        height: 630,
        alt: "JYI | The Journal of Young Innovators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JYI | The Journal of Young Innovators",
    description:
      "A global community of young scholars exploring artificial intelligence and innovation across disciplines.",
    images: ["/logolight.png"],
  },
  icons: {
    icon: [
      { url: "/logodark.ico", media: "(prefers-color-scheme: light)" },
      { url: "/logolight.ico", media: "(prefers-color-scheme: dark)" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/Kenao.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${dmSerifDisplay.variable} ${robotoMono.variable} ${sourceSans3.variable} antialiased`}
      >
        <Providers>
          <div className="min-h-screen flex flex-col relative">
            <main className="flex-grow">{children}</main>
            <BackToTop />
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
