"use client";

import { Button, ButtonProps } from "@heroui/react";

export type SiteButtonVariant = "default" | "whiteHover";

export type SiteButtonProps = ButtonProps & {
  variantStyle?: SiteButtonVariant;
};

export default function SiteButton({
  className = "",
  variantStyle = "default",
  ...props
}: SiteButtonProps) {
  const hoverClasses =
    variantStyle === "whiteHover"
      ? "hover:!bg-white hover:!text-primary"
      : "hover:!bg-primary hover:!text-white";

  return (
    <Button
      {...props}
      className={[
        "group transition-colors !font-serif",
        hoverClasses,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
