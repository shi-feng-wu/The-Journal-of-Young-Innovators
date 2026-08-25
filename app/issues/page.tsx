"use client";

import Hero from "@/components/Hero";
import SiteButton from "@/components/SiteButton";
import TitleLink from "@/components/TitleLink";
import TypingText from "@/components/TypingText";
import { toArticleViewerHref } from "@/lib/articlePdfViewer";
import { SITE_ARTICLES, parseArticleDate } from "@/lib/articles";
import NumberFlow, { NumberFlowGroup } from "@number-flow/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaChevronCircleRight, FaChevronDown } from "react-icons/fa";

// All article data lives in app/lib/articles.ts — this page only renders it.
const issue1Articles = SITE_ARTICLES.map((article) => ({
  id: article.id,
  title: article.title,
  author: article.author,
  school: article.school,
  image: article.image,
  abstract: article.abstract,
  publishDate: article.publishDate,
  category: article.category,
  link: article.pdfPath,
  volume: article.volume,
  issueNumber: article.issueNumber,
}));

export default function Issues() {
  const lenis = useLenis();
  const pinSectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIssue, setActiveIssue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const issueStartsRef = useRef<Array<{ issue: string; offset: number }>>([]);

  const groupedByIssue = useMemo(
    () =>
      issue1Articles.reduce(
        (acc, article) => {
          const issueKey =
            article.volume && article.issueNumber
              ? `Volume ${article.volume}, Issue ${article.issueNumber}.`
              : "Other";
          acc[issueKey] = acc[issueKey]
            ? [...acc[issueKey], article]
            : [article];
          return acc;
        },
        {} as Record<string, typeof issue1Articles>,
      ),
    [],
  );
  const issueEntries = useMemo(
    () => Object.entries(groupedByIssue),
    [groupedByIssue],
  );
  const firstDateByIssue = useMemo(
    () =>
      issueEntries.reduce<Record<string, string>>((acc, [issue, articles]) => {
        const latestDate = articles
          .map((article) =>
            article.publishDate ? parseArticleDate(article.publishDate) : null,
          )
          .filter((date): date is Date => Boolean(date))
          .reduce<Date | null>((maxDate, date) => {
            if (Number.isNaN(date.getTime())) return maxDate;
            if (!maxDate) return date;
            return date.getTime() > maxDate.getTime() ? date : maxDate;
          }, null);
        acc[issue] =
          latestDate && !Number.isNaN(latestDate.getTime())
            ? latestDate.toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })
            : "";
        return acc;
      }, {}),
    [issueEntries],
  );

  const activeIssueNumber = useMemo(() => {
    const match = activeIssue.match(/Issue\s*(\d+)/i);
    return match ? Number(match[1]) : null;
  }, [activeIssue]);

  const activeVolumeNumber = useMemo(() => {
    const match = activeIssue.match(/Volume\s*(\d+)/i);
    return match ? Number(match[1]) : null;
  }, [activeIssue]);

  const [displayIssue, setDisplayIssue] = useState("");

  useEffect(() => {
    if (activeIssue) {
      setDisplayIssue(activeIssue);
    } else {
      setDropdownOpen(false);
    }
  }, [activeIssue]);

  const displayIssueNumber = useMemo(() => {
    const match = displayIssue.match(/Issue\s*(\d+)/i);
    return match ? Number(match[1]) : null;
  }, [displayIssue]);

  const displayVolumeNumber = useMemo(() => {
    const match = displayIssue.match(/Volume\s*(\d+)/i);
    return match ? Number(match[1]) : null;
  }, [displayIssue]);

  useEffect(() => {
    if (!lenis) return;

    const setIssuesFooterPinned = (isPinned: boolean) => {
      window.dispatchEvent(
        new CustomEvent("issues-first-row-pin", {
          detail: { isPinned },
        }),
      );
    };

    setIssuesFooterPinned(false);

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const pinSection = pinSectionRef.current;
      if (!track || !pinSection) return;

      const scrollDistance = Math.max(0, track.scrollWidth - track.clientWidth);

      if (scrollDistance <= 0) return;

      const issueStarts = Array.from(
        track.querySelectorAll<HTMLElement>("[data-issue-start='true']"),
      ).map((el) => ({
        issue: el.dataset.issue ?? "",
        offset: el.offsetLeft,
      }));
      issueStartsRef.current = issueStarts;

      const updateActiveIssue = () => {
        const x = Math.abs(gsap.getProperty(track, "x") as number) || 0;
        const midpoint = x + track.clientWidth / 2;
        const current = issueStarts.reduce(
          (acc, item) => (item.offset <= midpoint ? item.issue : acc),
          issueStarts[0]?.issue ?? "",
        );
        setActiveIssue(current);
      };

      const tween = gsap.to(track, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: pinSection,
          start: "bottom 94%",
          end: `+=${scrollDistance}`,
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
          onToggle: (self) => setIssuesFooterPinned(self.isActive),
          onUpdate: updateActiveIssue,
          onEnter: updateActiveIssue,
          onEnterBack: updateActiveIssue,
          onLeave: () => {
            setActiveIssue("");
            setIssuesFooterPinned(false);
          },
          onLeaveBack: () => {
            setActiveIssue("");
            setIssuesFooterPinned(false);
          },
        },
      });
      stRef.current = tween.scrollTrigger ?? null;
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onLenisScroll);

    return () => {
      stRef.current = null;
      setIssuesFooterPinned(false);
      window.removeEventListener("resize", onResize);
      lenis.off("scroll", onLenisScroll);
      ctx.revert();
    };
  }, [lenis, issueEntries]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  const scrollToIssue = (issue: string) => {
    setDropdownOpen(false);
    const st = stRef.current;
    if (!st || !lenis) return;
    const issueData = issueStartsRef.current.find((i) => i.issue === issue);
    const offset = issueData?.offset ?? 0;
    lenis.scrollTo(st.start + offset, { duration: 1.2 });
  };

  const renderScrollableRow = () => (
    <div ref={pinSectionRef} className="relative">
      <div className="overflow-hidden">
        <div ref={trackRef} className="flex gap-6 pb-4">
          {issueEntries.flatMap(([issue, articles], issueIndex) =>
            articles.map((article, articleIndex) => {
              const articleViewerHref = toArticleViewerHref(article.link);

              return (
                <article
                  key={article.id}
                  data-issue-start={articleIndex === 0 ? "true" : undefined}
                  data-issue={articleIndex === 0 ? issue : undefined}
                  className={`relative text-black overflow-hidden font-text w-[88vw] max-w-[30rem] sm:w-[40rem] sm:max-w-none lg:w-150 h-135 flex-shrink-0 ${
                    issueIndex === 0 && articleIndex === 0 ? "" : "pl-6"
                  }`}
                >
                  {(issueIndex !== 0 || articleIndex !== 0) && (
                    <span className="absolute left-0 top-1/2 h-3/5 w-px -translate-y-1/2 bg-black/30" />
                  )}
                  <div className="grid h-full grid-cols-1 md:grid-cols-[240px_minmax(0,1fr)] gap-6 p-6">
                    <Link
                      href={articleViewerHref}
                      aria-label={article.title}
                      className="block w-full h-32 sm:h-40 md:h-full"
                    >
                      <div
                        className="relative w-full h-full bg-center bg-cover"
                        style={{
                          backgroundImage: `url(${article.image ?? "/og-image.png"})`,
                        }}
                        aria-hidden="true"
                      >
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
                        <div className="absolute top-4 right-4 text-right font-mono text-white">
                          {article.volume && article.issueNumber ? (
                            <div className="text-sm md:text-base tracking-widest mb-0">
                              {`Volume ${article.volume}, Issue ${article.issueNumber}`}
                            </div>
                          ) : null}
                          <div className="mt-2 text-[10px] uppercase tracking-[0.35em]">
                            {article.publishDate
                              ? parseArticleDate(
                                  article.publishDate,
                                ).toLocaleDateString()
                              : ""}
                          </div>
                          <div className="mt-2 text-[10px] uppercase tracking-[0.35em]">
                            {article.category}
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="flex flex-col min-h-0 min-w-0">
                      <h3 className="text-2xl font-semibold text-black mb-3 tracking-wide font-display whitespace-normal break-words">
                        <TitleLink
                          href={articleViewerHref}
                          label={article.title}
                          className="block w-full"
                          underlineThickness="2px"
                        />
                      </h3>
                      <p className="text-black/80 font-mono text-sm whitespace-normal break-words">
                        {article.author}
                      </p>
                      {article.school && (
                        <p className="text-black/70 font-mono text-tiny whitespace-normal break-words">
                          {article.school}
                        </p>
                      )}
                      <p className="text-black/70 mt-3 leading-relaxed font-text text-sm line-clamp-11 whitespace-normal break-words">
                        {article.abstract}
                      </p>
                    </div>
                  </div>
                </article>
              );
            }),
          )}
          <article className="relative text-black overflow-hidden font-text w-[100vw] max-w-[30rem] sm:w-[40rem] sm:max-w-none lg:w-150 flex-shrink-0">
            <span className="absolute left-0 top-1/2 h-4/5 w-px -translate-y-1/2 bg-black/30" />
            <div className="h-full p-6 flex items-center">
              <div className="w-full h-full p-8 md:p-10 flex flex-col justify-center">
                <div className="space-y-2 md:space-y-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-black/70 leading-none">
                    Next Issue
                  </p>
                  <h3 className="font-display text-3xl md:text-4xl tracking-wide leading-[1.08]">
                    More issues coming soon.
                  </h3>
                  <p className="text-black/75 text-sm md:text-base leading-6 md:leading-7 font-mono max-w-[40ch]">
                    Have an article, paper, or idea worth publishing? We’re
                    accepting new submissions now.
                  </p>
                </div>
                <div className="mt-6 md:mt-7">
                  <Link
                    href="/submission"
                    aria-label="Submit your article"
                    className="group"
                  >
                    <SiteButton
                      className="border-primary text-primary"
                      color="primary"
                      variant="ghost"
                      endContent={
                        <FaChevronCircleRight className="ml-1 text-lg text-current" />
                      }
                    >
                      Submissions
                    </SiteButton>
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-background relative overflow-hidden">
      <div className="pointer-events-none fixed inset-x-0 top-12 sm:top-10 lg:top-8 z-20">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-14 text-right">
          <div
            className="relative inline-block pointer-events-auto"
            ref={dropdownRef}
          >
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className={`focus:outline-none flex items-center gap-2 group cursor-pointer transition-opacity duration-300 ease-out ${
                activeIssue
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
              aria-expanded={dropdownOpen}
              aria-haspopup="listbox"
              aria-hidden={!activeIssue}
              tabIndex={activeIssue ? 0 : -1}
            >
              <NumberFlowGroup>
                <div
                  style={
                    {
                      "--number-flow-char-height": "0.85em",
                    } as React.CSSProperties
                  }
                  className="text-4xl xs:text-6xl lg:text-7xl leading-none font-display text-black whitespace-nowrap"
                >
                  {displayVolumeNumber !== null &&
                  displayIssueNumber !== null ? (
                    <>
                      <NumberFlow
                        value={displayVolumeNumber}
                        prefix="Volume "
                        suffix=", "
                      />
                      <NumberFlow
                        value={displayIssueNumber}
                        suffix="."
                        prefix="Issue "
                      />
                    </>
                  ) : (
                    displayIssue
                  )}
                </div>
              </NumberFlowGroup>
              <FaChevronDown
                className={`text-black ml-3 mt-1 text-xl sm:text-2xl lg:text-3xl shrink-0 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {dropdownOpen && (
              <div
                role="listbox"
                className="absolute right-0 top-full mt-2 bg-white shadow-xl rounded-xl py-1 z-50 min-w-55 border border-black/10"
              >
                {issueEntries.map(([issue]) => (
                  <button
                    key={issue}
                    role="option"
                    aria-selected={activeIssue === issue}
                    onClick={() => scrollToIssue(issue)}
                    className={`w-full text-left px-5 py-3 font-display text-base tracking-wide hover:bg-black/5 transition-colors ${
                      activeIssue === issue
                        ? "text-primary font-semibold"
                        : "text-black"
                    }`}
                  >
                    {issue.replace(/\.$/, "")}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div
            className={`-mt-0.5 text-[11px] sm:text-sm font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] text-black/80 transition-opacity duration-300 ease-out ${
              activeIssue ? "opacity-100" : "opacity-0"
            }`}
          >
            <span>Published </span>
            <TypingText
              text={
                activeIssue ? `${firstDateByIssue[activeIssue] ?? ""}.` : ""
              }
              speed={75}
              cursor={true}
            />
          </div>
        </div>
      </div>
      <Hero
        title="Issues"
        subtitle="Explore our published issues and articles."
        sectionClassName="mb-16!"
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-14 pt-20 ">
        <section>{renderScrollableRow()}</section>
      </div>
    </div>
  );
}
