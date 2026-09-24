import Link from "next/link";
import { requirePageEditor } from "@/lib/portal/auth";
import { PUBLICATION_FEE_CENTS } from "@/lib/portal/constants";
import { all, type Payment, type Submission } from "@/lib/portal/db";
import { stripeSyncEnabled } from "@/lib/portal/payments";
import PortalShell from "../_components/PortalShell";
import { LABEL, META, Masthead, formatDate, formatMoney } from "../_components/ui";
import { AssignPayment, SyncButton } from "./PaymentControls";

export const metadata = { title: "Payments" };

type Row = Payment & { ref: string | null; title: string | null };

export default async function PaymentsPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const editor = await requirePageEditor();
  const unmatchedOnly = (await searchParams).filter === "unmatched";
  const allPayments = all<Row>(
    `SELECT payments.*, submissions.ref, submissions.title
       FROM payments LEFT JOIN submissions ON submissions.id = payments.submission_id
      ORDER BY payments.paid_at DESC`,
  );
  const payments = unmatchedOnly ? allPayments.filter((p) => !p.submission_id) : allPayments;
  const unmatchedCount = allPayments.filter((p) => !p.submission_id).length;
  const due = all<Submission & { accepted_at: string | null }>(
    `SELECT submissions.*,
            (SELECT MAX(created_at) FROM events
              WHERE events.submission_id = submissions.id AND events.type = 'status'
                AND events.data LIKE '%"to":"accepted"%') AS accepted_at
       FROM submissions WHERE payment_status = 'due' ORDER BY accepted_at`,
  );
  const collected = allPayments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
  const webhookReady = !!process.env.STRIPE_WEBHOOK_SECRET;

  const figures = [
    { label: "Collected", value: formatMoney(collected) },
    { label: "Still owed", value: formatMoney(due.length * PUBLICATION_FEE_CENTS) },
  ];

  return (
    <PortalShell
      editor={editor}
      masthead={
        <Masthead title="Payments">
          <dl className="mt-8 grid max-w-[520px] grid-cols-2 lg:mt-10">
            {figures.map((f) => (
              <div key={f.label} className="border-t border-white/30 pt-4 pr-4">
                <dd className="font-display text-[40px] leading-none tabular-nums sm:text-[56px] lg:text-[64px]">{f.value}</dd>
                <dt className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/70 lg:text-xs">{f.label}</dt>
              </div>
            ))}
          </dl>
          {stripeSyncEnabled() && (
            <div className="mt-6">
              <SyncButton />
            </div>
          )}
        </Masthead>
      }
    >
      {!webhookReady && (
        <p className="mb-10 max-w-[72ch] border-l-2 border-primary pl-4 font-text text-[15px] leading-relaxed text-[#111]/80">
          Stripe is not connected on this server yet, so card payments will not show up here on their own. You can still
          set the fee by hand on any manuscript.
        </p>
      )}

      <div className="grid gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px]">
        <section aria-labelledby="received" className="min-w-0">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h2 id="received" className="font-display text-[28px] leading-tight lg:text-[32px]">
              {unmatchedOnly ? "Payments to match" : "Received"}
            </h2>
            {(unmatchedCount > 0 || unmatchedOnly) && (
              <Link
                href={unmatchedOnly ? "/portal/payments" : "/portal/payments?filter=unmatched"}
                className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary underline-offset-4 hover:underline"
              >
                {unmatchedOnly ? "Show all payments" : "Unmatched only"}
              </Link>
            )}
          </div>

          {payments.length === 0 ? (
            <p className="border-t border-black/30 py-12 font-text text-base text-[#111]/65">
              {unmatchedOnly
                ? "Every payment is matched to a manuscript."
                : "No card payments yet. They appear here as soon as an author pays through the link in their acceptance letter."}
            </p>
          ) : (
            <ol>
              {payments.map((p) => (
                <li key={p.id} className="grid gap-y-3 border-t border-black/30 py-6 sm:grid-cols-[minmax(0,1fr)_150px] sm:gap-x-8">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-baseline gap-x-3">
                      <span
                        className={`font-display text-[32px] leading-none tabular-nums ${
                          p.status === "refunded" ? "text-[#111]/40 line-through decoration-1" : ""
                        }`}
                      >
                        {formatMoney(p.amount, p.currency)}
                      </span>
                      {p.status === "refunded" && (
                        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#111]/60">Refunded</span>
                      )}
                    </p>
                    <p className="mt-3 font-mono text-[13px] text-[#111]/80">{p.payer_name || "Name not given"}</p>
                    {p.email && <p className="font-mono text-xs text-[#111]/60">{p.email}</p>}
                    {p.article_title && (
                      <p className="mt-2 font-text text-sm text-[#111]/65">
                        Typed at checkout: <span className="italic">{p.article_title}</span>
                      </p>
                    )}
                    <div className="mt-4">
                      {p.submission_id ? (
                        <Link
                          href={`/portal/submissions/${p.submission_id}`}
                          className="font-display text-xl leading-snug underline-offset-4 decoration-1 hover:text-primary hover:underline"
                        >
                          {p.title}
                        </Link>
                      ) : (
                        <div className="max-w-md border-l-2 border-primary pl-4">
                          <p className="mb-2 font-text text-sm text-[#111]/75">
                            Which manuscript is this for? Enter its JYI reference.
                          </p>
                          <AssignPayment paymentId={p.id} suggestion={p.client_reference_id ?? undefined} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`${META} sm:text-right`}>
                    <span className="block">{formatDate(p.paid_at)}</span>
                    {p.ref && <span className="block text-[#111]/85">{p.ref}</span>}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>

        <aside aria-labelledby="owed">
          <div className="lg:sticky lg:top-8">
            <h2 id="owed" className="font-display text-[28px] leading-tight">
              Owed
            </h2>
            <p className="mt-1 mb-5 font-text text-sm text-[#111]/60">Accepted, fee not paid yet.</p>
            {due.length === 0 ? (
              <p className="border-t border-black/30 pt-5 font-text text-[15px] text-[#111]/65">Nobody owes a fee right now.</p>
            ) : (
              <ul className="border-t border-black/30">
                {due.map((s) => (
                  <li key={s.id} className="group relative border-b border-black/10 py-3.5">
                    <Link
                      href={`/portal/submissions/${s.id}`}
                      className="font-display text-lg leading-snug underline-offset-4 decoration-1 after:absolute after:inset-0 group-hover:text-primary group-hover:underline"
                    >
                      {s.title}
                    </Link>
                    <p className={`${LABEL} mt-1`}>
                      {s.first_name} {s.last_name}
                      {s.accepted_at && `, accepted ${formatDate(s.accepted_at)}`}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </PortalShell>
  );
}
