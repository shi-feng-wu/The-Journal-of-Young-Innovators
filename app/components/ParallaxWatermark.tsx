"use client";

import { useEffect, useState } from "react";

export default function ParallaxWatermark({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      setOffset(y * 0.4);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={className}
      style={{ transform: `translate3d(0, ${offset}px, 0)` }}
      aria-hidden="true"
    >
      {text}
    </div>
  );
}
