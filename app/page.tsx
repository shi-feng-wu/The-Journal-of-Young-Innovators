import Link from "next/link";
import Hero from "@/components/Hero";
import { Button } from "@heroui/react";
import { FaChevronCircleRight } from "react-icons/fa";

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
    category: "Research Articles",
    link: "/articles/Arenas of Competition.pdf",
  },
  {
    id: 2,
    title: "Leadership Education for International Students",
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
    publishDate: "2025-07-20",
    category: "Research Articles",
    link: "/articles/Leadership Education.pdf",
    issue: "Volume 1, Issue 2",
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
    publishDate: "2025-08-20",
    category: "Research Articles",
    link: "/articles/Neurons to Leaders.pdf",
    issue: "Volume 1, Issue 2",
  },
];

// Featured articles on the homepage
const featuredArticles = allArticles;

export default function Home() {
  const articles = featuredArticles; // exactly two

  return (
    <div className="min-h-screen -mt-16 bg-gray-100">
      {/* Hero Section */}
      <Hero
        title="The Journal of Young Innovators"
        subtitle="Leadership. Innovation. AI."
        titleClassName="font-kenao"
        subtitleClassName="font-kenao"
      />

      <div className="pt-10 pb-50">
        {/* Featured Articles Section */}
        <section className="py-10">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-20">
            <div className=" mb-12">
              <h2 className="text-3xl md:text-4xl text-black mb-4">
                Our current articles.
              </h2>
            </div>

            {/* Two featured articles: both use the horizontal layout, one per row on all breakpoints */}
            {articles.map((article, idx) => {
              const right = idx % 2 === 1; // alternate alignment for visual variety
              const dateObj = article.publishDate
                ? new Date(article.publishDate)
                : null;
              const hasDate = !!(dateObj && !isNaN(dateObj.getTime()));
              const dateStr = hasDate ? dateObj.toLocaleDateString() : "";
              const hasIssue = !!(
                article.issue && article.issue.trim().length > 0
              );
              return (
                <div className="mb-8" key={article.id}>
                  <Link
                    href={article.link}
                    target={
                      article.link.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      article.link.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="block group"
                    aria-label={article.title}
                  >
                    <article className="relative rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                      <div
                        className="absolute inset-0 bg-center bg-cover opacity-60 group-hover:opacity-80 transition-opacity"
                        style={{
                          backgroundImage: `url(${(article as any).image})`,
                        }}
                        aria-hidden="true"
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90"
                        aria-hidden="true"
                      />
                      <div className="relative p-8">
                        <div
                          className={`flex flex-col md:flex-row ${right ? "md:flex-row-reverse" : ""} gap-8 md:items-stretch`}
                        >
                          <div
                            className={`md:w-2/3 ${right ? "md:text-right" : ""}`}
                          >
                            <div className="mb-4">
                              <span className="bg-primary text-white text-xs font-semibold px-2 py-1 rounded">
                                {article.category}
                              </span>
                              {hasDate && (
                                <span className="text-white/80 ml-4 text-xs">
                                  {dateStr}
                                </span>
                              )}
                              {hasDate && hasIssue && (
                                <span className="text-white/60 mx-2 text-xs">
                                  ·
                                </span>
                              )}
                              {hasIssue && (
                                <span className="text-white/80 text-xs">
                                  {article.issue}
                                </span>
                              )}
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-2 line-clamp-2">
                              {article.title}
                            </h3>
                            <div className="mb-4">
                              <p className="text-white font-semibold text-sm">
                                {article.author}
                              </p>
                              <p className="text-white/70 text-xs">
                                {article.school}
                              </p>
                            </div>
                            <p className="text-white text-sm mb-3 line-clamp-4 opacity-90 leading-relaxed">
                              {article.abstract}
                            </p>
                          </div>
                          <div className="md:w-1/3 hidden md:block" />
                        </div>
                      </div>
                    </article>
                  </Link>
                </div>
              );
            })}
            <div className="mt-8 flex justify-end">
              <Link href="/issues" className="group">
                <Button
                  className="h-14 font-semibold pl-40 text-md border-primary text-primary group-hover:text-white"
                  color="primary"
                  variant="ghost"
                  endContent={
                    <FaChevronCircleRight className="ml-2 text-lg text-primary group-hover:text-white transition-colors" />
                  }
                >
                  Read Our Issues
                </Button>
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
