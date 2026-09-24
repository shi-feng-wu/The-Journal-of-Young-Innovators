import {
  markRefunded,
  recordCheckoutSession,
  verifyStripeSignature,
  type CheckoutSessionLike,
} from "@/lib/portal/payments";

export const runtime = "nodejs";

// Stripe calls this for checkout.session.completed,
// checkout.session.async_payment_succeeded, and charge.refunded.
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return new Response("Webhook not configured", { status: 503 });

  const rawBody = await request.text();
  if (!verifyStripeSignature(rawBody, request.headers.get("stripe-signature"), secret)) {
    return new Response("Bad signature", { status: 400 });
  }

  const event = JSON.parse(rawBody) as {
    type: string;
    data: { object: Record<string, unknown> };
  };
  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        recordCheckoutSession(event.data.object as unknown as CheckoutSessionLike);
        break;
      case "charge.refunded": {
        const charge = event.data.object as { refunded?: boolean; payment_intent?: string };
        if (charge.refunded) markRefunded(charge.payment_intent ?? null);
        break;
      }
    }
  } catch (error) {
    console.error("[stripe webhook]", event.type, error);
    return new Response("Handler error", { status: 500 });
  }
  return Response.json({ received: true });
}
