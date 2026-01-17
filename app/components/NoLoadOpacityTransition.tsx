"use client";

import { useEffect, useState } from "react";

export function NoLoadOpacityTransition({
  imageUrl,
  className = "",
}: {
  imageUrl: string;
  className?: string;
}) {
  const [enableTransition, setEnableTransition] = useState(false);

  useEffect(() => {
    setEnableTransition(true);
  }, []);

  return (
    <div
      className={[
        "absolute inset-0 bg-center bg-cover opacity-60 group-hover:opacity-80",
        enableTransition ? "transition-opacity" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ backgroundImage: `url(${imageUrl})` }}
      aria-hidden="true"
    />
  );
}
