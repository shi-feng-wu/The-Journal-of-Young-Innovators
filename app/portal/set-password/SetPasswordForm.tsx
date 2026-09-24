"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BUTTON, INPUT_ON_NAVY, LABEL_ON_NAVY } from "../_components/ui";

export default function SetPasswordForm({ token, minLength }: { token: string; minLength: number }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    if (password !== form.get("confirm")) {
      setError("The two passwords do not match.");
      return;
    }
    setBusy(true);
    setError("");
    const response = await fetch("/api/portal/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    }).catch(() => null);
    if (response?.ok) {
      router.replace("/portal");
      router.refresh();
      return;
    }
    const payload = await response?.json().catch(() => null);
    setError(payload?.error ?? "Could not save the password. Try again.");
    setBusy(false);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block space-y-1.5">
        <span className={LABEL_ON_NAVY}>New password</span>
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={minLength}
          required
          className={INPUT_ON_NAVY}
        />
      </label>
      <label className="block space-y-1.5">
        <span className={LABEL_ON_NAVY}>Repeat password</span>
        <input
          name="confirm"
          type="password"
          autoComplete="new-password"
          minLength={minLength}
          required
          className={INPUT_ON_NAVY}
        />
      </label>
      {error && (
        <p role="alert" className="border-l-2 border-white/50 pl-3 font-text text-sm text-[#F4EFEB]">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} className={`${BUTTON.onNavy} w-full py-3`}>
        {busy ? "Saving..." : "Save and sign in"}
      </button>
    </form>
  );
}
