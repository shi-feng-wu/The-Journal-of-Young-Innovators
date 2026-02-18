"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { MotionHighlight } from "../../components/ui/motion-highlight";

export interface ContentSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  id?: string;
  noPadding?: boolean;
  useContainer?: boolean; // when false, do not wrap with the internal max-width container
}

export interface TableOfContentsSection {
  id: string;
  title: string;
}

export interface TableOfContentsProps {
  sections: TableOfContentsSection[];
  title?: string;
  stickyPosition?: string;
  className?: string;
}

export function ContentSection({
  title,
  children,
  className = "",
  id,
  noPadding = false,
  useContainer = true,
}: ContentSectionProps) {
  const sectionId =
    id ||
    title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
      .replace(/-+/g, "-") // Replace multiple consecutive dashes with single dash
      .replace(/^-|-$/g, ""); // Remove leading/trailing dashes

  const content = (
    <>
      <h2 className="text-2xl md:text-4xl mb-6">{title}</h2>
      <div className="space-y-8 [&_p]:text-sm [&_p]:md:text-md [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:text-sm [&_ul]:md:text-md">
        {children}
      </div>
    </>
  );

  return (
    <section
      id={sectionId}
      className={`pb-10 ${noPadding ? "" : "pt-10"} ${className}`}
    >
      {content}
    </section>
  );
}

export function TableOfContents({
  sections,
  title = "Table of Contents",
  stickyPosition = "top-[30%]",
  className = "",
}: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState<string>("");
  const lenis = useLenis();
  const manualTargetRef = useRef<{ id: string; until: number } | null>(null);
  const clearManualTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const sectionElements = sections
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const getBestSection = () => {
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight * 0.35;
      let bestId = "";
      let bestScore = -Infinity;

      sectionElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const visibleTop = Math.max(rect.top, 0);
        const visibleBottom = Math.min(rect.bottom, viewportHeight);
        const visible = Math.max(0, visibleBottom - visibleTop);
        if (visible <= 0) return;

        const visibleRatio = visible / Math.min(rect.height, viewportHeight);
        const center = (rect.top + rect.bottom) / 2;
        const distance = Math.abs(center - viewportCenter);
        const score = visibleRatio - distance / viewportHeight;

        if (score > bestScore) {
          bestScore = score;
          bestId = el.id;
        }
      });

      return bestId;
    };

    const shouldHoldManualTarget = () => {
      const manual = manualTargetRef.current;
      if (!manual) return false;
      return Date.now() <= manual.until;
    };

    const updateActiveSection = () => {
      if (shouldHoldManualTarget()) {
        const manual = manualTargetRef.current;
        if (manual && manual.id !== activeSection) {
          setActiveSection(manual.id);
        }
        return;
      }

      const bestId = getBestSection();
      if (bestId && bestId !== activeSection) {
        setActiveSection(bestId);
      }
    };

    const observer = new IntersectionObserver(updateActiveSection, {
      rootMargin: "-15% 0px -55% 0px",
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    });

    sectionElements.forEach((element) => observer.observe(element));
    updateActiveSection();

    return () => {
      observer.disconnect();
      if (clearManualTimeoutRef.current) {
        window.clearTimeout(clearManualTimeoutRef.current);
      }
    };
  }, [sections, activeSection]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      manualTargetRef.current = {
        id,
        until: Date.now() + 1800,
      };
      if (clearManualTimeoutRef.current) {
        window.clearTimeout(clearManualTimeoutRef.current);
      }
      clearManualTimeoutRef.current = window.setTimeout(() => {
        manualTargetRef.current = null;
      }, 1800);
      setActiveSection(id);

      const viewportHeight = window.innerHeight;
      const offset = -viewportHeight * 0.2;
      if (lenis) lenis.scrollTo(element, { offset });
    }
  };

  return (
    <div
      className={`sticky ${stickyPosition} rounded-lg text-right ${className}`}
    >
      <nav className="flex flex-col items-end">
        <MotionHighlight
          mode="parent"
          value={activeSection || null}
          className="rounded-md bg-primary"
          containerClassName="flex flex-col items-end gap-2"
          itemsClassName="relative z-[1]"
          transition={{ type: "tween" }}
        >
          {sections.map(({ id, title }) => (
            <button
              key={id}
              data-value={id}
              onClick={() => scrollToSection(id)}
              className={`block w-full text-right px-3 py-2 rounded-md text-sm transition-colors duration-200 cursor-pointer hover:bg-primary hover:text-white ${
                activeSection === id
                  ? "text-white delay-40"
                  : "text-gray delay-0"
              }`}
            >
              {title}
            </button>
          ))}
        </MotionHighlight>
      </nav>
    </div>
  );
}
