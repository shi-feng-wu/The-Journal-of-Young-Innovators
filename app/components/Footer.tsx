"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const hasSegment = (segment: string) => pathSegments.includes(segment);
  const isIssuesPage = hasSegment("issues");
  const [isIssuesPinned, setIsIssuesPinned] = useState(false);

  useEffect(() => {
    if (!isIssuesPage) {
      setIsIssuesPinned(false);
      return;
    }

    const handleIssuesPinChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ isPinned?: boolean }>;
      setIsIssuesPinned(Boolean(customEvent.detail?.isPinned));
    };

    setIsIssuesPinned(false);
    window.addEventListener("issues-first-row-pin", handleIssuesPinChange);

    return () => {
      window.removeEventListener("issues-first-row-pin", handleIssuesPinChange);
    };
  }, [isIssuesPage]);

  const isWhiteFooterPage =
    hasSegment("donate") || hasSegment("contact") || hasSegment("form");

  return (
    <footer
      className={`font-mono inset-x-0 bottom-4 px-4 sm:px-6 lg:px-20 text-center text-[0.5rem] transition-opacity duration-500 ease-out ${
        isIssuesPage ? "" : "hero-text"
      } ${isIssuesPage ? "fixed z-40" : "absolute"} ${
        isIssuesPage && !isIssuesPinned
          ? "opacity-0 pointer-events-none"
          : "opacity-100"
      } ${isWhiteFooterPage ? "text-white" : "text-primary"}`}
    >
      An online academic journal for high school and college students. A
      non-profit collaboration dedicated to youth educational advancement,
      published in Baltimore, Maryland, USA. ISSN (Online): 3070-8885
    </footer>
  );
}
