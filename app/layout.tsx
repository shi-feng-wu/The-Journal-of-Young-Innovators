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
  title: "The Journal of Young Innovators",
  description:
    "A global community of young scholars exploring the impacts of artificial intelligence and innovation across disciplines. Leadership. Innovation. AI.",
  verification: {
    google: "xet0nZILNVZJv0OOTKDsnME0Xfo8WAJJu2eYOjkG6U",
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
