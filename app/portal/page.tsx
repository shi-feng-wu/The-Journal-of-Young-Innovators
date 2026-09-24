import Link from "next/link";
import { requirePageEditor } from "@/lib/portal/auth";
import {
  PAYMENT_STATUSES,
  STATUS_LABELS,
  SUBMISSION_TYPE_LABELS,
  type PaymentStatus,
  type SubmissionStatus,
} from "@/lib/portal/constants";
import { all, get, type Submission } from "@/lib/portal/db";
import Pipeline from "./_components/Pipeline";
import PortalShell from "./_components/PortalShell";
import {
  BUTTON,
  FeeMark,
  INPUT,
  META,
  Masthead,
  STAGES,
  STAGE_NAMES,
  StageTrack,
  formatDate,
} from "./_components/ui";

export const metadata = { title: "Submissions" };

const OPEN: SubmissionStatus[] = ["received", "in_review", "revisions", "accepted"];
const CLOSED: SubmissionStatus[] = ["rejected", "withdrawn"];

type Row = Submission & { assignee: string | null };

type Filters = { status: string; payment?: PaymentStatus; q: string; mine: boolean };

function hrefFor(current: Filters, next: Partial<Filters>) {
  const f = { ...current, ...next };
  const qs = new URLSearchParams();
  if (f.status !== "open") qs.set("status", f.status);
  if (f.payment) qs.set("payment", f.payment);
  if (f.q) qs.set("q", f.q);
  if (f.mine) qs.set("mine", "1");
  const s = qs.toString();
  return s ? `/portal?${s}` : "/portal";
}

const FEE_FILTERS: Array<{ key: PaymentStatus; label: string }> = [
  { key: "due", label: "Fee due" },
  { key: "paid", label: "Paid" },
  { key: "waived", label: "Waived" },
  { key: "refunded", label: "Refunded" },
];

export default async function PortalHome({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; payment?: string; q?: string; mine?: string }>;
}) {
  const editor = await requirePageEditor();
  const sp = await searchParams;
  const filters: Filters = {
    status: sp.status ?? "open",
    payment: PAYMENT_STATUSES.includes(sp.payment as PaymentStatus) ? (sp.payment as PaymentStatus) : undefined,
    q: sp.q?.trim() ?? "",
    mine: sp.mine === "1",
  };

  const where: string[] = [];
  const params: Record<string, string | number> = {};
  if (filters.status === "open") {
    where.push(`status IN (${OPEN.map((s) => `'${s}'`).join(",")})`);
  } else if (filters.status !== "all") {
    where.push("status = :status");
    params.status = filters.status;
  }
  if (filters.payment) {
    where.push("payment_status = :payment");
    params.payment = filters.payment;
  }
  if (filters.mine) {
    where.push("assigned_editor_id = :me");
    params.me = editor.id;
  }
  if (filters.q) {
    where.push(
      `(title LIKE :q OR first_name || ' ' || last_name LIKE :q OR email LIKE :q
        OR school LIKE :q OR ref LIKE :q)`,
    );
    params.q = `%${filters.q}%`;
  }

  const rows = all<Row>(
    `SELECT submissions.*, editors.name AS assignee
       FROM submissions LEFT JOIN editors ON editors.id = submissions.assigned_editor_id
      ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
      ORDER BY submissions.created_at DESC
      LIMIT 500`,
    params,
  );

  const counts = Object.fromEntries(
    all<{ status: string; n: number }>("SELECT status, COUNT(*) AS n FROM submissions GROUP BY status").map(
      (r) => [r.status, r.n],
    ),
  ) as Partial<Record<SubmissionStatus, number>>;
  const count = (s: SubmissionStatus) => counts[s] ?? 0;
  const total = Object.values(counts).reduce((a, b) => a + (b ?? 0), 0);
  const unmatched = get<{ n: number }>("SELECT COUNT(*) AS n FROM payments WHERE submission_id IS NULL")!.n;

  const statusNav: Array<{ key: string; label: string }> = [
    { key: "open", label: "In progress" },
    ...[...STAGES, ...CLOSED].map((s) => ({ key: s, label: STATUS_LABELS[s] })),
    { key: "all", label: "Everything" },
  ];

  const heading =
    filters.status === "open"
      ? "In progress"
      : filters.status === "all"
        ? "Every submission"
        : STATUS_LABELS[filters.status as SubmissionStatus];

  return (
    <PortalShell
      editor={editor}
      masthead={
        <Masthead title="Submissions">
          <Pipeline
            stages={STAGES.map((s) => ({
              key: s,
              label: STAGE_NAMES[s],
              count: count(s),
              href: hrefFor(filters, { status: s, payment: undefined }),
              active: filters.status === s,
            }))}
          />
        </Masthead>
      }
    >
      <div className="grid gap-x-12 lg:grid-cols-[minmax(0,1fr)_200px] xl:grid-cols-[minmax(0,1fr)_240px]">
        <div className="min-w-0">
          {unmatched > 0 && (
            <div className="mb-10 flex flex-col gap-4 bg-primary px-6 py-6 text-white sm:flex-row sm:items-center sm:justify-between lg:px-10">
              <p className="font-display text-2xl leading-tight">
                {unmatched === 1
                  ? "A card payment came in without a submission attached."
                  : `${unmatched} card payments came in without a submission attached.`}
              </p>
              <Link href="/portal/payments?filter=unmatched" className={BUTTON.onNavy}>
                Match {unmatched === 1 ? "it" : "them"}
              </Link>
            </div>
          )}

          <form action="/portal" className="flex gap-3">
            {filters.status !== "open" && <input type="hidden" name="status" value={filters.status} />}
            {filters.payment && <input type="hidden" name="payment" value={filters.payment} />}
            {filters.mine && <input type="hidden" name="mine" value="1" />}
            <label className="sr-only" htmlFor="q">
              Search submissions
            </label>
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={filters.q}
              placeholder="Search by title, author, email, school, or JYI reference"
              className={INPUT}
            />
            <button type="submit" className={BUTTON.outline}>
              Search
            </button>
          </form>

          <h2 className="mt-10 font-display text-[28px] font-normal leading-tight lg:text-[32px]">{heading}</h2>

          {rows.length === 0 ? (
            <div className="mt-5 border-t border-black/30 py-16">
              <p className="max-w-[48ch] font-text text-base text-[#111]/70">
                {total === 0
                  ? "No manuscripts yet. When a student submits through the website form, the manuscript lands here with its own JYI reference."
                  : "Nothing matches these filters."}
              </p>
              {total > 0 && (
                <Link href="/portal?status=all" className={`${BUTTON.quiet} mt-4`}>
                  Show every submission
                </Link>
              )}
            </div>
          ) : (
            <ol className="mt-5">
              {rows.map((r) => {
                return (
                  <li
                    key={r.id}
                    className="group relative grid border-t border-black/30 py-7 lg:grid-cols-[minmax(0,1fr)_176px] lg:gap-8"
                  >
                    <div className="min-w-0">
                      <h3 className="font-display text-2xl font-normal leading-[1.2] text-[#111] lg:text-[28px]">
                        <Link
                          href={`/portal/submissions/${r.id}`}
                          className="underline-offset-4 decoration-1 after:absolute after:inset-0 group-hover:text-primary group-hover:underline"
                        >
                          {r.title}
                        </Link>
                      </h3>
                      <p className="mt-2 font-mono text-[13px] text-[#111]/80 lg:text-sm">
                        {r.first_name} {r.last_name}
                      </p>
                      {r.school && <p className="mt-0.5 font-mono text-[11px] text-[#111]/65 lg:text-xs">{r.school}</p>}
                      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                        <StageTrack status={r.status} />
                        {r.payment_status !== "not_due" && <FeeMark status={r.payment_status} />}
                      </div>
                      <p className={`${META} mt-3 lg:hidden`}>
                        {r.ref}, {formatDate(r.created_at)}
                      </p>
                    </div>
                    <div className={`${META} hidden text-right lg:flex lg:flex-col lg:gap-2`}>
                      <span className="text-[#111]/85">{r.ref}</span>
                      <span>{formatDate(r.created_at)}</span>
                      {r.submission_type && (
                        <span>{SUBMISSION_TYPE_LABELS[r.submission_type] ?? r.submission_type}</span>
                      )}
                      {r.assignee && <span>{r.assignee}</span>}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        {/* Right-hand index, in the style of the Issues page. */}
        <aside className="order-first mb-10 min-w-0 lg:order-none lg:mb-0">
          <div className="lg:sticky lg:top-8">
            <nav aria-label="Filter by stage" className="hidden border-t border-black/30 lg:block">
              {statusNav.map((item) => {
                const active = filters.status === item.key;
                return (
                  <Link
                    key={item.key}
                    href={hrefFor(filters, { status: item.key })}
                    aria-current={active ? "page" : undefined}
                    className={`block border-b border-black/10 py-3 font-display text-xl leading-tight transition-colors ${
                      active ? "text-primary" : "text-[#111]/60 hover:text-[#111]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Small screens get the stages as a scrolling row. */}
            <nav aria-label="Filter by stage" className="hide-scrollbar -mx-4 flex gap-6 overflow-x-auto border-b border-black/30 px-4 lg:hidden">
              {statusNav.map((item) => {
                const active = filters.status === item.key;
                return (
                  <Link
                    key={item.key}
                    href={hrefFor(filters, { status: item.key })}
                    aria-current={active ? "page" : undefined}
                    className={`-mb-px inline-flex min-h-11 items-center whitespace-nowrap border-b-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] ${
                      active ? "border-primary text-primary" : "border-transparent text-[#111]/55"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 lg:mt-10 lg:block">
              <p className={`${META} hidden lg:mb-3 lg:block`}>Publication fee</p>
              {FEE_FILTERS.map((f) => {
                const active = filters.payment === f.key;
                return (
                  <Link
                    key={f.key}
                    href={hrefFor(filters, { payment: active ? undefined : f.key })}
                    aria-pressed={active}
                    className={`flex items-center gap-2 py-1 font-text text-[15px] transition-colors ${
                      active ? "font-semibold text-primary" : "text-[#111]/65 hover:text-[#111]"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`flex h-4 w-4 items-center justify-center rounded border ${
                        active ? "border-primary bg-primary text-white" : "border-[#111]/30"
                      }`}
                    >
                      {active && (
                        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M2.5 6.5l2.5 2.5 4.5-5" />
                        </svg>
                      )}
                    </span>
                    {f.label}
                  </Link>
                );
              })}
              <Link
                href={hrefFor(filters, { mine: !filters.mine })}
                aria-pressed={filters.mine}
                className={`flex items-center gap-2 py-1 font-text text-[15px] transition-colors lg:mt-4 lg:border-t lg:border-black/10 lg:pt-4 ${
                  filters.mine ? "font-semibold text-primary" : "text-[#111]/65 hover:text-[#111]"
                }`}
              >
                <span
                  aria-hidden
                  className={`flex h-4 w-4 items-center justify-center rounded border ${
                    filters.mine ? "border-primary bg-primary text-white" : "border-[#111]/30"
                  }`}
                >
                  {filters.mine && (
                    <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2.5 6.5l2.5 2.5 4.5-5" />
                    </svg>
                  )}
                </span>
                Assigned to me
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </PortalShell>
  );
}
