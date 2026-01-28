import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MuseoModerno } from "next/font/google";

import "./globals.css";
import { Providers } from "./providers.tsx";
import Navigation from "./components/Navigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const museoModerno = MuseoModerno({
  variable: "--font-museo-moderno",
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
      { url: "/logodark.png", media: "(prefers-color-scheme: light)" },
      { url: "/logolight.png", media: "(prefers-color-scheme: dark)" },
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
      <body className={` antialiased`}>
        <Providers>
          <div className="min-h-screen flex flex-col relative">
            <Navigation />
            <main className="flex-grow pt-16">{children}</main>
            <footer className="absolute inset-x-0 bottom-4 px-4 sm:px-6 lg:px-20 text-center text-[0.5rem] text-white mix-blend-difference">
              Published by Inception Education Consulting LLC - Baltimore,
              Maryland, USA
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
