"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BUTTON, INPUT_ON_NAVY } from "../_components/ui";

async function call(url: string, method: string, body: object) {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => null);
  const payload = await response?.json().catch(() => null);
  return { ok: !!response?.ok, payload };
}

const NAVY_LABEL = "block font-mono text-[10px] uppercase tracking-[0.22em] text-white/70";

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
            ? `Invite sent to ${form.get("email")}.`
            : "Account created, but the invite email failed. Use Resend invite on their row.",
        });
        router.refresh();
      }}
    >
      <label className="block space-y-1.5">
        <span className={NAVY_LABEL}>Name</span>
        <input name="name" required autoComplete="off" className={INPUT_ON_NAVY} />
      </label>
      <label className="block space-y-1.5">
        <span className={NAVY_LABEL}>Email</span>
        <input name="email" type="email" required autoComplete="off" className={INPUT_ON_NAVY} />
      </label>
      <label className="flex cursor-pointer items-center gap-2.5 pt-1 font-text text-[15px] text-white/85">
        <input name="isAdmin" type="checkbox" className="h-4 w-4 accent-white" />
        Make them an admin
      </label>
      {message && (
        <p role="status" className="border-l-2 border-white/60 pl-3 font-text text-sm text-white">
          {message.text}
        </p>
      )}
      <button type="submit" disabled={busy} className={`${BUTTON.onNavy} w-full`}>
        {busy ? "Sending…" : "Send invite"}
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
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null);

  const run = async (body: object, done: string) => {
    setBusy(true);
    setNote(null);
    const { ok, payload } = await call(`/api/portal/editors/${id}`, "PATCH", body);
    setBusy(false);
    setNote({ ok, text: ok ? done : (payload?.error ?? "That did not work.") });
    if (ok) router.refresh();
  };

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
      {!disabled && (
        <button type="button" disabled={busy} onClick={() => run({ sendInvite: true }, "Link sent.")} className={BUTTON.quiet}>
          {isSelf ? "Email me a reset link" : "Resend invite"}
        </button>
      )}
      {!isSelf && (
        <>
          <button type="button" disabled={busy} onClick={() => run({ isAdmin: !isAdmin }, "Saved.")} className={BUTTON.quiet}>
            {isAdmin ? "Remove admin" : "Make admin"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => run({ disabled: !disabled }, disabled ? "Access restored." : "Access removed.")}
            className={`${BUTTON.quiet} ${disabled ? "" : "!text-[#9b2c2c]"}`}
          >
            {disabled ? "Restore access" : "Remove access"}
          </button>
        </>
      )}
      {note && (
        <span role="status" className={`font-text text-sm ${note.ok ? "text-[#1d6b40]" : "text-[#7a1f1f]"}`}>
          {note.text}
        </span>
      )}
    </div>
  );
}
