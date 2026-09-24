"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BUTTON, INPUT } from "../_components/ui";

export function SyncButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState("");

  const sync = async () => {
    setBusy(true);
    setResult("");
    const response = await fetch("/api/portal/payments/sync", { method: "POST" }).catch(() => null);
    const payload = await response?.json().catch(() => null);
    setBusy(false);
    if (response?.ok) {
      setResult(
        payload.added
          ? `Found ${payload.added} new ${payload.added === 1 ? "payment" : "payments"}.`
          : `Checked ${payload.seen} Stripe checkouts. Nothing new.`,
      );
      router.refresh();
    } else {
      setResult(payload?.error ?? "Sync failed.");
    }
  };

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <button type="button" onClick={sync} disabled={busy} className={BUTTON.onNavy}>
        {busy ? "Checking Stripe..." : "Sync from Stripe"}
      </button>
      {result && <p role="status" className="font-text text-sm text-white/80">{result}</p>}
    </div>
  );
}

export function AssignPayment({ paymentId, suggestion }: { paymentId: number; suggestion?: string }) {
  const router = useRouter();
  const [ref, setRef] = useState(suggestion ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  return (
    <form
      className="flex flex-col gap-2 sm:flex-row sm:items-start"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        const response = await fetch(`/api/portal/payments/${paymentId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ref }),
        }).catch(() => null);
        setBusy(false);
        if (response?.ok) {
          router.refresh();
          return;
        }
        const payload = await response?.json().catch(() => null);
        setError(payload?.error ?? "Could not link the payment.");
      }}
    >
      <div className="flex-1">
        <input
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="JYI-2026-0001"
          aria-label="Submission reference"
          className={`${INPUT} font-mono`}
          required
        />
        {error && <p role="alert" className="mt-1 font-text text-xs text-[#7a1f1f]">{error}</p>}
      </div>
      <button type="submit" disabled={busy} className={BUTTON.primary}>
        {busy ? "Linking..." : "Link"}
      </button>
    </form>
  );
}
