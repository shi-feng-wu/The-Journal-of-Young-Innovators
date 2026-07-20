"use client";

import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import SiteButton from "@/components/SiteButton";
import { FaChevronCircleRight } from "react-icons/fa";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export { stripePromise };

export default function PaymentStep({
  canPay,
  checkoutClientSecret,
  checkoutSessionId,
  paymentComplete,
  paymentError,
  onPay,
  onComplete,
}: {
  canPay: boolean;
  checkoutClientSecret: string | null;
  checkoutSessionId: string | null;
  paymentComplete: boolean;
  paymentError: string;
  onPay: () => void;
  onComplete: () => void;
}) {
  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg sm:text-xl font-semibold text-white font-display">
        Submission Fee
      </h3>

      {!paymentComplete && (
        <p className="text-white/70 text-sm font-serif">
          A one-time $55 submission fee applies. Have a waiver code? Enter it
          at checkout — need-based waivers are available at{" "}
          <a href="/waiver" className="text-white underline">
            /waiver
          </a>
          .
        </p>
      )}

      {!stripePromise && (
        <p className="text-white/80 text-sm font-mono">
          Payments are temporarily unavailable — email
          editor@young-innovator.org to submit.
        </p>
      )}

      {stripePromise && !paymentComplete && (
        <SiteButton
          color="primary"
          variant="ghost"
          size="lg"
          type="button"
          variantStyle="whiteHover"
          isDisabled={!canPay}
          onPress={onPay}
          className="w-[90vw] sm:w-120 justify-center border-white text-white"
          endContent={
            <FaChevronCircleRight className="ml-2 text-base text-current" />
          }
        >
          Pay $55
        </SiteButton>
      )}

      {paymentError && (
        <p className="text-red-200 text-sm font-mono">{paymentError}</p>
      )}

      {checkoutClientSecret && !paymentComplete && stripePromise && (
        <div className="w-full min-h-[480px] my-4 rounded-xl overflow-hidden bg-white">
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{
              clientSecret: checkoutClientSecret,
              onComplete,
            }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      )}

      {paymentComplete && (
        <div className="space-y-1">
          <p className="text-green-200 text-sm font-mono">
            Payment received ✓ · Reference {checkoutSessionId}
          </p>
          <p className="text-white/60 text-xs font-serif">
            Your submission is not complete until you click Submit
            Manuscript below.
          </p>
        </div>
      )}
    </div>
  );
}
