"use client";

import NumberFlow from "@number-flow/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface PipelineStage {
  key: string;
  label: string;
  count: number;
  href: string;
  active: boolean;
}

/**
 * The dashboard's masthead: every stage of the editorial pipeline in order,
 * with its count. The numbers count up once on load; that is the page's only
 * unprompted motion.
 */
export default function Pipeline({ stages }: { stages: PipelineStage[] }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <nav aria-label="Pipeline" className="mt-8 lg:mt-10">
      <ol className="grid grid-cols-5">
        {stages.map((stage) => (
          <li key={stage.key} className="relative">
            {/* The connecting rule reads left to right, like the process it is. */}
            <span
              aria-hidden
              className={`absolute top-0 left-0 h-px w-full ${
                stage.active ? "bg-white" : "bg-white/30"
              }`}
            />
            <span
              aria-hidden
              className={`absolute -top-[3px] left-0 h-[7px] w-[7px] rounded-full ${
                stage.active ? "bg-white" : "bg-primary ring-1 ring-white/50"
              }`}
            />
            <Link
              href={stage.href}
              aria-current={stage.active ? "page" : undefined}
              className="group block pt-4 pr-2 sm:pr-4"
            >
              <span className="block font-display text-[34px] leading-none tabular-nums [--number-flow-mask-height:0.1em] sm:text-[56px] lg:text-[76px]">
                <NumberFlow value={shown ? stage.count : 0} />
              </span>
              <span
                className={`mt-1 inline-block font-mono text-[9px] uppercase tracking-[0.1em] underline-offset-[6px] transition-colors sm:text-[11px] sm:tracking-[0.2em] lg:text-xs ${
                  stage.active ? "text-white underline decoration-2" : "text-white/70 group-hover:text-white group-hover:underline"
                }`}
              >
                {stage.label}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
