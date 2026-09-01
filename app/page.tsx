import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import SiteButton from "@/components/SiteButton";
import { FaChevronCircleRight } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import TitleLink from "@/components/TitleLink";
import { parseArticleDate, SITE_ARTICLES } from "@/lib/articles";

export const metadata: Metadata = {
  title: "The Journal of Young Innovators",
  description:
    "Peer-reviewed journal of high school and college student research across disciplines — business, science, humanities, healthcare, policy, and AI.",
  alternates: {
    canonical: "/",
  },
};

const FEATURED_COUNT = 5;

const FULL_DATE = { month: "long", day: "numeric", year: "numeric" } as const;

const ABSTRACT_CHAR_LIMIT = 600;

function clampAtSentence(text: string, maxChars: number) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxChars) return normalized;
  const slice = normalized.slice(0, maxChars);
  const lastStop = Math.max(
    slice.lastIndexOf("."),
    slice.lastIndexOf("!"),
    slice.lastIndexOf("?"),
  );
  if (lastStop > 40) {
    return slice.slice(0, lastStop + 1).trim();
  }
  return `${slice.trim()}…`;
}

/** The five most recent articles, newest first. The lead row carries the
 *  "Feature" label in place of its volume line. */
const featuredArticles = [...SITE_ARTICLES]
  .sort(
    (a, b) =>
      parseArticleDate(b.publishDate).getTime() -
      parseArticleDate(a.publishDate).getTime(),
  )
  .slice(0, FEATURED_COUNT)
  .map((article, idx) => ({
    slug: article.slug,
    title: article.title,
    author: article.author,
    school: article.school ?? "",
    image: article.image ?? "",
    abstract: clampAtSentence(article.abstract, ABSTRACT_CHAR_LIMIT),
    date: parseArticleDate(article.publishDate).toLocaleDateString(
      "en-US",
      FULL_DATE,
    ),
    volume: idx === 0 ? "Feature" : `Vol. ${article.volume}`,
    issue: idx === 0 ? "" : `Issue ${article.issueNumber}`,
    category: article.category,
    href: `/issues/articles/${article.slug}`,
  }));

export default function Home() {
  const articles = featuredArticles;
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "The Journal of Young Innovators",
    alternateName: ["JYI", "The Journal of Young Innovators"],
    url: "https://young-innovator.org",
    logo: "https://young-innovator.org/logodark.png",
    description:
      "A global community of young scholars exploring artificial intelligence and innovation across disciplines.",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "The Journal of Young Innovators",
    alternateName: ["JYI", "The Journal of Young Innovators"],
    url: "https://young-innovator.org",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is JYI?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "JYI stands for The Journal of Young Innovators.",
        },
      },
      {
        "@type": "Question",
        name: "What does JYI publish?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "JYI publishes student scholarship on leadership, innovation, and AI.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Hero Section */}
      <Hero
        variant="cover"
        title="The Journal of Young Innovators"
        subtitle="Leadership. Innovation. AI."
        delay
        additionalContent={
          <div className="flex flex-col items-start gap-6 lg:mt-1.5">
            <p className="font-text text-base lg:text-lg leading-relaxed text-white/85 max-w-[620px]">
              Peer-reviewed research by high school and college students,
              published open access.
            </p>
            <div className="flex flex-wrap items-center gap-x-9 gap-y-4 lg:mt-1.5">
              <SiteButton
                href="/submission"
                color="primary"
                variant="ghost"
                variantStyle="whiteHover"
                className="border-white text-white"
              >
                Submit a Manuscript
              </SiteButton>
              <Link
                href="/issues"
                className="inline-flex items-center gap-2.5 border-b border-white/40 pb-1 font-mono text-[13px] uppercase tracking-[0.16em] text-white/85 transition-colors hover:border-white hover:text-white"
              >
                Read the latest issue
                <FaArrowRight aria-hidden="true" className="text-xs" />
              </Link>
            </div>
          </div>
        }
      />

      <div className="pb-24 mt-28">
        {/* Featured Articles Section */}
        <section className="pb-10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-20">
            {/* Uncontained featured list */}
            {articles.map((article, idx) => {
              const hasVolume = article.volume.length > 0;
              const hasIssue = article.issue.length > 0;
              return (
                <div
                  key={article.slug}
                  className={`border-t border-black/30 last:border-b ${idx === 0 ? "border-t-0" : ""}`}
                >
                  <article className="py-8 md:py-12 font-text">
                    <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_200px] gap-6 md:gap-8 lg:gap-10 items-start lg:items-stretch">
                      <div className="w-full max-w-none lg:max-w-[280px] mx-auto lg:mx-0 h-32 sm:h-40 md:h-48 lg:h-[373px]">
                        <Link
                          href={article.href}
                          tabIndex={-1}
                          aria-hidden="true"
                          className="block w-full h-full"
                        >
                          <div className="relative w-full h-full overflow-hidden">
                            <Image
                              src={article.image}
                              alt={article.title}
                              fill
                              priority={idx === 0}
                              loading={idx === 0 ? undefined : "lazy"}
                              sizes="(min-width: 1024px) 280px, 100vw"
                              className="object-cover object-center"
                            />
                            <div className="absolute inset-0 lg:hidden bg-gradient-to-b from-black/60 via-black/35 to-transparent" />
                            <div className="absolute top-3 right-3 md:top-4 md:right-4 text-right font-mono text-white lg:hidden">
                              {hasVolume && (
                                <div className="text-xs sm:text-sm md:text-base tracking-widest">
                                  {article.volume}
                                </div>
                              )}
                              {hasIssue && (
                                <div className="text-xs sm:text-sm md:text-base tracking-widest">
                                  {article.issue}
                                </div>
                              )}
                              <div className="mt-2 text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.35em]">
                                {article.date}
                              </div>
                              <div className="mt-2 text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.35em]">
                                {article.category}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="lg:min-h-[373px] flex flex-col min-h-0 max-w-[68ch]">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#111] mb-3 md:mb-4 tracking-wide font-display">
                          <TitleLink
                            href={article.href}
                            label={article.title}
                            className="block w-full"
                          />
                        </h3>
                        <p className="text-[#111]/80 font-mono text-sm md:text-base">
                          {article.author}
                        </p>
                        {article.school && (
                          <p className="text-[#111]/70 font-mono text-tiny">
                            {article.school}
                          </p>
                        )}
                        <p className="text-[#111]/70 text-sm md:text-base mt-3 md:mt-4 leading-relaxed font-text flex-1">
                          {article.abstract}
                        </p>
                      </div>
                      <div className="hidden lg:block font-mono text-right h-full">
                        {hasVolume && (
                          <div className="text-xl tracking-widest">
                            {article.volume}
                          </div>
                        )}
                        {hasIssue && (
                          <div className="text-xl tracking-widest">
                            {article.issue}
                          </div>
                        )}
                        <div className="mt-6 text-[11px] uppercase tracking-[0.3em]">
                          {article.date}
                        </div>
                        <div className="mt-3 text-[11px] uppercase tracking-[0.3em]">
                          {article.category}
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
            <div className="mt-8 flex justify-end">
              <SiteButton
                href="/issues"
                className="border-primary text-primary"
                color="primary"
                variant="ghost"
                endContent={
                  <FaChevronCircleRight className="ml-2 text-lg text-current" />
                }
              >
                Read Our Issues
              </SiteButton>
            </div>
          </div>
        </section>

        {/** Videos Section (temporarily disabled) */}
        {/* ...existing code... */}
      </div>
    </div>
  );
}
