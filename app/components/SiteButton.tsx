"use client";

import { Button, ButtonProps } from "@heroui/react";
import Link from "next/link";

export type SiteButtonVariant = "default" | "whiteHover";

export type SiteButtonProps = ButtonProps & {
  variantStyle?: SiteButtonVariant;
  href?: string;
};

export default function SiteButton({
  className = "",
  variantStyle = "default",
  href,
  ...props
}: SiteButtonProps) {
  const baseClasses =
    "h-12 sm:h-14 px-5 sm:px-8 whitespace-nowrap rounded-lg border-2 font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] sm:tracking-[0.2em] transition-colors duration-200";

  const hoverClasses =
    variantStyle === "whiteHover"
      ? "hover:!bg-white hover:!text-primary data-[hover=true]:!bg-white data-[hover=true]:!text-primary"
      : "hover:!bg-primary hover:!text-white data-[hover=true]:!bg-primary data-[hover=true]:!text-white";

  // A destination makes this a real link; external schemes (mailto:) use a
  // plain anchor, internal paths use next/link.
  const linkProps = href
    ? href.startsWith("/")
      ? { as: Link, href }
      : { as: "a" as const, href }
    : {};

  return (
    <Button
      {...linkProps}
      {...props}
      className={["group", baseClasses, hoverClasses, className]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
