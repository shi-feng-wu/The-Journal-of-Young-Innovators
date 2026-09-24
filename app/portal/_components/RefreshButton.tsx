"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BUTTON } from "./ui";

/** Checks the editor inbox for author replies, then reloads the page. */
export default function RefreshButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const refresh = async () => {
    setBusy(true);
    setError("");
    const response = await fetch("/api/portal/inbox/sync", { method: "POST" }).catch(() => null);
    // A server without the inbox connection still reloads the list.
    if (response && !response.ok && response.status !== 400) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error ?? "Could not check the inbox.");
    }
    router.refresh();
    setBusy(false);
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button type="button" onClick={refresh} disabled={busy} className={BUTTON.onNavy}>
        <svg
          viewBox="0 0 16 16"
          className={`h-3.5 w-3.5 ${busy ? "animate-spin" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden
        >
          <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 2.5v3h-3" />
        </svg>
        {busy ? "Refreshing" : "Refresh"}
      </button>
      {error && (
        <p role="alert" className="font-text text-sm text-white">
          {error}
        </p>
      )}
    </div>
  );
}
