"use client";

import { useReportWebVitals } from "next/web-vitals";

const VITALS_ENDPOINT =
  process.env.NEXT_PUBLIC_VITALS_ENDPOINT ?? "/api/vitals";

export default function WebVitals() {
  useReportWebVitals((metric) => {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      navigationType: metric.navigationType,
      path:
        typeof window !== "undefined" ? window.location.pathname : undefined,
    });

    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log("[web-vitals]", metric.name, metric.value, metric.rating);
      return;
    }

    if (
      typeof navigator !== "undefined" &&
      typeof navigator.sendBeacon === "function"
    ) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(VITALS_ENDPOINT, blob);
    } else {
      fetch(VITALS_ENDPOINT, {
        body,
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
      }).catch(() => {});
    }
  });

  return null;
}
