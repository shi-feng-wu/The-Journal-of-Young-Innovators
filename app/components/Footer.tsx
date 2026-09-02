"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const hasSegment = (segment: string) => pathSegments.includes(segment);

  const isHome = pathname === "/";
  const isWhiteFooterPage =
    hasSegment("donate") || hasSegment("contact") || hasSegment("form");

  return (
    <footer
      className={`hero-text font-mono absolute inset-x-0 bottom-2 px-4 sm:px-6 lg:px-20 text-center text-[10px] leading-relaxed ${
        isWhiteFooterPage ? "text-white" : "text-primary"
      }`}
    >
      {isHome ? (
        <span className="hidden sm:inline">
          An online academic journal for high school and college students. A
          non-profit collaboration dedicated to youth educational advancement,
          published in Baltimore, Maryland, USA.{" "}
        </span>
      ) : (
        <span className="hidden sm:inline">Baltimore, Maryland, USA · </span>
      )}
      ISSN (Online): 3070-8885 · Contact: editor@young-innovator.org ·{" "}
      <Link
        href="/policies"
        className="inline-block px-1 py-1 hover:underline"
      >
        Policies
      </Link>
    </footer>
  );
}
