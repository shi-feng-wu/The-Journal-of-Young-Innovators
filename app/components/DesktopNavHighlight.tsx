"use client";

import Link from "next/link";
import {
  MotionHighlight,
  MotionHighlightItem,
} from "../../components/ui/motion-highlight";

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

export default function DesktopNavHighlight() {
  return (
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
            alt="The Journal of Young Innovators home"
            className="h-10 transition-opacity"
            fetchPriority="low"
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
        <img
          src="/logolight.png"
          alt=""
          className="h-10"
          fetchPriority="low"
        />
      </div>
    </MotionHighlight>
  );
}
