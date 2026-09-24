import Link from "next/link";
import { requirePageEditor } from "@/lib/portal/auth";
import { GRADE_LABELS } from "@/lib/portal/constants";
import { all, type Submission } from "@/lib/portal/db";
import PortalShell from "../_components/PortalShell";
import { INPUT, LABEL, PANEL, PageTitle, PaymentBadge, StatusBadge, formatDate } from "../_components/ui";

export const metadata = { title: "Authors" };

export default async function AuthorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const editor = await requirePageEditor();
  const q = (await searchParams).q?.trim() ?? "";
  const submissions = all<Submission>(
    `SELECT * FROM submissions
      ${q ? "WHERE first_name || ' ' || last_name LIKE :q OR email LIKE :q OR school LIKE :q" : ""}
      ORDER BY created_at DESC`,
    q ? { q: `%${q}%` } : {},
  );

  // One entry per email address, newest details first.
  const authors = new Map<string, Submission[]>();
  for (const s of submissions) {
    const key = s.email.toLowerCase();
    authors.set(key, [...(authors.get(key) ?? []), s]);
  }

  return (
    <PortalShell editor={editor}>
      <PageTitle title="Authors" eyebrow={`${authors.size} ${authors.size === 1 ? "author" : "authors"}`} />
      <form action="/portal/authors" className="mt-6 max-w-md">
        <label className="block space-y-1">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-white/70">Search</span>
          <input name="q" defaultValue={q} placeholder="Name, email, or school" className={INPUT} />
        </label>
      </form>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[...authors.values()].map((subs) => {
          const latest = subs[0];
          return (
            <section key={latest.email.toLowerCase()} className={`${PANEL} flex flex-col p-5`}>
              <h2 className="font-display text-2xl font-normal leading-tight">
                {latest.first_name} {latest.last_name}
              </h2>
              <a href={`mailto:${latest.email}`} className="mt-1 truncate font-text text-sm text-primary underline underline-offset-2">
                {latest.email}
              </a>
              <p className="mt-1 font-text text-sm text-black/60">
                {[latest.school, GRADE_LABELS[latest.grade_level] ?? latest.grade_level, latest.phone]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <h3 className={`${LABEL} mt-4`}>
                {subs.length === 1 ? "1 submission" : `${subs.length} submissions`}
              </h3>
              <ul className="mt-2 space-y-3">
                {subs.map((s) => (
                  <li key={s.id}>
                    <Link href={`/portal/submissions/${s.id}`} className="font-text text-sm font-semibold leading-snug text-primary hover:underline">
                      {s.title}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] text-black/50">{formatDate(s.created_at)}</span>
                      <StatusBadge status={s.status} />
                      {s.payment_status !== "not_due" && <PaymentBadge status={s.payment_status} />}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
      {authors.size === 0 && (
        <p className="mt-10 font-text text-sm text-white/70">
          {q ? "No authors match that search." : "No authors yet."}
        </p>
      )}
    </PortalShell>
  );
}
