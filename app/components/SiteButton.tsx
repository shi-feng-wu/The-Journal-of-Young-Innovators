"use client";

import { Button, ButtonProps } from "@heroui/react";

export type SiteButtonProps = ButtonProps;

export default function SiteButton({
  className = "",
  ...props
}: SiteButtonProps) {
  return (
    <Button
      {...props}
      className={[
        "group transition-colors !font-serif",
        "hover:!bg-primary hover:!text-white",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
