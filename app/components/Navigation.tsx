"use client";

import Link from "next/link";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Image,
} from "@heroui/react";
import { useState } from "react";
import { useLenis } from "lenis/react";

// Desktop Navigation Link Component
const NavLink = ({
  href,
  children,
  isScrolled,
}: {
  href: string;
  children: React.ReactNode;
  isScrolled: boolean;
}) => (
  <Link
    href={href}
    className={`text-sm ${
      isScrolled
        ? "text-primary hover:text-default-600"
        : "text-white hover:text-white/80"
    }`}
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
    className="block px-3 py-2 text-primary hover:text-default-500"
    onClick={onClick}
  >
    {children}
  </Link>
);

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useLenis(({ scroll }) => {
    setIsScrolled(scroll > 25);
  });

  return (
    <nav
      className={`font-semibold fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow] duration-200 ease-in ${
        isScrolled ? "bg-background shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex items-center h-16 space-x-8">
          <div className="flex items-center ">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Logo"
                className={`h-10 mr-3 ${
                  !isScrolled ? "filter brightness-0 invert" : ""
                }`}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/about" isScrolled={isScrolled}>
              About
            </NavLink>
            <NavLink href="/submission" isScrolled={isScrolled}>
              Submission
            </NavLink>
            <NavLink href="/faq" isScrolled={isScrolled}>
              FAQ
            </NavLink>
            <NavLink href="/editorial-team" isScrolled={isScrolled}>
              Editorial Team
            </NavLink>
            <NavLink href="/scholarly-event" isScrolled={isScrolled}>
              Scholarly Event
            </NavLink>
            <NavLink href="/partners" isScrolled={isScrolled}>
              Strategic Partners
            </NavLink>
            <NavLink href="/donate" isScrolled={isScrolled}>
              Donate
            </NavLink>
            <NavLink href="/contact" isScrolled={isScrolled}>
              Contact
            </NavLink>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`focus:outline-none hover:text-primary ${
                isScrolled ? "text-primary" : "text-white"
              }`}
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
        {isMenuOpen && (
          <div className="md:hidden">
            <div
              className={`px-2 pt-2 pb-3 space-y-1 border-t ${
                isScrolled
                  ? "bg-background border-divider"
                  : "bg-background/95 backdrop-blur-sm border-divider/20"
              }`}
            >
              <MobileNavLink href="/about" onClick={() => setIsMenuOpen(false)}>
                About
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
              <MobileNavLink
                href="/donate"
                onClick={() => setIsMenuOpen(false)}
              >
                Donate
              </MobileNavLink>
              <MobileNavLink
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </MobileNavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
