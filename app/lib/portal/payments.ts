import crypto from "node:crypto";
import {
  PUBLICATION_FEE_PAY_PATH,
  PUBLICATION_FEE_PAYMENT_LINK_ID,
} from "../fees";
import {
  all,
  get,
  getSubmission,
  getSubmissionByRef,
  logEvent,
  now,
  run,
  transaction,
  updateSubmission,
  type Payment,
  type Submission,
} from "./db";

export const SITE_URL = "https://young-innovator.org";

/**
 * The link an acceptance email carries. /pay redirects to the Stripe payment
 * link with the query string intact, so the checkout comes back tagged with
 * the submission reference.
 */
export function paymentUrlFor(submission: Pick<Submission, "ref" | "email">) {
  const params = new URLSearchParams({
    client_reference_id: submission.ref,
    prefilled_email: submission.email,
  });
  return `${SITE_URL}${PUBLICATION_FEE_PAY_PATH}?${params}`;
}

// ---- Webhook signatures --------------------------------------------------

const SIGNATURE_TOLERANCE_S = 300;

/** Checks a Stripe-Signature header against the raw request body. */
export function verifyStripeSignature(
  rawBody: string,
  header: string | null,
  secret: string,
): boolean {
  if (!header) return false;
  const parts = header.split(",").map((p) => p.split("="));
  const timestamp = parts.find(([k]) => k === "t")?.[1];
  const signatures = parts.filter(([k]) => k === "v1").map(([, v]) => v);
  if (!timestamp || signatures.length === 0) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > SIGNATURE_TOLERANCE_S) {
    return false;
  }
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest();
  return signatures.some((sig) => {
    const given = Buffer.from(sig, "hex");
    return (
      given.length === expected.length &&
      crypto.timingSafeEqual(given, expected)
    );
  });
}

// ---- Recording payments --------------------------------------------------

/** The subset of a Stripe Checkout Session the portal reads. */
export interface CheckoutSessionLike {
  id: string;
  payment_link?: string | null;
  payment_status?: string;
  client_reference_id?: string | null;
  amount_total?: number | null;
  currency?: string | null;
  created?: number;
  customer_details?: { email?: string | null; name?: string | null } | null;
  custom_fields?: Array<{
    key?: string;
    label?: { custom?: string | null } | null;
    text?: { value?: string | null } | null;
  }> | null;
  payment_intent?:
    | string
    | {
        id: string;
        latest_charge?: string | { refunded?: boolean; created?: number } | null;
      }
    | null;
}

export function isPublicationFeeSession(session: CheckoutSessionLike) {
  return session.payment_link === PUBLICATION_FEE_PAYMENT_LINK_ID;
}

function articleTitleField(session: CheckoutSessionLike): string | null {
  const field = session.custom_fields?.find((f) =>
    `${f.key ?? ""} ${f.label?.custom ?? ""}`.toLowerCase().includes("title"),
  );
  return field?.text?.value?.trim() || null;
}

/** Finds the submission a payment belongs to: by reference, then by email. */
function matchSubmission(
  reference: string | null,
  email: string | null,
): Submission | undefined {
  if (reference) {
    const byRef = getSubmissionByRef(reference.trim().toUpperCase());
    if (byRef) return byRef;
  }
  if (!email) return undefined;
  // Only an unambiguous email match counts: one submission with a fee due.
  const due = all<Submission>(
    `SELECT * FROM submissions
      WHERE email = :email COLLATE NOCASE AND payment_status = 'due'`,
    { email },
  );
  return due.length === 1 ? due[0] : undefined;
}

function formatAmount(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function applyPaymentToSubmission(
  payment: Payment,
  submissionId: number,
  editorId: number | null,
  how: string,
) {
  const submission = getSubmission(submissionId);
  if (!submission) return;
  run("UPDATE payments SET submission_id = :submissionId WHERE id = :id", {
    submissionId,
    id: payment.id,
  });
  const amount = formatAmount(payment.amount, payment.currency);
  if (payment.status === "refunded") {
    updateSubmission(submissionId, { payment_status: "refunded" });
    logEvent(submissionId, editorId, "payment", `Refunded payment of ${amount} linked ${how}`, {
      paymentId: payment.id,
    });
    return;
  }
  const alreadyPaid = submission.payment_status === "paid";
  updateSubmission(submissionId, { payment_status: "paid" });
  logEvent(
    submissionId,
    editorId,
    "payment",
    alreadyPaid
      ? `Second payment of ${amount} received (${how}); check for a duplicate charge`
      : `Publication fee of ${amount} paid (${how})`,
    { paymentId: payment.id, stripeSessionId: payment.stripe_session_id },
  );
}

/**
 * Stores a completed publication-fee checkout and links it to a submission
 * when one matches. Safe to call repeatedly for the same session.
 */
export function recordCheckoutSession(session: CheckoutSessionLike) {
  if (!isPublicationFeeSession(session) || session.payment_status !== "paid") {
    return null;
  }
  return transaction(() => {
    const existing = get<Payment>(
      "SELECT * FROM payments WHERE stripe_session_id = :id",
      { id: session.id },
    );
    const intent = session.payment_intent;
    const intentId = typeof intent === "string" ? intent : (intent?.id ?? null);
    const charge =
      typeof intent === "object" && intent && typeof intent.latest_charge === "object"
        ? intent.latest_charge
        : null;

    if (existing) {
      if (charge?.refunded && existing.status !== "refunded") {
        markRefunded(existing.payment_intent_id ?? intentId);
      }
      return existing;
    }

    const email = session.customer_details?.email ?? null;
    const paidAt = new Date((session.created ?? Date.now() / 1000) * 1000).toISOString();
    const { lastInsertRowid } = run(
      `INSERT INTO payments
         (stripe_session_id, payment_intent_id, client_reference_id, email,
          payer_name, article_title, amount, currency, status, paid_at, created_at)
       VALUES
         (:sessionId, :intentId, :reference, :email, :payerName, :articleTitle,
          :amount, :currency, 'paid', :paidAt, :createdAt)`,
      {
        sessionId: session.id,
        intentId,
        reference: session.client_reference_id ?? null,
        email,
        payerName: session.customer_details?.name ?? null,
        articleTitle: articleTitleField(session),
        amount: session.amount_total ?? 0,
        currency: session.currency ?? "usd",
        paidAt,
        createdAt: now(),
      },
    );
    const payment = get<Payment>("SELECT * FROM payments WHERE id = :id", {
      id: Number(lastInsertRowid),
    })!;
    const match = matchSubmission(payment.client_reference_id, payment.email);
    if (match) {
      applyPaymentToSubmission(
        payment,
        match.id,
        null,
        payment.client_reference_id ? "matched by reference" : "matched by email",
      );
    }
    if (charge?.refunded) markRefunded(intentId);
    return payment;
  });
}

export function markRefunded(paymentIntentId: string | null) {
  if (!paymentIntentId) return;
  const payment = get<Payment>(
    "SELECT * FROM payments WHERE payment_intent_id = :id AND status = 'paid'",
    { id: paymentIntentId },
  );
  if (!payment) return;
  run(
    "UPDATE payments SET status = 'refunded', refunded_at = :now WHERE id = :id",
    { now: now(), id: payment.id },
  );
  if (payment.submission_id) {
    const stillPaid = get<{ n: number }>(
      `SELECT COUNT(*) AS n FROM payments
        WHERE submission_id = :submissionId AND status = 'paid'`,
      { submissionId: payment.submission_id },
    )!.n;
    if (!stillPaid) {
      updateSubmission(payment.submission_id, { payment_status: "refunded" });
    }
    logEvent(
      payment.submission_id,
      null,
      "payment",
      `Payment of ${formatAmount(payment.amount, payment.currency)} refunded in Stripe`,
      { paymentId: payment.id },
    );
  }
}

/** An editor links a payment that could not be matched automatically. */
export function assignPayment(
  paymentId: number,
  submissionId: number,
  editorId: number,
) {
  transaction(() => {
    const payment = get<Payment>("SELECT * FROM payments WHERE id = :id", {
      id: paymentId,
    });
    if (!payment) throw new Error("Payment not found");
    applyPaymentToSubmission(payment, submissionId, editorId, "linked by an editor");
  });
}

// ---- Pulling from the Stripe API -----------------------------------------

export const stripeSyncEnabled = () => !!process.env.STRIPE_RESTRICTED_KEY;

/**
 * Reads every completed checkout for the publication-fee link and records
 * any the webhook missed. Needs STRIPE_RESTRICTED_KEY with read access to
 * Checkout Sessions, PaymentIntents, and Charges.
 */
export async function syncFromStripe(): Promise<{ seen: number; added: number }> {
  const key = process.env.STRIPE_RESTRICTED_KEY;
  if (!key) throw new Error("STRIPE_RESTRICTED_KEY is not set.");
  const before = get<{ n: number }>("SELECT COUNT(*) AS n FROM payments")!.n;
  let seen = 0;
  let startingAfter: string | undefined;
  for (let page = 0; page < 20; page++) {
    const params = new URLSearchParams({
      payment_link: PUBLICATION_FEE_PAYMENT_LINK_ID,
      status: "complete",
      limit: "100",
    });
    params.append("expand[]", "data.payment_intent.latest_charge");
    if (startingAfter) params.set("starting_after", startingAfter);
    const response = await fetch(
      `https://api.stripe.com/v1/checkout/sessions?${params}`,
      { headers: { Authorization: `Bearer ${key}` }, cache: "no-store" },
    );
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(
        `Stripe returned ${response.status}: ${body?.error?.message ?? "unknown error"}`,
      );
    }
    const list = (await response.json()) as {
      data: CheckoutSessionLike[];
      has_more: boolean;
    };
    for (const session of list.data) {
      seen += 1;
      recordCheckoutSession(session);
    }
    if (!list.has_more || list.data.length === 0) break;
    startingAfter = list.data[list.data.length - 1].id;
  }
  const after = get<{ n: number }>("SELECT COUNT(*) AS n FROM payments")!.n;
  return { seen, added: after - before };
}
