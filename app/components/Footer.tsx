"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/issues") return null;

  return (
    <footer className="font-mono hero-text absolute inset-x-0 bottom-4 px-4 sm:px-6 lg:px-20 text-center text-[0.5rem] text-white">
      An online academic journal for high school and college students. Published
      by Inception Education Consulting LLC - Baltimore, Maryland, USA.
    </footer>
  );
}
