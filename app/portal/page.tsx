import Link from "next/link";
import { requirePageEditor } from "@/lib/portal/auth";
import {
  PAYMENT_LABELS,
  PAYMENT_STATUSES,
  STATUS_LABELS,
  SUBMISSION_STATUSES,
  SUBMISSION_TYPE_LABELS,
  type PaymentStatus,
  type SubmissionStatus,
} from "@/lib/portal/constants";
import { all, get, type Submission } from "@/lib/portal/db";
import PortalShell from "./_components/PortalShell";
import {
  INPUT,
  LABEL,
  PANEL,
  PageTitle,
  PaymentBadge,
  StatusBadge,
  formatDate,
} from "./_components/ui";

export const metadata = { title: "Submissions" };

const OPEN: SubmissionStatus[] = ["received", "in_review", "revisions", "accepted"];

type Row = Submission & { assignee: string | null };

export default async function PortalHome({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; payment?: string; q?: string; mine?: string }>;
}) {
  const editor = await requirePageEditor();
  const sp = await searchParams;
  const status = sp.status ?? "open";
  const payment = PAYMENT_STATUSES.includes(sp.payment as PaymentStatus)
    ? (sp.payment as PaymentStatus)
    : undefined;
  const q = sp.q?.trim() ?? "";
  const mine = sp.mine === "1";

  const where: string[] = [];
  const params: Record<string, string | number> = {};
  if (status === "open") {
    where.push(`status IN (${OPEN.map((s) => `'${s}'`).join(",")})`);
  } else if (SUBMISSION_STATUSES.includes(status as SubmissionStatus)) {
    where.push("status = :status");
    params.status = status;
  }
  if (payment) {
    where.push("payment_status = :payment");
    params.payment = payment;
  }
  if (mine) {
    where.push("assigned_editor_id = :me");
    params.me = editor.id;
  }
  if (q) {
    where.push(
      `(title LIKE :q OR first_name || ' ' || last_name LIKE :q OR email LIKE :q
        OR school LIKE :q OR ref LIKE :q)`,
    );
    params.q = `%${q}%`;
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
    all<{ status: string; n: number }>(
      "SELECT status, COUNT(*) AS n FROM submissions GROUP BY status",
    ).map((r) => [r.status, r.n]),
  ) as Partial<Record<SubmissionStatus, number>>;
  const openCount = OPEN.reduce((sum, s) => sum + (counts[s] ?? 0), 0);
  const allCount = SUBMISSION_STATUSES.reduce((sum, s) => sum + (counts[s] ?? 0), 0);
  const feesDue = get<{ n: number }>(
    "SELECT COUNT(*) AS n FROM submissions WHERE payment_status = 'due'",
  )!.n;
  const unmatched = get<{ n: number }>(
    "SELECT COUNT(*) AS n FROM payments WHERE submission_id IS NULL",
  )!.n;

  const href = (next: Record<string, string | undefined>) => {
    const merged = { status, payment, q: q || undefined, mine: mine ? "1" : undefined, ...next };
    const qs = new URLSearchParams(
      Object.entries(merged).filter((e): e is [string, string] => !!e[1]),
    ).toString();
    return qs ? `/portal?${qs}` : "/portal";
  };

  const tabs: Array<{ key: string; label: string; count: number }> = [
    { key: "open", label: "Open", count: openCount },
    ...SUBMISSION_STATUSES.map((s) => ({ key: s, label: STATUS_LABELS[s], count: counts[s] ?? 0 })),
    { key: "all", label: "All", count: allCount },
  ];

  const stats = [
    { label: "New", value: counts.received ?? 0, link: href({ status: "received", payment: undefined }) },
    { label: "In review", value: counts.in_review ?? 0, link: href({ status: "in_review", payment: undefined }) },
    { label: "Awaiting revisions", value: counts.revisions ?? 0, link: href({ status: "revisions", payment: undefined }) },
    { label: "Fees due", value: feesDue, link: href({ status: "all", payment: "due" }) },
  ];

  return (
    <PortalShell editor={editor}>
      <PageTitle eyebrow={`Signed in as ${editor.name}`} title="Submissions" />

      {unmatched > 0 && (
        <Link
          href="/portal/payments?filter=unmatched"
          className="mt-6 flex items-center justify-between gap-4 rounded-lg border-2 border-[#f2c14e] px-4 py-3 font-text text-sm text-white hover:bg-white/5"
        >
          <span>
            {unmatched === 1
              ? "1 Stripe payment could not be matched to a submission."
              : `${unmatched} Stripe payments could not be matched to a submission.`}
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.16em]">Review</span>
        </Link>
      )}

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.link}
            className="rounded-lg border border-white/20 px-4 py-4 transition-colors hover:border-white/50 hover:bg-white/5"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/65">{s.label}</p>
            <p className="mt-1 font-display text-4xl">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className={`${PANEL} mt-8 overflow-hidden`}>
        <div className="flex flex-col gap-4 border-b border-black/10 p-4 sm:p-5">
          <nav aria-label="Filter by status" className="-mx-1 flex gap-1 overflow-x-auto pb-1">
            {tabs.map((t) => (
              <Link
                key={t.key}
                href={href({ status: t.key })}
                aria-current={status === t.key ? "page" : undefined}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 font-mono text-xs transition-colors ${
                  status === t.key ? "bg-primary text-white" : "text-black/70 hover:bg-black/5"
                }`}
              >
                {t.label} <span className="opacity-60">{t.count}</span>
              </Link>
            ))}
          </nav>
          <form className="flex flex-col gap-3 sm:flex-row sm:items-end" action="/portal">
            <input type="hidden" name="status" value={status} />
            <label className="flex-1 space-y-1">
              <span className={LABEL}>Search</span>
              <input
                name="q"
                defaultValue={q}
                placeholder="Title, author, email, school, or reference"
                className={INPUT}
              />
            </label>
            <label className="space-y-1 sm:w-44">
              <span className={LABEL}>Fee</span>
              <select name="payment" defaultValue={payment ?? ""} className={INPUT}>
                <option value="">Any</option>
                {PAYMENT_STATUSES.map((p) => (
                  <option key={p} value={p}>
                    {PAYMENT_LABELS[p]}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 pb-2 font-text text-sm text-black/75">
              <input type="checkbox" name="mine" value="1" defaultChecked={mine} className="accent-primary" />
              Assigned to me
            </label>
            <button type="submit" className="rounded-md bg-primary px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-white cursor-pointer">
              Filter
            </button>
          </form>
        </div>

        {rows.length === 0 ? (
          <p className="px-5 py-12 text-center font-text text-sm text-black/55">
            {allCount === 0
              ? "No submissions yet. New ones from the website form appear here automatically."
              : "No submissions match these filters."}
          </p>
        ) : (
          <>
            {/* Desktop table */}
            <table className="hidden w-full text-left md:table">
              <thead>
                <tr className="border-b border-black/10">
                  {["Reference", "Manuscript", "Received", "Status", "Fee", "Editor"].map((h) => (
                    <th key={h} scope="col" className={`${LABEL} px-5 py-3 font-normal`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="group relative border-b border-black/5 last:border-0 hover:bg-white/60">
                    <td className="px-5 py-3.5 align-top font-mono text-xs text-black/60 whitespace-nowrap">
                      {r.ref}
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <Link
                        href={`/portal/submissions/${r.id}`}
                        className="font-text text-[15px] font-semibold leading-snug text-primary after:absolute after:inset-0 group-hover:underline underline-offset-2"
                      >
                        {r.title}
                      </Link>
                      <p className="mt-0.5 font-text text-sm text-black/60">
                        {r.first_name} {r.last_name}
                        {r.school && ` · ${r.school}`}
                        {r.submission_type && ` · ${SUBMISSION_TYPE_LABELS[r.submission_type] ?? r.submission_type}`}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 align-top font-text text-sm text-black/70 whitespace-nowrap">
                      {formatDate(r.created_at)}
                    </td>
                    <td className="px-5 py-3.5 align-top"><StatusBadge status={r.status} /></td>
                    <td className="px-5 py-3.5 align-top"><PaymentBadge status={r.payment_status} /></td>
                    <td className="px-5 py-3.5 align-top font-text text-sm text-black/60 whitespace-nowrap">
                      {r.assignee ?? <span className="text-black/35">Unassigned</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile list */}
            <ul className="divide-y divide-black/10 md:hidden">
              {rows.map((r) => (
                <li key={r.id}>
                  <Link href={`/portal/submissions/${r.id}`} className="block px-4 py-4 active:bg-white/60">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] text-black/55">{r.ref}</span>
                      <span className="font-text text-xs text-black/55">{formatDate(r.created_at)}</span>
                    </div>
                    <p className="mt-1 font-text text-[15px] font-semibold leading-snug text-primary">{r.title}</p>
                    <p className="mt-0.5 font-text text-sm text-black/60">
                      {r.first_name} {r.last_name}
                      {r.school && ` · ${r.school}`}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <StatusBadge status={r.status} />
                      <PaymentBadge status={r.payment_status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </PortalShell>
  );
}
