"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BUTTON, INPUT, LABEL } from "../_components/ui";

async function call(url: string, method: string, body: object) {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => null);
  const payload = await response?.json().catch(() => null);
  return { ok: !!response?.ok, payload };
}

export function InviteForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const formEl = e.currentTarget;
        const form = new FormData(formEl);
        setBusy(true);
        setMessage(null);
        const { ok, payload } = await call("/api/portal/editors", "POST", {
          name: form.get("name"),
          email: form.get("email"),
          isAdmin: form.get("isAdmin") === "on",
        });
        setBusy(false);
        if (!ok) {
          setMessage({ ok: false, text: payload?.error ?? "Could not add the editor." });
          return;
        }
        formEl.reset();
        setMessage({
          ok: payload.emailed,
          text: payload.emailed
            ? "Invite sent. The link expires in 72 hours."
            : "Account created, but the invite email failed. Use Resend invite below.",
        });
        router.refresh();
      }}
    >
      <label className="block space-y-1">
        <span className={LABEL}>Name</span>
        <input name="name" required className={INPUT} />
      </label>
      <label className="block space-y-1">
        <span className={LABEL}>Email</span>
        <input name="email" type="email" required className={INPUT} />
      </label>
      <label className="flex items-center gap-2 font-text text-sm text-black/75">
        <input name="isAdmin" type="checkbox" className="accent-primary" />
        Admin (can add and remove editors)
      </label>
      {message && (
        <p role="status" className={`font-text text-sm ${message.ok ? "text-[#1d5e39]" : "text-[#7a1f1f]"}`}>
          {message.text}
        </p>
      )}
      <button type="submit" disabled={busy} className={`${BUTTON.primary} w-full`}>
        {busy ? "Sending..." : "Send invite"}
      </button>
    </form>
  );
}

export function EditorRowActions({
  id,
  disabled,
  isAdmin,
  isSelf,
}: {
  id: number;
  disabled: boolean;
  isAdmin: boolean;
  isSelf: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  const run = async (body: object, done: string) => {
    setBusy(true);
    setNote("");
    const { ok, payload } = await call(`/api/portal/editors/${id}`, "PATCH", body);
    setBusy(false);
    setNote(ok ? done : (payload?.error ?? "That did not work."));
    if (ok) router.refresh();
  };

  const small = "rounded-md px-2 py-1 font-mono text-[11px] uppercase tracking-[0.12em] cursor-pointer disabled:opacity-40";

  return (
    <div className="flex flex-wrap items-center gap-1">
      {!disabled && (
        <button type="button" disabled={busy} onClick={() => run({ sendInvite: true }, "Link sent.")} className={`${small} text-primary hover:bg-primary/10`}>
          {isSelf ? "Email me a reset link" : "Resend invite / reset"}
        </button>
      )}
      {!isSelf && (
        <>
          <button type="button" disabled={busy} onClick={() => run({ isAdmin: !isAdmin }, "Saved.")} className={`${small} text-primary hover:bg-primary/10`}>
            {isAdmin ? "Remove admin" : "Make admin"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => run({ disabled: !disabled }, disabled ? "Access restored." : "Access removed.")}
            className={`${small} ${disabled ? "text-primary hover:bg-primary/10" : "text-[#9b2c2c] hover:bg-[#9b2c2c]/10"}`}
          >
            {disabled ? "Restore access" : "Remove access"}
          </button>
        </>
      )}
      {note && <span role="status" className="font-text text-xs text-black/60">{note}</span>}
    </div>
  );
}
