"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";

const DesktopNavHighlight = dynamic(() => import("./DesktopNavHighlight"), {
  ssr: false,
  loading: () => <DesktopNavStatic />,
});

// Desktop Navigation Link Component
const NavLink = ({
  href,
  children,
  className,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
} & Omit<
  React.ComponentProps<typeof Link>,
  "href" | "children" | "className"
>) => (
  <Link
    href={href}
    className={`relative z-[1] inline-flex items-center whitespace-nowrap px-2 py-2 text-[13px] 2xl:px-3 2xl:text-sm text-white transition-colors rounded-md hover:text-white/90 hover:bg-white/10 ${className ?? ""}`}
    {...props}
  >
    {children}
  </Link>
);

// CSS-only fallback shown on mobile and during desktop hydration.
// Avoids importing framer-motion on mobile where the hover effect is moot.
function DesktopNavStatic() {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center w-full gap-2">
      <Link
        href="/"
        className="relative z-[1] -ml-[calc(0.5rem+1px)] inline-flex items-center rounded-md px-2 py-1"
      >
        <img
          src="/logolight.png"
          alt="The Journal of Young Innovators home"
          className="h-10 w-auto max-w-none shrink-0 transition-opacity"
          fetchPriority="low"
        />
      </Link>
      <div className="flex items-center justify-center gap-1 2xl:gap-2">
        <NavLink href="/about">About</NavLink>
        <NavLink href="/issues">Issues</NavLink>
        <NavLink href="/submission">Submission</NavLink>
        <NavLink href="/faq">FAQ</NavLink>
        <NavLink href="/editorial-team">Editorial Team</NavLink>
        <NavLink href="/scholarly-event">Scholarly Event</NavLink>
        <NavLink href="/partners">Strategic Partners</NavLink>
        <NavLink href="/donate">Donate</NavLink>
        <NavLink href="/contact">Contact</NavLink>
        <NavLink href="/policies">Policies</NavLink>
      </div>
      <div
        aria-hidden="true"
        className="-mr-[calc(0.5rem+1px)] inline-flex items-center rounded-md px-2 py-1 opacity-0 pointer-events-none"
      >
        <img
          src="/logolight.png"
          alt=""
          className="h-10 w-auto max-w-none shrink-0"
          fetchPriority="low"
        />
      </div>
    </div>
  );
}

// Mobile Navigation Link Component
const MobileNavLink = ({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <Link
    href={href}
    className="block px-3 py-3 text-white/90 hover:text-white text-sm uppercase tracking-[0.2em]"
    onClick={onClick}
  >
    {children}
  </Link>
);

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <nav
      aria-label="Primary"
      className="font-mono font-semibold bg-transparent relative z-50"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex items-center h-16 gap-4">
          <div className="flex items-center shrink-0 xl:hidden">
            <Link href="/" className="-ml-px flex items-center xl:hidden">
              <img
                src="/logolight.png"
                alt="The Journal of Young Innovators home"
                className="h-10 w-auto max-w-none shrink-0 transition-opacity"
                fetchPriority="low"
              />
            </Link>
          </div>

          {/* Desktop Navigation — MotionHighlight only loads on desktop */}
          <div className="hidden xl:flex items-center flex-1">
            {isDesktop ? <DesktopNavHighlight /> : <DesktopNavStatic />}
          </div>

          {/* Mobile menu button */}
          <div className="xl:hidden flex items-center ml-auto">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-11 w-11 items-center justify-center -mr-2 rounded-md text-white relative z-[70] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          id="mobile-menu"
          className={`fixed inset-x-0 top-16 bottom-0 xl:hidden bg-primary/95 backdrop-blur-sm border-t border-white/20 transition-all duration-300 ease-out ${
            isMenuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-20 py-4 h-full overflow-y-auto flex flex-col justify-center">
            <MobileNavLink href="/about" onClick={() => setIsMenuOpen(false)}>
              About
            </MobileNavLink>
            <MobileNavLink href="/issues" onClick={() => setIsMenuOpen(false)}>
              Issues
            </MobileNavLink>
            <MobileNavLink
              href="/submission"
              onClick={() => setIsMenuOpen(false)}
            >
              Submission
            </MobileNavLink>
            <MobileNavLink href="/faq" onClick={() => setIsMenuOpen(false)}>
              FAQ
            </MobileNavLink>
            <MobileNavLink
              href="/editorial-team"
              onClick={() => setIsMenuOpen(false)}
            >
              Editorial Team
            </MobileNavLink>
            <MobileNavLink
              href="/scholarly-event"
              onClick={() => setIsMenuOpen(false)}
            >
              Scholarly Event
            </MobileNavLink>
            <MobileNavLink
              href="/partners"
              onClick={() => setIsMenuOpen(false)}
            >
              Strategic Partners
            </MobileNavLink>
            <MobileNavLink href="/donate" onClick={() => setIsMenuOpen(false)}>
              Donate
            </MobileNavLink>
            <MobileNavLink href="/contact" onClick={() => setIsMenuOpen(false)}>
              Contact
            </MobileNavLink>
            <MobileNavLink
              href="/policies"
              onClick={() => setIsMenuOpen(false)}
            >
              Policies
            </MobileNavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
