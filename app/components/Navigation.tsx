"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  MotionHighlight,
  MotionHighlightItem,
} from "../../components/ui/motion-highlight";

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
    className={`relative z-[1] inline-flex items-center px-3 py-2 text-sm text-white transition-colors rounded-md hover:text-white/90 ${className ?? ""}`}
    {...props}
  >
    {children}
  </Link>
);

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

export default function Navigation({ delay = true }: { delay?: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <nav className="font-mono font-semibold bg-transparent relative z-50">
      <div
        className={`max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-20 ${
          delay ? "delayed-text" : ""
        }`}
      >
        <div className="flex items-center h-16 gap-4">
          <div className="flex items-center shrink-0 lg:hidden">
            <Link href="/" className="flex items-center lg:hidden">
              <img
                src="/logolight.png"
                alt="Logo"
                className="h-10 transition-opacity"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center flex-1">
            <MotionHighlight
              mode="parent"
              controlledItems
              hover
              className="pointer-events-none rounded-md bg-white/10"
              containerClassName="grid grid-cols-[auto_1fr_auto] items-center w-full gap-2"
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            >
              <MotionHighlightItem asChild>
                <Link
                  href="/"
                  className="relative z-[1] inline-flex items-center rounded-md px-2 py-1"
                >
                  <img
                    src="/logolight.png"
                    alt="Logo"
                    className="h-10 transition-opacity"
                  />
                </Link>
              </MotionHighlightItem>

              <div className="flex items-center justify-center gap-2">
                <MotionHighlightItem asChild>
                  <NavLink href="/about">About</NavLink>
                </MotionHighlightItem>
                <MotionHighlightItem asChild>
                  <NavLink href="/issues">Issues</NavLink>
                </MotionHighlightItem>
                <MotionHighlightItem asChild>
                  <NavLink href="/submission">Submission</NavLink>
                </MotionHighlightItem>
                <MotionHighlightItem asChild>
                  <NavLink href="/faq">FAQ</NavLink>
                </MotionHighlightItem>
                <MotionHighlightItem asChild>
                  <NavLink href="/editorial-team">Editorial Team</NavLink>
                </MotionHighlightItem>
                <MotionHighlightItem asChild>
                  <NavLink href="/scholarly-event">Scholarly Event</NavLink>
                </MotionHighlightItem>
                <MotionHighlightItem asChild>
                  <NavLink href="/partners">Strategic Partners</NavLink>
                </MotionHighlightItem>
                <MotionHighlightItem asChild>
                  <NavLink href="/donate">Donate</NavLink>
                </MotionHighlightItem>
                <MotionHighlightItem asChild>
                  <NavLink href="/contact">Contact</NavLink>
                </MotionHighlightItem>
              </div>

              <div
                aria-hidden="true"
                className="inline-flex items-center rounded-md px-2 py-1 opacity-0 pointer-events-none"
              >
                <img src="/logolight.png" alt="" className="h-10" />
              </div>
            </MotionHighlight>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center ml-auto">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="focus:outline-none text-white relative z-[70]"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
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
          className={`fixed inset-x-0 top-16 bottom-0 lg:hidden bg-primary/95 backdrop-blur-sm border-t border-white/20 transition-all duration-300 ease-out ${
            isMenuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-20 py-4 h-full overflow-y-auto flex flex-col justify-center">
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
          </div>
        </div>
      </div>
    </nav>
  );
}
