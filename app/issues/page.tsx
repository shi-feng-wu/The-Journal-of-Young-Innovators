import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import { toArticleViewerHref } from "@/lib/articlePdfViewer";
import { SITE_ARTICLES, type SiteArticle } from "@/lib/articles";
import IssueNav from "./IssueNav";

export const metadata: Metadata = {
  title: "Issues | JYI",
  description:
    "Every issue of The Journal of Young Innovators: peer-reviewed research articles and opinion pieces by high school and college students.",
  alternates: { canonical: "/issues" },
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function longDate(publishDate: string) {
  const [y, m, d] = publishDate.split("-").map(Number);
  return `${MONTHS[(m || 1) - 1]} ${d || 1}, ${y}`;
}

function monthYear(publishDate: string) {
  const [y, m] = publishDate.split("-").map(Number);
  return `${MONTHS[(m || 1) - 1]} ${y}`;
}

interface IssueGroup {
  id: string;
  volume: number;
  issueNumber: number;
  publishedLabel: string;
  articles: SiteArticle[];
}

function buildIssueGroups(): IssueGroup[] {
  const byKey = new Map<string, SiteArticle[]>();
  for (const article of SITE_ARTICLES) {
    const key = `${article.volume}-${article.issueNumber}`;
    byKey.set(key, [...(byKey.get(key) ?? []), article]);
  }

  return [...byKey.entries()]
    .map(([key, articles]) => {
      const [volume, issueNumber] = key.split("-").map(Number);
      const latest = articles.reduce((max, a) =>
        a.publishDate > max.publishDate ? a : max,
      );
      return {
        id: `issue-${volume}-${issueNumber}`,
        volume,
        issueNumber,
        publishedLabel: monthYear(latest.publishDate),
        articles,
      };
    })
    .sort((a, b) => b.volume - a.volume || b.issueNumber - a.issueNumber);
}

function ArticleRow({ article }: { article: SiteArticle }) {
  const href = toArticleViewerHref(article.pdfPath);
  const pageRange = `pp. ${article.firstPage}–${article.lastPage}`;

  return (
    <li className="border-b border-[#ccd5e3] last:border-b-0">
      <Link
        href={href}
        className="group flex gap-4 py-6 sm:gap-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <div
          className="h-16 w-16 shrink-0 bg-cover bg-center sm:h-24 sm:w-24"
          style={{
            backgroundImage: `url(${article.image ?? "/og-image.png"})`,
          }}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          {/* Title with a print-TOC dotted leader running to the page range */}
          <div className="flex items-baseline gap-3">
            <h3 className="min-w-0 font-display text-xl leading-snug text-primary underline-offset-4 decoration-2 group-hover:underline sm:text-2xl">
              {article.title}
            </h3>
            <span
              className="hidden flex-1 -translate-y-1 border-b-2 border-dotted border-[#ccd5e3] md:block"
              aria-hidden="true"
            />
            <span className="hidden whitespace-nowrap font-mono text-xs tracking-[0.2em] text-[#52627a] md:inline">
              {pageRange}
            </span>
          </div>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-black">
            {article.author}
            {article.school ? (
              <span className="text-[#52627a]"> · {article.school}</span>
            ) : null}
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[#52627a]">
            <span className="md:hidden">{pageRange} · </span>
            {article.category} · {longDate(article.publishDate)}
          </p>
          <p className="mt-3 line-clamp-2 font-text text-sm leading-relaxed text-black/75">
            {article.abstract}
          </p>
        </div>
      </Link>
    </li>
  );
}

function IssueSection({ group }: { group: IssueGroup }) {
  return (
    <section id={group.id} className="scroll-mt-24 pt-14 sm:pt-20">
      <header className="flex items-end gap-5 sm:gap-7">
        {/* The issue numeral in the journal's own citation notation, e.g. 2(2) */}
        <p className="font-display leading-none text-primary">
          <span className="text-6xl sm:text-8xl">{group.volume}</span>
          <span className="text-4xl sm:text-6xl">({group.issueNumber})</span>
        </p>
        <div className="pb-1 sm:pb-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-primary">
            Volume {group.volume} · Issue {group.issueNumber}
          </p>
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-[#52627a]">
            Published {group.publishedLabel} · {group.articles.length}{" "}
            {group.articles.length === 1 ? "article" : "articles"}
          </p>
        </div>
      </header>
      <div className="mt-5 h-[3px] bg-primary" aria-hidden="true" />
      <ul>
        {group.articles.map((article) => (
          <ArticleRow key={article.id} article={article} />
        ))}
      </ul>
    </section>
  );
}

export default function Issues() {
  const groups = buildIssueGroups();
  const navItems = groups.map((group) => ({
    id: group.id,
    label: `${group.volume}(${group.issueNumber})`,
    articleCount: group.articles.length,
  }));

  return (
    <div className="min-h-screen bg-white">
      <Hero
        title="Issues"
        subtitle="The complete archive — every article we have published, by volume and issue."
        sectionClassName="text-left h-auto pb-0!"
        contentClassName="text-left items-start justify-start mt-20!"
      />
      <IssueNav items={navItems} />
      <main className="mx-auto max-w-[1200px] px-4 pb-24 sm:px-6 lg:px-8">
        {groups.map((group) => (
          <IssueSection key={group.id} group={group} />
        ))}
      </main>
    </div>
  );
}
