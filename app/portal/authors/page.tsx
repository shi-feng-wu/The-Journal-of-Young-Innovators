import Link from "next/link";
import { requirePageEditor } from "@/lib/portal/auth";
import { GRADE_LABELS } from "@/lib/portal/constants";
import { all, type Submission } from "@/lib/portal/db";
import PortalShell from "../_components/PortalShell";
import SearchBar from "../_components/SearchBar";
import { BUTTON, FeeMark, INPUT, META, Masthead, StageTrack, formatDate } from "../_components/ui";

export const metadata = { title: "Authors" };

export default async function AuthorsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const editor = await requirePageEditor();
  const q = (await searchParams).q?.trim() ?? "";
  const submissions = all<Submission>(
    `SELECT * FROM submissions
      ${q ? "WHERE first_name || ' ' || last_name LIKE :q OR email LIKE :q OR school LIKE :q" : ""}
      ORDER BY created_at DESC`,
    q ? { q: `%${q}%` } : {},
  );

  // One entry per email address; the newest submission supplies the details.
  const authors = new Map<string, Submission[]>();
  for (const s of submissions) {
    const key = s.email.toLowerCase();
    authors.set(key, [...(authors.get(key) ?? []), s]);
  }

  return (
    <PortalShell
      editor={editor}
      masthead={
        <Masthead title="Authors" />
      }
    >
      <div className="max-w-3xl">
        <SearchBar
          action="/portal/authors"
          label="Search authors"
          placeholder="Name, email, or school"
          defaultValue={q}
          clearHref="/portal/authors"
        />
      </div>

      {authors.size === 0 ? (
        <p className="mt-10 border-t border-black/30 py-12 font-text text-base text-[#111]/65">
          {q ? `No author matches “${q}”.` : "No authors yet."}
        </p>
      ) : (
        <ol className="mt-10">
          {[...authors.values()].map((subs) => {
            const a = subs[0];
            return (
              <li
                key={a.email.toLowerCase()}
                className="grid gap-y-5 border-t border-black/30 py-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-12"
              >
                <div className="min-w-0">
                  <h2 className="font-display text-[28px] leading-tight">
                    {a.first_name} {a.last_name}
                  </h2>
                  <a href={`mailto:${a.email}`} className="mt-2 inline-block font-mono text-[13px] text-primary underline decoration-1 underline-offset-4">
                    {a.email}
                  </a>
                  <p className="mt-1 font-mono text-xs text-[#111]/65">
                    {[a.school, GRADE_LABELS[a.grade_level] ?? a.grade_level].filter(Boolean).join(", ")}
                  </p>
                  {a.phone && <p className="mt-0.5 font-mono text-xs text-[#111]/65">{a.phone}</p>}
                </div>
                <ul className="min-w-0 divide-y divide-black/10 border-t border-black/10 lg:border-t-0">
                  {subs.map((s) => (
                    <li key={s.id} className="group relative flex flex-col gap-2 py-3.5 first:pt-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                      <Link
                        href={`/portal/submissions/${s.id}`}
                        className="min-w-0 font-display text-xl leading-snug underline-offset-4 decoration-1 after:absolute after:inset-0 group-hover:text-primary group-hover:underline"
                      >
                        {s.title}
                      </Link>
                      <span className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-1">
                        <StageTrack status={s.status} />
                        {s.payment_status !== "not_due" && <FeeMark status={s.payment_status} />}
                        <span className={META}>{formatDate(s.created_at)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      )}
    </PortalShell>
  );
}
