"use client";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import WaiverRequest from "./WaiverRequest";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

const LINK =
  "font-mono text-xs uppercase tracking-[0.16em] text-white underline underline-offset-4 hover:text-white/80 cursor-pointer";

/**
 * Takes the submission fee right after the manuscript is saved, in Stripe's
 * embedded checkout. If checkout cannot open, the author gets the payment
 * link that is also in their confirmation email.
 */
export default function FeeCheckout({
  submissionRef,
  email,
  fallbackUrl,
  onDone,
}: {
  submissionRef: string;
  email: string;
  fallbackUrl: string;
  onDone: () => void;
}) {
  const [checkout, setCheckout] = useState<{
    clientSecret: string;
    sessionId: string;
  } | null>(null);
  const [state, setState] = useState<
    "loading" | "open" | "paid" | "failed" | "waiver"
  >(stripePromise ? "loading" : "failed");

  useEffect(() => {
    if (!stripePromise) return;
    let cancelled = false;
    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ref: submissionRef, email }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => {
        if (cancelled) return;
        setCheckout(data);
        setState("open");
      })
      .catch(() => !cancelled && setState("failed"));
    return () => {
      cancelled = true;
    };
  }, [submissionRef, email]);

  const [asking, setAsking] = useState(false);

  const handleComplete = () => {
    setState("paid");
    if (!checkout) return;
    // Record the payment in the editor portal now; the webhook is the backup.
    fetch("/api/checkout/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: checkout.sessionId }),
    }).catch(() => {});
  };

  return (
    <section
      aria-labelledby="fee-heading"
      className="w-full max-w-4xl space-y-6"
    >
      <div className="space-y-3">
        <h3
          id="fee-heading"
          className="text-2xl font-normal text-white font-display"
        >
          {state === "paid"
            ? "Payment received"
            : state === "waiver"
              ? "Waiver requested"
              : "Submission Fee"}
        </h3>
        {state === "paid" && (
          <p className="max-w-2xl font-text text-white/85">
            Thank you. Your manuscript ({submissionRef}) now moves to editorial
            review.
          </p>
        )}
        {state !== "paid" && state !== "waiver" && (
          <>
            <p className="max-w-2xl font-text text-white/85">
              Your manuscript was received as {submissionRef}. Pay the one-time,
              non-refundable $65 USD submission fee below to send it to
              editorial review. A parent, guardian, or school may pay on your
              behalf.
            </p>
            <button
              type="button"
              onClick={() => setAsking((a) => !a)}
              aria-expanded={asking}
              className={LINK}
            >
              {asking
                ? "Back to payment"
                : "Can't pay the fee? Ask for a waiver"}
            </button>
          </>
        )}
      </div>

      {(asking || state === "waiver") && (
        <WaiverRequest
          submissionRef={submissionRef}
          email={email}
          onSent={() => setState("waiver")}
        />
      )}

      <div className={asking || state === "waiver" ? "hidden" : "space-y-6"}>
        {state === "loading" && (
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/70">
            Opening checkout...
          </p>
        )}

        {state === "open" && checkout && stripePromise && (
          <div className="min-h-[480px] w-full overflow-hidden rounded-xl bg-white">
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{
                clientSecret: checkout.clientSecret,
                onComplete: handleComplete,
              }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        )}

        {state === "failed" && (
          <div className="max-w-2xl space-y-3 border-l-2 border-white/50 pl-4">
            <p className="font-text text-sm text-white">
              Checkout could not open on this page. You can pay on our Stripe
              checkout page instead; the same link is in your confirmation
              email.
            </p>
            <a href={fallbackUrl} className={LINK}>
              Pay the submission fee
            </a>
          </div>
        )}
      </div>

      {(state === "paid" || state === "waiver") && (
        <button type="button" onClick={onDone} className={LINK}>
          Submit another manuscript
        </button>
      )}
    </section>
  );
}
