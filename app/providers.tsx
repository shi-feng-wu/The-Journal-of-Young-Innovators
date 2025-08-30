"use client";

import { HeroUIProvider } from "@heroui/system";
import React, { useEffect, useState } from "react";
import { ReactLenis, useLenis } from "lenis/react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [prefersReducedMotion, setPRM] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPRM(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  return (
    <HeroUIProvider>
      {prefersReducedMotion ? (
        <>{children}</>
      ) : (
        <ReactLenis
          root
          options={{
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            syncTouch: false,
            touchMultiplier: 2,
          }}
        >
          <LenisBridge>{children}</LenisBridge>
        </ReactLenis>
      )}
    </HeroUIProvider>
  );
}

function LenisBridge({ children }: { children: React.ReactNode }) {
  // consume the hook so it's available where needed later
  useLenis(() => {});
  return <>{children}</>;
}
