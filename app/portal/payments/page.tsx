import Link from "next/link";
import { requirePageEditor } from "@/lib/portal/auth";
import { all, type Payment, type Submission } from "@/lib/portal/db";
import { stripeSyncEnabled } from "@/lib/portal/payments";
import PortalShell from "../_components/PortalShell";
import { LABEL, PANEL, PageTitle, formatDate, formatMoney } from "../_components/ui";
import { AssignPayment, SyncButton } from "./PaymentControls";

export const metadata = { title: "Payments" };

type Row = Payment & { ref: string | null; title: string | null };

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const editor = await requirePageEditor();
  const unmatchedOnly = (await searchParams).filter === "unmatched";
  const payments = all<Row>(
    `SELECT payments.*, submissions.ref, submissions.title
       FROM payments LEFT JOIN submissions ON submissions.id = payments.submission_id
      ${unmatchedOnly ? "WHERE payments.submission_id IS NULL" : ""}
      ORDER BY payments.paid_at DESC`,
  );
  const due = all<Submission>(
    "SELECT * FROM submissions WHERE payment_status = 'due' ORDER BY updated_at",
  );
  const collected = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const webhookReady = !!process.env.STRIPE_WEBHOOK_SECRET;

  return (
    <PortalShell editor={editor}>
      <PageTitle title="Payments" eyebrow="Publication fees">
        {stripeSyncEnabled() && <SyncButton />}
      </PageTitle>

      {!webhookReady && (
        <p className="mt-6 rounded-lg border-2 border-[#f2c14e] px-4 py-3 font-text text-sm">
          Stripe is not connected on this server yet (STRIPE_WEBHOOK_SECRET is missing), so card
          payments will not appear here automatically. Fee status can still be set by hand on each
          submission.
        </p>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className={`${PANEL} min-w-0 overflow-hidden`} aria-labelledby="received-heading">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
            <h2 id="received-heading" className="font-display text-2xl font-normal">
              {unmatchedOnly ? "Unmatched payments" : "Received"}
            </h2>
            <div className="flex items-center gap-4 font-mono text-xs">
              {!unmatchedOnly && <span className="text-black/60">{formatMoney(collected)} collected</span>}
              <Link
                href={unmatchedOnly ? "/portal/payments" : "/portal/payments?filter=unmatched"}
                className="text-primary underline underline-offset-2"
              >
                {unmatchedOnly ? "Show all" : "Unmatched only"}
              </Link>
            </div>
          </div>
          {payments.length === 0 ? (
            <p className="px-5 py-10 text-center font-text text-sm text-black/55">
              {unmatchedOnly ? "Every payment is linked to a submission." : "No payments recorded yet."}
            </p>
          ) : (
            <ul className="divide-y divide-black/10">
              {payments.map((p) => (
                <li key={p.id} className={`px-5 py-4 ${p.submission_id ? "" : "bg-[#f2c14e]/15"}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <p className="font-text text-[15px]">
                      <span className="font-semibold">{formatMoney(p.amount, p.currency)}</span>
                      {p.status === "refunded" && (
                        <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#7a1f1f]">Refunded</span>
                      )}
                      <span className="text-black/60"> from {p.payer_name || p.email || "unknown payer"}</span>
                    </p>
                    <span className="font-mono text-xs text-black/55">{formatDate(p.paid_at)}</span>
                  </div>
                  {p.email && p.payer_name && <p className="font-text text-sm text-black/55">{p.email}</p>}
                  {p.article_title && (
                    <p className="font-text text-sm text-black/55">Article title given at checkout: “{p.article_title}”</p>
                  )}
                  <div className="mt-2">
                    {p.submission_id ? (
                      <Link href={`/portal/submissions/${p.submission_id}`} className="font-text text-sm text-primary hover:underline">
                        <span className="font-mono text-xs">{p.ref}</span> {p.title}
                      </Link>
                    ) : (
                      <div className="space-y-1.5">
                        <p className={LABEL}>Not matched. Enter the submission reference:</p>
                        <AssignPayment paymentId={p.id} suggestion={p.client_reference_id ?? undefined} />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside>
          <section className={`${PANEL} p-5`} aria-labelledby="due-heading">
            <h2 id="due-heading" className="font-display text-2xl font-normal">
              Fees due
            </h2>
            {due.length === 0 ? (
              <p className="mt-2 font-text text-sm text-black/55">No accepted articles are waiting on payment.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {due.map((s) => (
                  <li key={s.id}>
                    <Link href={`/portal/submissions/${s.id}`} className="font-text text-sm font-semibold leading-snug text-primary hover:underline">
                      {s.title}
                    </Link>
                    <p className="font-mono text-[11px] text-black/50">
                      {s.ref} · {s.first_name} {s.last_name} · updated {formatDate(s.updated_at)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </PortalShell>
  );
}
