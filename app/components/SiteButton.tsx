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
        "group transition-colors",
        "hover:!bg-white hover:!text-primary",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
