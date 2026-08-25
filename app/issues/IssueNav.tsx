"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";

interface IssueNavItem {
  id: string;
  label: string;
  articleCount: number;
}

export default function IssueNav({ items }: { items: IssueNavItem[] }) {
  const lenis = useLenis();
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const jumpTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) {
      lenis.scrollTo(el, { offset: -72, duration: 1 });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      aria-label="Jump to issue"
      className="sticky top-0 z-30 border-b border-[#ccd5e3] bg-white/95 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-[1200px] items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
        <span className="mr-2 hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.35em] text-[#52627a] sm:inline">
          Issues
        </span>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => jumpTo(item.id)}
            aria-current={activeId === item.id ? "true" : undefined}
            className={`shrink-0 border px-3 py-1.5 font-mono text-xs tracking-[0.15em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              activeId === item.id
                ? "border-primary bg-primary text-white"
                : "border-[#ccd5e3] bg-white text-primary hover:border-primary"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
