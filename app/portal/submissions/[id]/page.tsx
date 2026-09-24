import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePageEditor } from "@/lib/portal/auth";
import {
  GRADE_LABELS,
  STATUS_LABELS,
  SUBMISSION_TYPE_LABELS,
} from "@/lib/portal/constants";
import {
  all,
  getSubmission,
  listEvents,
  type Payment,
  type PortalEvent,
  type Submission,
} from "@/lib/portal/db";
import { paymentUrlFor } from "@/lib/portal/payments";
import CopyButton from "../../_components/CopyButton";
import PortalShell from "../../_components/PortalShell";
import {
  BUTTON,
  LABEL,
  META,
  Masthead,
  STAGES,
  STAGE_NAMES,
  Section,
  StageTrack,
  formatDate,
  formatDateTime,
  formatMoney,
} from "../../_components/ui";
import { DecisionPanel, HandledButton, RecordPanel } from "./SubmissionPanels";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const submission = getSubmission(Number((await params).id));
  return { title: submission?.ref ?? "Submission" };
}

/** The masthead's version of the pipeline: every stage named, this one lit. */
function StageLine({ submission }: { submission: Submission }) {
  const index = STAGES.indexOf(submission.status);
  if (index === -1) {
    return (
      <p className="mt-5 font-mono text-xs uppercase tracking-[0.2em] text-white/85">
        {STATUS_LABELS[submission.status]}
      </p>
    );
  }
  return (
    <ol className="mt-6 grid max-w-[760px] grid-cols-5" aria-label="Stage">
      {STAGES.map((stage, i) => {
        const reached = i <= index;
        return (
          <li
            key={stage}
            aria-current={i === index ? "step" : undefined}
            className="relative pt-4 pr-2"
          >
            <span
              className={`absolute top-0 left-0 h-[3px] w-full ${reached ? "bg-white" : "bg-white/20"}`}
              aria-hidden
            />
            <span
              className={`block font-mono text-[10px] uppercase tracking-[0.16em] sm:text-[11px] sm:tracking-[0.2em] ${
                i === index
                  ? "whitespace-nowrap text-white"
                  : `hidden sm:block ${reached ? "text-white/70" : "text-white/40"}`
              }`}
            >
              {STAGE_NAMES[stage]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

const EVENT_MARK: Record<PortalEvent["type"], string> = {
  created: "bg-primary",
  status: "bg-primary",
  payment: "bg-[#32965d]",
  email: "bg-white border-[1.5px] border-primary",
  note: "bg-[#68ace5]",
  assign: "bg-[#111]/25",
  reply: "bg-[#32965d] ring-2 ring-[#32965d]/25",
};

function Letter({ data, incoming }: { data: string; incoming?: boolean }) {
  const email = JSON.parse(data) as {
    to?: string;
    from?: string;
    body: string;
    attachments?: Array<string | { name: string; path: string }>;
  };
  const files = email.attachments ?? [];
  return (
    <details className="group/letter mt-2">
      <summary className="cursor-pointer list-none font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary underline-offset-4 hover:underline">
        <span className="group-open/letter:hidden">{incoming ? "Read the reply" : "Read the letter"}</span>
        <span className="hidden group-open/letter:inline">Close</span>
      </summary>
      <div className="mt-3 border border-black/15 bg-white px-5 py-5 sm:px-7">
        <p className="font-mono text-[11px] text-[#111]/55">
          {incoming ? `From ${email.from}` : `To ${email.to}`}
        </p>
        {files.length > 0 && (
          <p className="mt-1 flex flex-wrap gap-x-4 font-mono text-[11px] text-[#111]/55">
            {files.map((f) =>
              typeof f === "string" ? (
                <span key={f}>{f}</span>
              ) : (
                <a
                  key={f.path}
                  href={`/api/portal/files?path=${encodeURIComponent(f.path)}`}
                  className="text-primary underline underline-offset-2"
                >
                  {f.name}
                </a>
              ),
            )}
          </p>
        )}
        <p className="mt-4 max-w-[68ch] whitespace-pre-wrap font-text text-[15px] leading-[1.7] text-[#111]/85">
          {email.body}
        </p>
      </div>
    </details>
  );
}

export default async function SubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
    `SELECT * FROM submissions WHERE email = :email COLLATE NOCASE AND id != :id ORDER BY created_at DESC`,
    { email: submission.email, id },
  );

  const authorName =
    `${submission.first_name} ${submission.last_name}`.trim() ||
    submission.email;
  // Anyone the journal has emailed about a manuscript who is not its author.
  const reviewers = all<{ to: string }>(
    `SELECT DISTINCT json_extract(events.data, '$.to') AS "to"
       FROM events JOIN submissions ON submissions.id = events.submission_id
      WHERE events.type = 'email'
        AND json_extract(events.data, '$.to') IS NOT NULL
        AND lower(json_extract(events.data, '$.to')) != lower(submissions.email)
      ORDER BY 1`,
  ).map((r) => r.to);

  const panelProps = {
    submissionId: submission.id,
    email: submission.email,
    authorName,
    status: submission.status,
    paymentStatus: submission.payment_status,
    assignedEditorId: submission.assigned_editor_id,
    editors,
    reviewers,
    manuscriptName: submission.manuscript_file ? submission.manuscript_name : null,
    context: {
      firstName: submission.first_name,
      title: submission.title,
      ref: submission.ref,
      paymentUrl: paymentUrlFor(submission),
      editorName: editor.name,
    },
  };

  const byline = [
    authorName,
    submission.school,
    GRADE_LABELS[submission.grade_level] ?? submission.grade_level,
  ]
    .filter(Boolean)
    .join(", ");

  const details: Array<[string, React.ReactNode]> = [
    [
      "Email",
      <a
        key="e"
        href={`mailto:${submission.email}`}
        className="text-primary underline decoration-1 underline-offset-4"
      >
        {submission.email}
      </a>,
    ],
    [
      "Phone",
      submission.phone || <span className="text-[#111]/40">Not given</span>,
    ],
    [
      "Type",
      SUBMISSION_TYPE_LABELS[submission.submission_type] ??
        (submission.submission_type || "Not given"),
    ],
    ["Received", formatDateTime(submission.created_at)],
  ];

  return (
    <PortalShell
      editor={editor}
      masthead={
        <Masthead
          above={
            <div className="mb-1 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
              <Link
                href="/portal"
                className="hover:text-white hover:underline underline-offset-4"
              >
                Submissions
              </Link>
              <span aria-hidden>/</span>
              <span className="text-white">{submission.ref}</span>
            </div>
          }
          title={submission.title}
          subtitle={byline}
        >
          <StageLine submission={submission} />
        </Masthead>
      }
    >
      {submission.attention_since && (
        <div className="mb-10 flex flex-col gap-4 bg-primary px-6 py-6 text-white sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p className="font-display text-2xl leading-tight">
            {submission.first_name || "The author"} wrote in on {formatDate(submission.attention_since)}.{" "}
            <a href="#history" className="font-text text-base text-white/80 underline underline-offset-4">
              Read it
            </a>
          </p>
          <HandledButton submissionId={submission.id} />
        </div>
      )}
      <div className="grid gap-x-14 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <Section
            id="manuscript"
            title="Manuscript"
            aside={
              submission.manuscript_file ? (
                <a
                  href={`/api/portal/submissions/${submission.id}/manuscript`}
                  className={BUTTON.outline}
                >
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    aria-hidden
                  >
                    <path d="M8 2v8m0 0l-3.5-3.5M8 10l3.5-3.5M2.5 13.5h11" />
                  </svg>
                  Download .{(submission.manuscript_name ?? submission.manuscript_file).split(".").pop()?.toLowerCase()}
                </a>
              ) : (
                <span className="font-text text-sm text-[#111]/50">
                  No file on record
                </span>
              )
            }
          >
            <dl className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
              {details.map(([label, value]) => (
                <div key={label} className="min-w-0">
                  <dt className={LABEL}>{label}</dt>
                  <dd className="mt-1 break-words font-text text-base">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            {submission.manuscript_name && (
              <p className="mt-6 break-all font-mono text-xs text-[#111]/55">
                {submission.manuscript_name}
              </p>
            )}
          </Section>

          <Section id="decision" title="Write a letter">
            <DecisionPanel {...panelProps} />
          </Section>

          <Section id="history" title="History">
            <ol className="relative">
              <span
                className="absolute top-2 bottom-2 left-[4px] w-px bg-black/15"
                aria-hidden
              />
              {events.map((e) => (
                <li
                  key={e.id}
                  className="relative grid gap-x-6 pb-6 pl-7 last:pb-0 sm:grid-cols-[minmax(0,1fr)_auto]"
                >
                  <span
                    className={`absolute top-[7px] left-0 h-[9px] w-[9px] rounded-full ${EVENT_MARK[e.type]}`}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    {e.type === "note" ? (
                      <blockquote className="max-w-[62ch] border-l-2 border-[#68ace5] pl-4 font-text text-[15px] italic leading-relaxed whitespace-pre-wrap text-[#111]/85">
                        {e.summary}
                      </blockquote>
                    ) : (
                      <p className="font-text text-[15px] leading-relaxed">
                        {e.summary}
                      </p>
                    )}
                    {(e.type === "email" || e.type === "reply") && e.data && (
                      <Letter data={e.data} incoming={e.type === "reply"} />
                    )}
                  </div>
                  <p className={`${META} mt-1 sm:mt-0.5 sm:text-right`}>
                    {formatDateTime(e.created_at)}
                    <span className="block text-[#111]/45">
                      {e.editor_name ??
                        (e.type === "payment"
                          ? "Stripe"
                          : e.type === "created"
                            ? "Website form"
                            : "")}
                    </span>
                  </p>
                </li>
              ))}
            </ol>
          </Section>
        </div>

        <aside>
          <div className="lg:sticky lg:top-8">
            <RecordPanel {...panelProps} />

            {(payments.length > 0 || submission.payment_status === "due") && (
              <div className="border-t border-black/30 pt-5 pb-7">
                <p className={LABEL}>Card payments</p>
                {payments.length > 0 && (
                  <ul className="mt-3 space-y-3">
                    {payments.map((p) => (
                      <li key={p.id} className="font-text text-sm">
                        <span
                          className={`font-display text-xl ${p.status === "refunded" ? "text-[#111]/45 line-through decoration-1" : ""}`}
                        >
                          {formatMoney(p.amount, p.currency)}
                        </span>{" "}
                        <span className="text-[#111]/65">
                          {p.status === "refunded" ? "refunded" : "paid"}{" "}
                          {formatDate(p.paid_at)}
                        </span>
                        {p.email &&
                          p.email.toLowerCase() !==
                            submission.email.toLowerCase() && (
                            <span className="block text-xs text-[#111]/50">
                              by {p.email}
                            </span>
                          )}
                      </li>
                    ))}
                  </ul>
                )}
                {submission.payment_status === "due" && (
                  <div className="mt-3">
                    <CopyButton
                      text={panelProps.context.paymentUrl}
                      label="Copy payment link"
                    />
                  </div>
                )}
              </div>
            )}

            {others.length > 0 && (
              <div className="border-t border-black/30 pt-5 pb-7">
                <p className={LABEL}>
                  Also by {submission.first_name || "this author"}
                </p>
                <ul className="mt-3 space-y-4">
                  {others.map((o) => (
                    <li key={o.id}>
                      <Link
                        href={`/portal/submissions/${o.id}`}
                        className="font-display text-lg leading-snug text-[#111] underline-offset-4 decoration-1 hover:text-primary hover:underline"
                      >
                        {o.title}
                      </Link>
                      <div className="mt-1.5">
                        <StageTrack status={o.status} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
    </PortalShell>
  );
}
