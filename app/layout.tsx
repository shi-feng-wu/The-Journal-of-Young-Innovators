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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-grow pt-16">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
