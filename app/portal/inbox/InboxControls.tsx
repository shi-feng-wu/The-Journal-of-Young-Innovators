"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BUTTON, INPUT } from "../_components/ui";

async function post(url: string, body?: object) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  }).catch(() => null);
  const payload = await response?.json().catch(() => null);
  return { ok: !!response?.ok, payload };
}

export function CheckInboxButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setMessage("");
          const { ok, payload } = await post("/api/portal/inbox/sync");
          setBusy(false);
          if (!ok) setMessage(payload?.error ?? "The inbox check failed.");
          router.refresh();
        }}
        className={BUTTON.onNavy}
      >
        {busy ? "Checking…" : "Check the inbox now"}
      </button>
      {message && <p role="alert" className="font-text text-sm text-white">{message}</p>}
    </div>
  );
}

export function MailActions({ mailId }: { mailId: number }) {
  const router = useRouter();
  const [ref, setRef] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const act = async (body: object) => {
    setBusy(true);
    setError("");
    const { ok, payload } = await post(`/api/portal/inbox/${mailId}`, body);
    setBusy(false);
    if (ok) router.refresh();
    else setError(payload?.error ?? "That did not work.");
  };

  return (
    <div className="space-y-2">
      <form
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          act({ action: "link", ref });
        }}
      >
        <input
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="JYI-2026-0001"
          aria-label="Manuscript reference"
          className={`${INPUT} font-mono sm:max-w-56`}
          required
        />
        <button type="submit" disabled={busy} className={BUTTON.primary}>
          File under manuscript
        </button>
        <button type="button" disabled={busy} onClick={() => act({ action: "dismiss" })} className={BUTTON.quiet}>
          Not about a manuscript
        </button>
      </form>
      {error && <p role="alert" className="font-text text-sm text-[#7a1f1f]">{error}</p>}
    </div>
  );
}
