"use client";

import { useState } from "react";
import { BUTTON } from "./ui";

export default function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={BUTTON.quiet}
      onClick={async () => {
        await navigator.clipboard.writeText(text).catch(() => null);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}
