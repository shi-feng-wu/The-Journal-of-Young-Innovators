import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePageEditor } from "@/lib/portal/auth";
import { GRADE_LABELS, SUBMISSION_TYPE_LABELS } from "@/lib/portal/constants";
import {
  all,
  getSubmission,
  listEvents,
  type Payment,
  type PortalEvent,
  type Submission,
} from "@/lib/portal/db";
import { paymentUrlFor } from "@/lib/portal/payments";
import PortalShell from "../../_components/PortalShell";
import {
  LABEL,
  PANEL,
  PaymentBadge,
  StatusBadge,
  formatDate,
  formatDateTime,
  formatMoney,
} from "../../_components/ui";
import { DecisionPanel, RecordPanel } from "./SubmissionPanels";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const submission = getSubmission(Number((await params).id));
  return { title: submission?.ref ?? "Submission" };
}

const EVENT_DOT: Record<PortalEvent["type"], string> = {
  created: "bg-primary",
  status: "bg-[#68ace5]",
  payment: "bg-[#32965d]",
  email: "bg-[#f2c14e]",
  note: "bg-black/40",
  assign: "bg-black/20",
};

function EmailDetails({ data }: { data: string }) {
  const email = JSON.parse(data) as { to: string; body: string; attachments?: string[] };
  return (
    <details className="mt-1.5">
      <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.12em] text-primary">
        Show email
      </summary>
      <div className="mt-2 rounded-md bg-white p-3">
        <p className="font-mono text-[11px] text-black/50">To: {email.to}</p>
        {email.attachments && email.attachments.length > 0 && (
          <p className="font-mono text-[11px] text-black/50">
            Attached: {email.attachments.join(", ")}
          </p>
        )}
        <p className="mt-2 whitespace-pre-wrap font-text text-sm leading-relaxed text-black/80">
          {email.body}
        </p>
      </div>
    </details>
  );
}

export default async function SubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  const editor = await requirePageEditor();
  const id = Number((await params).id);
  const submission = Number.isInteger(id) ? getSubmission(id) : undefined;
  if (!submission) notFound();

  const events = listEvents(id);
  const payments = all<Payment>(
    "SELECT * FROM payments WHERE submission_id = :id ORDER BY paid_at DESC",
    { id },
  );
  const editors = all<{ id: number; name: string }>(
    "SELECT id, name FROM editors WHERE disabled = 0 ORDER BY name",
  );
  const others = all<Submission>(
    `SELECT * FROM submissions WHERE email = :email COLLATE NOCASE AND id != :id
      ORDER BY created_at DESC`,
    { email: submission.email, id },
  );

  const panelProps = {
    submissionId: submission.id,
    email: submission.email,
    status: submission.status,
    paymentStatus: submission.payment_status,
    assignedEditorId: submission.assigned_editor_id,
    editors,
    context: {
      firstName: submission.first_name,
      title: submission.title,
      ref: submission.ref,
      paymentUrl: paymentUrlFor(submission),
      editorName: editor.name,
    },
  };

  const details: Array<[string, React.ReactNode]> = [
    ["Author", `${submission.first_name} ${submission.last_name}`.trim() || "Not given"],
    [
      "Email",
      <a key="email" href={`mailto:${submission.email}`} className="text-primary underline underline-offset-2">
        {submission.email}
      </a>,
    ],
    ["Phone", submission.phone || "Not given"],
    ["School", submission.school || "Not given"],
    ["Grade", GRADE_LABELS[submission.grade_level] ?? (submission.grade_level || "Not given")],
    ["Type", SUBMISSION_TYPE_LABELS[submission.submission_type] ?? (submission.submission_type || "Not given")],
    ["Received", formatDateTime(submission.created_at)],
  ];

  return (
    <PortalShell editor={editor}>
      <Link href="/portal" className="font-mono text-xs uppercase tracking-[0.16em] text-white/70 hover:text-white">
        ← All submissions
      </Link>
      <div className="mt-4">
        <p className="font-mono text-sm text-white/70">{submission.ref}</p>
        <h1 className="mt-1 max-w-[30ch] font-display text-3xl font-normal leading-tight md:text-5xl">
          {submission.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#F4EFEB] p-0.5"><StatusBadge status={submission.status} /></span>
          <span className="rounded-full bg-[#F4EFEB] p-0.5"><PaymentBadge status={submission.payment_status} /></span>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <section className={`${PANEL} p-5 sm:p-6`} aria-labelledby="details-heading">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h2 id="details-heading" className="font-display text-2xl font-normal">
                Details
              </h2>
              {submission.manuscript_file ? (
                <a
                  href={`/api/portal/submissions/${submission.id}/manuscript`}
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-primary bg-primary px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-[#003a92]"
                >
                  Download manuscript
                </a>
              ) : (
                <span className="font-text text-sm text-black/50">No manuscript file stored</span>
              )}
            </div>
            <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {details.map(([label, value]) => (
                <div key={label} className="min-w-0">
                  <dt className={LABEL}>{label}</dt>
                  <dd className="mt-0.5 break-words font-text text-[15px]">{value}</dd>
                </div>
              ))}
            </dl>
            {submission.manuscript_name && (
              <p className="mt-4 break-all font-mono text-xs text-black/50">File: {submission.manuscript_name}</p>
            )}
          </section>

          <DecisionPanel {...panelProps} />

          <section className={`${PANEL} p-5 sm:p-6`} aria-labelledby="activity-heading">
            <h2 id="activity-heading" className="font-display text-2xl font-normal">
              Activity
            </h2>
            <ol className="mt-4 space-y-4">
              {events.map((e) => (
                <li key={e.id} className="flex gap-3">
                  <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${EVENT_DOT[e.type]}`} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className={`font-text text-sm ${e.type === "note" ? "whitespace-pre-wrap rounded-md bg-white px-3 py-2" : ""}`}>
                      {e.summary}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-black/50">
                      {formatDateTime(e.created_at)}
                      {e.editor_name ? ` · ${e.editor_name}` : e.type === "payment" ? " · Stripe" : ""}
                    </p>
                    {e.type === "email" && e.data && <EmailDetails data={e.data} />}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="space-y-6">
          <RecordPanel {...panelProps} />

          <section className={`${PANEL} p-5`} aria-labelledby="payments-heading">
            <h2 id="payments-heading" className={LABEL}>
              Stripe payments
            </h2>
            {payments.length === 0 ? (
              <p className="mt-2 font-text text-sm text-black/55">None recorded.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {payments.map((p) => (
                  <li key={p.id} className="font-text text-sm">
                    <span className="font-semibold">{formatMoney(p.amount, p.currency)}</span>{" "}
                    {p.status === "refunded" ? "refunded" : "paid"} {formatDate(p.paid_at)}
                    {p.email && p.email.toLowerCase() !== submission.email.toLowerCase() && (
                      <span className="block text-xs text-black/55">by {p.email}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {submission.payment_status === "due" && (
              <p className="mt-3 break-all font-mono text-[11px] text-black/55">
                Payment link: {panelProps.context.paymentUrl}
              </p>
            )}
          </section>

          {others.length > 0 && (
            <section className={`${PANEL} p-5`} aria-labelledby="others-heading">
              <h2 id="others-heading" className={LABEL}>
                Other submissions by this author
              </h2>
              <ul className="mt-2 space-y-3">
                {others.map((o) => (
                  <li key={o.id}>
                    <Link href={`/portal/submissions/${o.id}`} className="font-text text-sm font-semibold text-primary hover:underline">
                      {o.title}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] text-black/50">{o.ref}</span>
                      <StatusBadge status={o.status} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </PortalShell>
  );
}
