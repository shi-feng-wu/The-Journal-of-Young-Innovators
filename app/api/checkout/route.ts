import { getSubmissionByRef } from "@/lib/portal/db";
import {
  createFeeCheckout,
  stripeCheckoutEnabled,
} from "@/lib/portal/payments";

export const runtime = "nodejs";

const UNAVAILABLE =
  "Online payment is unavailable right now. Use the payment link in your confirmation email.";

// Opens the embedded checkout for a submission the form just saved. The
// reference and email must match, so nobody can open checkouts for other
// people's submissions by guessing references.
export async function POST(request: Request) {
  if (!stripeCheckoutEnabled()) {
    return Response.json({ error: UNAVAILABLE }, { status: 503 });
  }
  const body = (await request.json().catch(() => ({}))) as {
    ref?: unknown;
    email?: unknown;
  };
  const ref = typeof body.ref === "string" ? body.ref.trim().toUpperCase() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const submission = ref ? getSubmissionByRef(ref) : undefined;
  if (!submission || submission.email.toLowerCase() !== email.toLowerCase()) {
    return Response.json({ error: "Submission not found." }, { status: 404 });
  }
  // An author who asked for a waiver may still choose to pay.
  if (!["due", "waiver_requested"].includes(submission.payment_status)) {
    return Response.json(
      { error: "The fee for this submission is already settled." },
      { status: 409 },
    );
  }

  try {
    const session = await createFeeCheckout(submission);
    return Response.json({
      clientSecret: session.client_secret,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("[checkout] could not create session", error);
    return Response.json({ error: UNAVAILABLE }, { status: 502 });
  }
}
