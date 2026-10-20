import crypto from "node:crypto";
import {
  FEE_CHECKOUT_PURPOSE,
  FEE_PAY_PATH,
  FEE_PAYMENT_LINK_IDS,
  SUBMISSION_FEE_PRODUCT_NAME,
} from "../fees";
import { SUBMISSION_FEE_CENTS } from "./constants";
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
 * The checkout link for a submission's fee. /pay redirects to the Stripe
 * payment link with the query string intact, so the checkout comes back
 * tagged with the submission reference.
 */
export function paymentUrlFor(submission: Pick<Submission, "ref" | "email">) {
  const params = new URLSearchParams();
  if (submission.ref) params.set("client_reference_id", submission.ref);
  if (submission.email) params.set("prefilled_email", submission.email);
  return `${SITE_URL}${FEE_PAY_PATH}?${params}`;
}

/** The page where an author asks for a fee waiver, filled in for them. */
export function waiverUrlFor(submission: Pick<Submission, "ref" | "email">) {
  const params = new URLSearchParams();
  if (submission.ref) params.set("ref", submission.ref);
  if (submission.email) params.set("email", submission.email);
  return `${SITE_URL}/waiver?${params}`;
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
  metadata?: Record<string, string> | null;
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

/** A fee paid in the form's embedded checkout or through a payment link. */
export function isFeeSession(session: CheckoutSessionLike) {
  if (session.metadata?.purpose === FEE_CHECKOUT_PURPOSE) return true;
  return !!session.payment_link && FEE_PAYMENT_LINK_IDS.includes(session.payment_link);
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
      : `Submission fee of ${amount} paid (${how})`,
    { paymentId: payment.id, stripeSessionId: payment.stripe_session_id },
  );
}

/**
 * Stores a completed fee checkout and links it to a submission
 * when one matches. Safe to call repeatedly for the same session.
 */
export function recordCheckoutSession(session: CheckoutSessionLike) {
  if (!isFeeSession(session) || session.payment_status !== "paid") {
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

// ---- The Stripe API --------------------------------------------------------

const stripeKey = () => process.env.STRIPE_SECRET_KEY;

export const stripeCheckoutEnabled = () => !!stripeKey();

export const stripeSyncEnabled = () =>
  !!(process.env.STRIPE_RESTRICTED_KEY || stripeKey());

async function stripeApi<T>(
  path: string,
  key: string,
  body?: URLSearchParams,
): Promise<T> {
  const response = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${key}`,
      ...(body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body,
    cache: "no-store",
  });
  const json = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      `Stripe returned ${response.status}: ${json?.error?.message ?? "unknown error"}`,
    );
  }
  return json as T;
}

/**
 * Opens an embedded Checkout Session for a submission's fee. The session is
 * tagged with the submission reference so the webhook can match it.
 */
export async function createFeeCheckout(
  submission: Pick<Submission, "ref" | "email" | "title">,
): Promise<{ id: string; client_secret: string }> {
  const key = stripeKey();
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set.");
  const params = new URLSearchParams({
    ui_mode: "embedded_page",
    mode: "payment",
    redirect_on_completion: "never",
    client_reference_id: submission.ref,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": String(SUBMISSION_FEE_CENTS),
    "line_items[0][price_data][product_data][name]": SUBMISSION_FEE_PRODUCT_NAME,
    "line_items[0][price_data][product_data][description]": submission.title.slice(0, 500),
    "metadata[purpose]": FEE_CHECKOUT_PURPOSE,
    "metadata[ref]": submission.ref,
    "payment_intent_data[description]": `${SUBMISSION_FEE_PRODUCT_NAME} ${submission.ref}`,
    "payment_intent_data[metadata][purpose]": FEE_CHECKOUT_PURPOSE,
    "payment_intent_data[metadata][ref]": submission.ref,
  });
  if (submission.email) params.set("customer_email", submission.email);
  return stripeApi("checkout/sessions", key, params);
}

/**
 * Reads one Checkout Session back from Stripe and records it. The form calls
 * this when the embedded checkout finishes, so the portal does not have to
 * wait for the webhook.
 */
export async function confirmFeeCheckout(sessionId: string) {
  const key = stripeKey();
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set.");
  const params = new URLSearchParams();
  params.append("expand[]", "payment_intent.latest_charge");
  const session = await stripeApi<CheckoutSessionLike>(
    `checkout/sessions/${encodeURIComponent(sessionId)}?${params}`,
    key,
  );
  return { session, payment: recordCheckoutSession(session) };
}

/**
 * Reads every completed checkout and records the fees the webhook missed.
 * Uses STRIPE_RESTRICTED_KEY (read access to Checkout Sessions,
 * PaymentIntents, and Charges) when set, otherwise the secret key.
 */
export async function syncFromStripe(): Promise<{ seen: number; added: number }> {
  const key = process.env.STRIPE_RESTRICTED_KEY || stripeKey();
  if (!key) throw new Error("STRIPE_RESTRICTED_KEY is not set.");
  const before = get<{ n: number }>("SELECT COUNT(*) AS n FROM payments")!.n;
  let seen = 0;
  let startingAfter: string | undefined;
  for (let page = 0; page < 20; page++) {
    const params = new URLSearchParams({ status: "complete", limit: "100" });
    params.append("expand[]", "data.payment_intent.latest_charge");
    if (startingAfter) params.set("starting_after", startingAfter);
    const list = await stripeApi<{ data: CheckoutSessionLike[]; has_more: boolean }>(
      `checkout/sessions?${params}`,
      key,
    );
    for (const session of list.data) {
      if (!isFeeSession(session)) continue;
      seen += 1;
      recordCheckoutSession(session);
    }
    if (!list.has_more || list.data.length === 0) break;
    startingAfter = list.data[list.data.length - 1].id;
  }
  const after = get<{ n: number }>("SELECT COUNT(*) AS n FROM payments")!.n;
  return { seen, added: after - before };
}
