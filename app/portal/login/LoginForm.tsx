"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BUTTON, INPUT_ON_NAVY, LABEL_ON_NAVY } from "../_components/ui";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    const response = await fetch("/api/portal/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
    }).catch(() => null);
    if (response?.ok) {
      router.replace("/portal");
      router.refresh();
      return;
    }
    const payload = await response?.json().catch(() => null);
    setError(payload?.error ?? "Could not sign in. Check your connection and try again.");
    setBusy(false);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block space-y-1.5">
        <span className={LABEL_ON_NAVY}>Email</span>
        <input name="email" type="email" autoComplete="username" required className={INPUT_ON_NAVY} />
      </label>
      <label className="block space-y-1.5">
        <span className={LABEL_ON_NAVY}>Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
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
        {busy ? "Signing in..." : "Sign in"}
      </button>
      <p className="text-center font-text text-xs text-white/60">
        Forgot your password? Ask a portal admin to send you a new link.
      </p>
    </form>
  );
}
