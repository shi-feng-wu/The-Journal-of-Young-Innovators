"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

interface TitleLinkProps {
  href: string;
  label: string;
  className?: string;
  underlineThickness?: string;
  underlineLength?: string;
}

export default function TitleLink({
  href,
  label,
  className = "",
  underlineThickness,
  underlineLength,
}: TitleLinkProps) {
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const [lines, setLines] = useState<string[]>([]);
  const displayLabel = label.replace(/-/g, "‑");
  const isExternalHref = /^https?:\/\//i.test(href);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const computeLines = () => {
      const width = container.getBoundingClientRect().width;
      if (!width) return;

      const measurer = document.createElement("div");
      measurer.style.position = "absolute";
      measurer.style.visibility = "hidden";
      measurer.style.pointerEvents = "none";
      measurer.style.whiteSpace = "normal";
      measurer.style.width = `${width}px`;
      measurer.style.font = getComputedStyle(container).font;
      measurer.style.letterSpacing = getComputedStyle(container).letterSpacing;
      measurer.style.lineHeight = getComputedStyle(container).lineHeight;
      measurer.style.textTransform = getComputedStyle(container).textTransform;
      measurer.style.wordBreak = getComputedStyle(container).wordBreak;
      measurer.style.overflowWrap = getComputedStyle(container).overflowWrap;
      document.body.appendChild(measurer);

      const words = displayLabel.split(/\s+/).filter(Boolean);
      const lineWords: string[][] = [];
      let currentLine: string[] = [];
      let lastTop: number | null = null;

      words.forEach((word, idx) => {
        const span = document.createElement("span");
        span.textContent = `${word}${idx < words.length - 1 ? " " : ""}`;
        measurer.appendChild(span);
        const top = span.offsetTop;
        if (lastTop === null) {
          lastTop = top;
          currentLine.push(word);
          return;
        }
        if (top !== lastTop) {
          lineWords.push(currentLine);
          currentLine = [word];
          lastTop = top;
        } else {
          currentLine.push(word);
        }
      });

      if (currentLine.length) {
        lineWords.push(currentLine);
      }

      document.body.removeChild(measurer);
      setLines(lineWords.map((line) => line.join(" ")));
    };

    computeLines();

    const ro = new ResizeObserver(() => computeLines());
    ro.observe(container);

    return () => {
      ro.disconnect();
    };
  }, [label]);

  return (
    <Link
      href={href}
      target={isExternalHref ? "_blank" : undefined}
      rel={isExternalHref ? "noopener noreferrer" : undefined}
      className={`title-underline ${className}`}
      aria-label={label}
    >
      <span ref={containerRef} className="block">
        {lines.length
          ? lines.map((line, index) => (
              <span key={`${line}-${index}`} className="title-underline-line">
                <span
                  className="title-underline-text"
                  style={
                    {
                      ...(index > 0 ? { "--delay": `${index * 120}ms` } : {}),
                      ...(underlineThickness
                        ? { "--underline-thickness": underlineThickness }
                        : {}),
                      ...(underlineLength
                        ? { "--underline-length": underlineLength }
                        : {}),
                    } as React.CSSProperties
                  }
                >
                  {line}
                </span>
              </span>
            ))
          : displayLabel}
      </span>
    </Link>
  );
}
