import {
  confirmFeeCheckout,
  stripeCheckoutEnabled,
} from "@/lib/portal/payments";

export const runtime = "nodejs";

// Called by the form when the embedded checkout reports completion. Stripe is
// asked directly, so a forged request can only record a real, paid session.
export async function POST(request: Request) {
  if (!stripeCheckoutEnabled()) {
    return Response.json(
      { error: "Payments are not configured." },
      { status: 503 },
    );
  }
  const body = (await request.json().catch(() => ({}))) as {
    sessionId?: unknown;
  };
  const sessionId =
    typeof body.sessionId === "string" ? body.sessionId.trim() : "";
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
    return Response.json(
      { error: "Unknown checkout session." },
      { status: 400 },
    );
  }
  try {
    const { session } = await confirmFeeCheckout(sessionId);
    return Response.json({ paid: session.payment_status === "paid" });
  } catch (error) {
    console.error("[checkout] could not confirm session", error);
    return Response.json(
      { error: "Could not confirm the payment." },
      { status: 502 },
    );
  }
}
