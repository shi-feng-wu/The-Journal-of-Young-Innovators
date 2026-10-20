"use client";

import { useState } from "react";

const LINK =
  "font-mono text-xs uppercase tracking-[0.16em] text-white underline underline-offset-4 hover:text-white/80 cursor-pointer";

/**
 * Lets an author ask for the submission fee to be waived. Editors answer
 * from the portal; until then the manuscript waits for review.
 */
export default function WaiverRequest({
  submissionRef,
  email,
  onSent,
}: {
  submissionRef: string;
  email: string;
  onSent?: () => void;
}) {
  const [reason, setReason] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    setState("sending");
    setError("");
    const response = await fetch("/api/waiver", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ref: submissionRef, email, reason }),
    }).catch(() => null);
    const payload = await response?.json().catch(() => null);
    if (response?.ok) {
      setState("sent");
      onSent?.();
      return;
    }
    setError(
      payload?.error ?? "Could not send your request. Please try again.",
    );
    setState("idle");
  };

  if (state === "sent") {
    return (
      <p
        role="status"
        className="max-w-2xl border-l-2 border-white/50 pl-4 font-text text-white"
      >
        Your request was sent. An editor will reply by email, usually within a
        few days, and your manuscript stays on file until then.
      </p>
    );
  }

  return (
    <form onSubmit={send} className="max-w-2xl space-y-4">
      <label className="block space-y-2">
        <span className="font-mono text-xs uppercase tracking-[0.16em] text-white/80">
          Why are you asking for a waiver?
        </span>
        <textarea
          required
          rows={5}
          maxLength={2000}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full rounded-xl bg-[#F8F5F1] p-3 font-text text-base text-black sm:text-sm"
        />
      </label>
      {error && (
        <p
          role="alert"
          className="border-l-2 border-white/50 pl-4 font-text text-sm text-[#F8F5F1]"
        >
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={state === "sending" || !reason.trim()}
        className={`${LINK} disabled:cursor-default disabled:opacity-50`}
      >
        {state === "sending" ? "Sending..." : "Send waiver request"}
      </button>
    </form>
  );
}
