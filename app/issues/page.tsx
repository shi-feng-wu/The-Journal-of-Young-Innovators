"use client";

import Hero from "@/components/Hero";
import TitleLink from "@/components/TitleLink";
import {
  parseArticleDate,
  SITE_ARTICLES,
  type SiteArticle,
} from "@/lib/articles";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaChevronCircleRight } from "react-icons/fa";
import { ARTICLE_EXCERPTS } from "./excerpts";

const MONTH_YEAR = { month: "long", year: "numeric" } as const;
const FULL_DATE = { month: "long", day: "numeric", year: "numeric" } as const;

interface IssueGroup {
  key: string;
  label: string;
  labelNoDot: string;
  volShort: string;
  date: string;
  articles: SiteArticle[];
}

/** Group by (volume, issue), keeping SITE_ARTICLES order for groups and rows. */
const ISSUE_GROUPS: IssueGroup[] = (() => {
  const grouped = new Map<string, SiteArticle[]>();

  for (const article of SITE_ARTICLES) {
    const key = `Volume ${article.volume}, Issue ${article.issueNumber}.`;
    const bucket = grouped.get(key);
    if (bucket) bucket.push(article);
    else grouped.set(key, [article]);
  }

  return Array.from(grouped, ([key, articles]) => {
    const latest = articles.reduce<Date | null>((max, article) => {
      const date = parseArticleDate(article.publishDate);
      if (Number.isNaN(date.getTime())) return max;
      return !max || date.getTime() > max.getTime() ? date : max;
    }, null);

    return {
      key,
      label: key,
      labelNoDot: key.replace(/\.$/, ""),
      volShort: `Vol. ${articles[0].volume} / Issue ${articles[0].issueNumber}`,
      date: latest ? latest.toLocaleDateString("en-US", MONTH_YEAR) : "",
      articles,
    };
  });
})();

/** Nav entries: the published issues plus the in-preparation issue, which
    jumps to the closing call-for-submissions banner. */
type IssueNavItem = Pick<
  IssueGroup,
  "key" | "labelNoDot" | "volShort" | "date"
>;

const NAV_ITEMS: IssueNavItem[] = [
  ...ISSUE_GROUPS,
  {
    key: "upcoming-volume-3-issue-1",
    labelNoDot: "Volume 3, Issue 1",
    volShort: "Vol. 3 / Issue 1",
    date: "Coming soon",
  },
];

/** Navy issue header; the published date types itself out once scrolled into view. */
function IssueBanner({ label, date }: { label: string; date: string }) {
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const [typed, setTyped] = useState("");
  const full = date ? `${date}.` : "";

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner || !full) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(full);
      return;
    }

    let interval: ReturnType<typeof setInterval> | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          let index = 0;
          interval = setInterval(() => {
            index += 1;
            setTyped(full.slice(0, index));
            if (index >= full.length && interval) clearInterval(interval);
          }, 75);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(banner);

    return () => {
      observer.disconnect();
      if (interval) clearInterval(interval);
    };
  }, [full]);

  return (
    <div
      ref={bannerRef}
      className="bg-primary text-white flex flex-col gap-3 px-6 py-9 lg:gap-5 lg:px-14 lg:py-16"
    >
      <h2 className="font-display font-normal text-[38px] leading-[1.05] lg:text-[76px] lg:leading-none">
        {label}
      </h2>
      <div className="relative font-mono text-[11px] uppercase tracking-[0.3em] text-white/85 lg:text-[13px] lg:tracking-[0.35em]">
        <p className="sr-only">{date ? `Published ${date}.` : "Published"}</p>
        {/* Invisible full text reserves the final width, so the flex layout
            never re-wraps while the date types itself out. */}
        <span aria-hidden="true" className="invisible">
          Published {full}|
        </span>
        <span aria-hidden="true" className="absolute inset-0">
          Published {typed}
          {typed.length < full.length ? (
            <span className="animate-[cursor-blink_1s_step-end_infinite]">
              |
            </span>
          ) : null}
        </span>
      </div>
    </div>
  );
}

function ArticleRow({ article }: { article: SiteArticle }) {
  const href = `/issues/articles/${article.slug}`;
  const date = parseArticleDate(article.publishDate);
  const volShort = `Vol. ${article.volume} / Issue ${article.issueNumber}`;
  const dateLong = date.toLocaleDateString("en-US", FULL_DATE);

  return (
    <article className="font-text grid border-t border-black/30 py-7 md:grid-cols-[200px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[160px_minmax(0,1fr)_144px] lg:gap-5 lg:py-10 xl:grid-cols-[240px_minmax(0,1fr)_176px] xl:gap-8">
      <Link
        href={href}
        aria-label={article.title}
        className="block h-[200px] w-full md:h-full md:min-h-[200px]"
      >
        <div
          className="h-full w-full bg-center bg-cover"
          style={
            article.image
              ? { backgroundImage: `url(${article.image})` }
              : undefined
          }
        />
      </Link>
      <div className="mt-[18px] min-w-0 md:mt-0">
        <h3 className="mb-2 font-display font-normal text-2xl leading-[1.2] text-[#111] lg:mb-3 lg:text-[30px]">
          <TitleLink
            href={href}
            label={article.title}
            className="block w-full"
            underlineThickness="2px"
          />
        </h3>
        <p className="font-mono text-[13px] text-[#111]/80 lg:text-sm">
          {article.author}
        </p>
        {article.school ? (
          <p className="mt-0.5 font-mono text-[11px] text-[#111]/70 lg:text-xs">
            {article.school}
          </p>
        ) : null}
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#111]/70 lg:hidden">
          <span>{volShort}</span>
          <span>{dateLong}</span>
          <span>{article.category}</span>
        </p>
        <p className="mt-3 line-clamp-4 max-w-[68ch] text-[15px] leading-relaxed text-pretty text-[#111]/70 lg:mt-4 lg:text-base">
          {ARTICLE_EXCERPTS[article.id] ?? article.abstract}
        </p>
      </div>
      <div className="hidden text-right font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-[#111]/70 lg:flex lg:flex-col lg:gap-2.5">
        <span>{volShort}</span>
        <span>{dateLong}</span>
        <span>{article.category}</span>
      </div>
    </article>
  );
}

export default function Issues() {
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showJump, setShowJump] = useState(false);
  const [showJumpBar, setShowJumpBar] = useState(false);

  useEffect(() => {
    const update = () => {
      const sections = sectionRefs.current.filter(
        (section): section is HTMLElement => Boolean(section),
      );
      if (!sections.length) return;

      const isPastFirstIssue = sections[0].getBoundingClientRect().top < 200;
      const isScrolled = window.scrollY > 200;
      // The site footer is anchored to the very bottom of the page, so the
      // fixed mobile bar steps aside once the page bottom is in view.
      const remaining =
        document.documentElement.scrollHeight -
        window.scrollY -
        window.innerHeight;

      let active = 0;
      sections.forEach((section, index) => {
        if (section.getBoundingClientRect().top <= 220) active = index;
      });
      // The closing section is too short to reach the spy line, so the page
      // bottom counts as reaching it.
      if (remaining <= 2) active = sections.length - 1;

      setActiveIndex(active);
      setShowJump(isScrolled);
      setShowJumpBar(isPastFirstIssue && remaining > 96);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const jumpToIssue = (index: number) => {
    const section = sectionRefs.current[index];
    if (!section) return;
    window.scrollTo({
      top: section.getBoundingClientRect().top + window.scrollY - 8,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-background relative">
      <Hero
        title="Issues"
        subtitle="Explore our published issues and articles."
      />

      <div className="mx-auto grid max-w-[1400px] px-4 pt-12 pb-35 sm:px-6 lg:grid-cols-[minmax(0,1fr)_184px] lg:gap-x-8 lg:px-20 lg:pt-14 lg:pb-40 xl:grid-cols-[minmax(0,1fr)_240px] xl:gap-x-12">
        <div>
          {ISSUE_GROUPS.map((issue, index) => (
            <section
              key={issue.key}
              data-issue-section={issue.key}
              ref={(element) => {
                sectionRefs.current[index] = element;
              }}
              className="mt-24 first:mt-0"
            >
              <IssueBanner label={issue.label} date={issue.date} />
              <div className="flex flex-col pt-8 lg:pt-14">
                {issue.articles.map((article) => (
                  <ArticleRow key={article.id} article={article} />
                ))}
                <div className="border-t border-black/30" />
              </div>
            </section>
          ))}

          <section
            ref={(element) => {
              sectionRefs.current[ISSUE_GROUPS.length] = element;
            }}
            className="bg-primary text-white mt-32 flex flex-col gap-4 px-6 py-10 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-10 lg:px-14 lg:py-16"
          >
            <div className="flex flex-col gap-4 lg:max-w-[420px]">
              <h3 className="font-display font-normal text-[30px] leading-[1.15] lg:text-[44px] lg:leading-[1.1]">
                Volume 3, Issue 1 is in preparation.
              </h3>
              <p className="text-[15px] leading-[1.65] text-pretty text-white/85 lg:text-base">
                The Journal of Young Innovators accepts research articles,
                literature reviews, and opinion pieces from high school and
                college students on a rolling basis. Accepted manuscripts
                undergo double-blind peer review and are published continuously
                online.
              </p>
            </div>
            <Link
              href="/submission"
              aria-label="Submit a manuscript"
              className="hover:text-primary mt-2 inline-flex h-[52px] w-full shrink-0 items-center justify-center gap-2 rounded-lg border-2 border-white px-6 font-mono text-[13px] font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-200 hover:bg-white lg:mt-0 lg:h-14 lg:w-auto lg:px-8 lg:text-sm lg:tracking-[0.2em]"
            >
              Submit a Manuscript
              <FaChevronCircleRight className="text-base lg:ml-1 lg:text-lg" />
            </Link>
          </section>
        </div>

        <div className="hidden lg:block">
          <nav
            aria-label="Jump to issue"
            className={`sticky top-[50vh] -translate-y-1/2 transition-opacity duration-300 ${
              showJump ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <div className="border-t border-black/30" />
            {NAV_ITEMS.map((issue, index) => (
              <button
                key={issue.key}
                type="button"
                onClick={() => jumpToIssue(index)}
                tabIndex={showJump ? 0 : -1}
                className="block w-full cursor-pointer border-b border-black/10 py-3.5 text-left"
              >
                <span
                  className={`block font-display text-xl leading-tight transition-colors ${
                    index === activeIndex ? "text-primary" : "text-[#111]/70"
                  }`}
                >
                  {issue.labelNoDot}
                </span>
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.25em] text-[#111]/60">
                  {issue.date}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div
        className={`bg-background fixed inset-x-0 bottom-0 z-40 border-t border-black/30 transition-opacity duration-300 lg:hidden ${
          showJumpBar ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="hide-scrollbar flex gap-7 overflow-x-auto px-5 py-1.5 pr-24">
          {NAV_ITEMS.map((issue, index) => (
            <button
              key={issue.key}
              type="button"
              onClick={() => jumpToIssue(index)}
              tabIndex={showJumpBar ? 0 : -1}
              className={`inline-flex min-h-11 cursor-pointer items-center whitespace-nowrap font-mono text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors ${
                index === activeIndex ? "text-primary" : "text-[#111]/70"
              }`}
            >
              {issue.volShort}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
