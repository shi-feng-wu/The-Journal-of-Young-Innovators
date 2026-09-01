"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MotionHighlight } from "../../components/ui/motion-highlight";

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

export function TableOfContents({
  sections,
  stickyPosition = "top-24",
  className = "",
}: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState<string>("");
  const activeSectionRef = useRef<string>("");
  const manualTargetRef = useRef<{ id: string; until: number } | null>(null);

  const setActive = useCallback((id: string) => {
    if (!id || id === activeSectionRef.current) return;
    activeSectionRef.current = id;
    setActiveSection(id);
  }, []);

  useEffect(() => {
    const sectionElements = sections
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sectionElements.length === 0) return;

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

    let frame: number | null = null;

    const update = () => {
      frame = null;
      const manual = manualTargetRef.current;
      if (manual && Date.now() <= manual.until) {
        setActive(manual.id);
        return;
      }
      setActive(getBestSection());
    };

    const schedule = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [sections, setActive]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    manualTargetRef.current = { id, until: Date.now() + 1800 };
    setActive(id);
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className={`sticky ${stickyPosition} max-h-[calc(100vh-8rem)] overflow-y-auto hide-scrollbar text-right ${className}`}
    >
      <nav aria-label="Table of contents" className="flex flex-col items-end">
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
                  : "text-black/60 delay-0"
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
