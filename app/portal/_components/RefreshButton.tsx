"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function updatedLabel(iso: string, now: number) {
  const minutes = Math.floor((now - Date.parse(iso)) / 60_000);
  if (minutes < 1) return "Updated just now";
  if (minutes < 60) return `Updated ${minutes} min ago`;
  const date = new Date(iso);
  const sameDay = new Date(now).toDateString() === date.toDateString();
  return sameDay
    ? `Updated at ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
    : `Updated ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

/**
 * Header control: checks the editor inbox for author replies, reloads the
 * page, and shows when the inbox was last checked.
 */
export default function RefreshButton({ lastRun, compact = false }: { lastRun: string | null; compact?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [now, setNow] = useState<number | null>(null);

  // Tick so "3 min ago" stays true; starts after mount to match the server render.
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 30_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  const refresh = async () => {
    setBusy(true);
    setFailed(false);
    const response = await fetch("/api/portal/inbox/sync", { method: "POST" }).catch(() => null);
    // 400 means this server has no inbox connection; the page still reloads.
    if (!response || (!response.ok && response.status !== 400)) setFailed(true);
    router.refresh();
    setBusy(false);
  };

  return (
    <div className="flex items-center gap-3">
      {(lastRun || failed) && (
        <span
          role={failed ? "alert" : undefined}
          title={lastRun ? new Date(lastRun).toLocaleString("en-US") : undefined}
          className={`hidden font-normal sm:inline ${failed ? "text-white" : "text-white/60"}`}
        >
          {failed ? "Inbox check failed" : lastRun && now ? updatedLabel(lastRun, now) : ""}
        </span>
      )}
      <button
        type="button"
        onClick={refresh}
        disabled={busy}
        className={`inline-flex cursor-pointer items-center gap-2 rounded-md text-white/80 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-wait ${compact ? "px-1.5 py-1 text-[11px]" : "px-2.5 py-2 text-[13px]"}`}
      >
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
    </div>
  );
}
