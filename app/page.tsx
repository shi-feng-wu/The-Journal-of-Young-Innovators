import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import SiteButton from "@/components/SiteButton";
import { FaChevronCircleRight } from "react-icons/fa";
import TitleLink from "@/components/TitleLink";

export const metadata: Metadata = {
  title: "JYI | The Journal of Young Innovators",
  description:
    "JYI (The Journal of Young Innovators) publishes student scholarship on leadership, innovation, and AI.",
  alternates: {
    canonical: "/",
  },
};

const allArticles = [
  {
    id: 1,
    title: "The Next Big Arenas of Competition",
    author:
      "Chris Bradley, Michael Chui, Kevin Russell, Kweilin Ellingrud, Michael Birshan, Suhayl Chettih",
    school: "McKinsey Global Institute",
    image: "/images/optimized/arenas-1600.webp",
    abstract: `This report from the McKinsey Global Institute identifies and describes a category of industries that
could account for much of the future change in the business landscape and transform the world. We
call these industries arenas of competition. To identify the arenas of tomorrow, we look back at the
arenas of today to see how they evolved. Arenas are defined by two characteristics: they capture an
outsize share of the economy’s growth, and market share within them changes hands to an outsize
degree. The presence of those two attributes indicates that a new competitive game has begun,
usually prompted by a new bundle of technologies and business models.`,
    publishDate: "2024-10-1",
    category: "Opinion Pieces",
    link: "/articles/Arenas of Competition.pdf",
    volume: "Feature",
  },
  {
    id: 2,
    title:
      "Standing Steady in Shifting Ground: Why Leadership Education Matters for International Students",
    author: "Francella Ochillo, Clara Ma",
    school: "",
    image: "/images/optimized/neuroleadership-1600.webp",
    abstract: `International students in U.S. higher education face increasing uncertainty, not only due to
shifting immigration policy and rising xenophobia, but also due to systemic failures in
institutional support. This article argues that leadership education—when centered on ethics,
creativity, and resilience—is no longer a curriculum enhancement. Drawing on narrative, policy
context, and global ethics scholarship, the piece calls for a reimagining of leadership
development as a core element of higher education and an essential navigational tool for future
leaders. A global moral compass, as defined by Thompson (2010), offers an essential
framework for international students navigating complex and inequitable systems.`,
    publishDate: "2025-04-03",
    category: "Opinion Pieces",
    link: "/articles/Leadership Education.pdf",
    volume: "Vol. 1",
    issue: "Issue 1",
  },
  {
    id: 3,
    title:
      "From Neurons to Leaders: A Brain-Targeted Framework for Leadership Education",
    author: "Mariale Hardiman",
    school: "Johns Hopkins University",
    image: "/images/optimized/leadership-1600.webp",
    abstract: `The rapidly evolving fields of neuroleadership and neuroeducation hold immense potential for
transforming our understanding of effective leadership and learning. While neuroleadership
delves into the neural underpinnings of leadership behaviors and decision-making processes
(Rock & Schwartz, 2006), neuroeducation bridges the gap between neuroscience and education
to optimize learning and cognitive performance (Hardiman, 2012). Despite their distinct origins
and focal points, these two fields converge in their shared objective of translating neuroscience
research into practical strategies for enhancing human performance and development. In this
article, we propose a unified framework that synergizes insights from both domains, leveraging
Dr. Mariale Hardiman's Brain-Targeted Teaching (BTT) model to optimize learning and
leadership development across organizational and educational contexts.
We aim to represent a comprehensive approach to fostering environments that nurture
continuous improvement and innovation in leadership by integrating principles from
neuroleadership, such as emotional intelligence (Goleman, 1998), transformational leadership
(Bass & Riggio, 2006), adaptive leadership (Heifetz et al., 2009), and authentic leadership
(Avolio & Gardner, 2005),
Ultimately, this article seeks to arm leaders with a brain-targeted approach to leadership and
learning, helping them to create impactful experiences that empower individuals to thrive and
realize their full potential.
`,
    publishDate: "2025-04-02",
    category: "Opinion Pieces",
    link: "/articles/Neurons to Leaders.pdf",
    volume: "Vol. 1",
    issue: "Issue 1",
  },
  {
    id: 4,
    title:
      "A Quantitative Analysis of Natural Resource Economics on Global Wealth",
    author: "Andrew Leibowitz",
    school: "Cornell University",
    image: "/images/optimized/agri-1600.webp",
    abstract: `This paper presents a quantitative analysis of the implications of natural resource
economics on global wealth, encompassing an extensive observational study of growth models
from 1970 to 2022 across a diverse set of countries. It scrutinizes the relationships between
natural resource rents (as a percentage of Gross Domestic Product) and natural resource
depletion (relative to Gross National Income), and their correlation with Gross Domestic Product
per capita. The primary aim is to assess whether increased economic prosperity, as derived
from natural resources, aligns with sustainable resource management or exacerbates
environmental degradation. The study utilizes data from The World Bank and employs logistic
regression analysis to explore these relationships. Despite the broad temporal and geographic
scope, preliminary results suggest weak correlations, as indicated by low R² values, which imply
that only a minimal portion of the variance in GDP per capita can be explained by changes in
natural resource rents and depletion percentages. This outcome challenges the efficacy of
current economic models in balancing economic development with environmental stewardship
and suggests a need for further research using more granular data and advanced analytical
models. The findings emphasize the complexity of natural resource economics and the critical
role of innovative policies and management strategies in fostering sustainable economic growth
without compromising environmental integrity.`,
    publishDate: "2026-01-07",
    category: "Research Articles",
    link: "/articles/Natural Resources Economics.pdf",
    volume: "Vol. 2",
    issue: "Issue 1",
  },
  {
    id: 5,
    title:
      "Combat Sports: Friend or Foe to Youth’s Socioemotional and Physical Development?",
    author: "Shane Shuster",
    school: "",
    image: "/images/optimized/boxing-1600.webp",
    abstract: `Combat sports, such as wrestling, boxing, and martials arts, have increased in popularity in
recent years, particularly among young people. This increased attention has been mirrored within
the scholarly literature on combat sports and their effects on young people’s physical and
socioemotional development. The verdict as to whether these impacts have been largely positive
or negative, however, remains mixed. This article details the purported benefits of combat sports
for youth athletes, citing evidence of value cultivation, protective effects against bullying, and
interpersonal competency development. It then proceeds to outline how these competencies
connect to improved academic and professional outcomes. At the same time, however, the article
is careful to acknowledge the negative impacts of youth participation in combat sports. By
examining the physiological and psychological effects of the rapid weight loss often implicitly
promoted by combat sports, this article frames these impacts as decidedly mixed. To sway the
effects more towards the side of benefits than risks, it concludes with concrete recommendations
for intervention. These interventions will ideally guide both policy and practice to help ensure
that combat sports continue to be a positive presence in the lives of young athletes throughout the
world.`,
    publishDate: "2026-01-07",
    category: "Research Articles",
    link: "/articles/Friend or Foe.pdf",
    volume: "Vol. 2",
    issue: "Issue 1",
  },
];

// Featured articles on the homepage
const featuredArticles = allArticles;

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

export default function Home() {
  const articles = featuredArticles.slice(0, 5);
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "JYI | The Journal of Young Innovators",
    alternateName: ["JYI", "The Journal of Young Innovators"],
    url: "https://young-innovator.org",
    logo: "https://young-innovator.org/logolight.png",
    description:
      "A global community of young scholars exploring artificial intelligence and innovation across disciplines.",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "JYI | The Journal of Young Innovators",
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
        title="JYI | The Journal of Young Innovators"
        subtitle="Leadership. Innovation. AI."
        contentClassName="text-center translate-y-6 sm:translate-y-8"
        showWave
        animate
        delay
      />

      <div className="pb-25 mt-30">
        {/* Featured Articles Section */}
        <section className="pb-10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-20">
            <div className=" mb-12"></div>

            {/* Uncontained featured list */}
            {articles.map((article, idx) => {
              const dateObj = article.publishDate
                ? new Date(article.publishDate)
                : null;
              const hasDate = !!(dateObj && !isNaN(dateObj.getTime()));
              const dateStr = hasDate ? dateObj.toLocaleDateString() : "";
              const hasVolume = !!(
                (article as any).volume &&
                (article as any).volume.trim().length > 0
              );
              const hasIssue = !!(
                article.issue && article.issue.trim().length > 0
              );
              const abstractText = clampAtSentence(
                article.abstract,
                ABSTRACT_CHAR_LIMIT,
              );
              return (
                <div
                  key={article.id}
                  className={`border-t border-black/30 last:border-b ${idx === 0 ? "border-t-0" : ""}`}
                >
                  <article className="py-8 md:py-12 font-text">
                    <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_200px] gap-6 md:gap-8 lg:gap-10 items-start lg:items-stretch">
                      <div className="w-full max-w-none lg:max-w-[280px] mx-auto lg:mx-0 h-32 sm:h-40 md:h-48 lg:h-[373px]">
                        <div
                          className="relative w-full h-full bg-center bg-cover"
                          style={{
                            backgroundImage: `url(${(article as any).image})`,
                          }}
                          aria-hidden="true"
                        >
                          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-transparent" />
                          <div className="absolute top-3 right-3 md:top-4 md:right-4 text-right font-mono text-white lg:hidden">
                            {hasVolume && (
                              <div className="text-xs sm:text-sm md:text-base tracking-widest">
                                {(article as any).volume}
                              </div>
                            )}
                            {hasIssue && (
                              <div className="text-xs sm:text-sm md:text-base tracking-widest">
                                {article.issue}
                              </div>
                            )}
                            <div className="mt-2 text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.35em]">
                              {hasDate ? dateStr : ""}
                            </div>
                            <div className="mt-2 text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.35em]">
                              {article.category}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="lg:h-[373px] flex flex-col min-h-0">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black mb-3 md:mb-4 tracking-wide font-display">
                          <TitleLink
                            href={article.link}
                            label={article.title}
                            className="block w-full"
                          />
                        </h3>
                        <p className="text-black/80 font-mono text-sm md:text-base">
                          {article.author}
                        </p>
                        {article.school && (
                          <p className="text-black/70 font-mono text-tiny">
                            {article.school}
                          </p>
                        )}
                        <p className="text-black/70 text-sm md:text-md mt-3 md:mt-4 leading-relaxed font-text flex-1 overflow-hidden">
                          {abstractText}
                        </p>
                      </div>
                      <div className="hidden lg:block font-mono lg:text-right lg:h-full mt-1 lg:mt-0">
                        {hasVolume && (
                          <div className="text-xl sm:text-2xl md:text-3xl tracking-widest">
                            {(article as any).volume}
                          </div>
                        )}
                        {hasIssue && (
                          <div className="text-xl sm:text-2xl md:text-3xl tracking-widest">
                            {article.issue}
                          </div>
                        )}
                        <div className="mt-4 md:mt-6 text-[11px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] md:tracking-[0.4em]">
                          {hasDate ? dateStr : ""}
                        </div>
                        <div className="mt-2 md:mt-3 text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.35em]">
                          {article.category}
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
            <div className="mt-8 flex justify-end">
              <Link href="/issues" className="group">
                <SiteButton
                  className="border-primary text-primary"
                  color="primary"
                  variant="ghost"
                  endContent={
                    <FaChevronCircleRight className="ml-2 text-lg text-current" />
                  }
                >
                  Read Our Issues
                </SiteButton>
              </Link>
            </div>
          </div>
        </section>

        {/** Videos Section (temporarily disabled) */}
        {/* ...existing code... */}
      </div>
    </div>
  );
}
