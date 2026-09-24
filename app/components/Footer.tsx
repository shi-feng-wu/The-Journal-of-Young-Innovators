"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const hasSegment = (segment: string) => pathSegments.includes(segment);

  const isHome = pathname === "/";
  const isWhiteFooterPage =
    hasSegment("donate") ||
    hasSegment("contact") ||
    hasSegment("form") ||
    hasSegment("portal");

  return (
    <footer
      className={`hero-text font-mono absolute inset-x-0 bottom-2 px-4 sm:px-6 lg:px-20 text-center text-[11px] leading-relaxed ${
        isWhiteFooterPage ? "text-white" : "text-primary"
      }`}
    >
      {isHome ? (
        <span className="hidden sm:inline">
          An online academic journal for high school and college students, run
          as a non-profit collaboration and published in Baltimore, Maryland,
          USA.{" "}
        </span>
      ) : (
        <span className="hidden sm:inline">Baltimore, Maryland, USA · </span>
      )}
      {/* Each item stays on one line so the email never splits at its hyphen. */}
      <span className="whitespace-nowrap">ISSN (Online): 3070-8885 ·</span>{" "}
      <span className="whitespace-nowrap">
        Contact:{" "}
        <a
          href="mailto:editor@young-innovator.org"
          className="inline-block py-1 hover:underline"
        >
          editor@young-innovator.org
        </a>{" "}
        ·
      </span>{" "}
      <Link
        href="/policies"
        className="inline-block px-1 py-1 hover:underline"
      >
        Policies
      </Link>
    </footer>
  );
}
