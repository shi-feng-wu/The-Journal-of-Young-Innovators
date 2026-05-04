"use client";

import Hero from "@/components/Hero";
import SiteButton from "@/components/SiteButton";
import TitleLink from "@/components/TitleLink";
import TypingText from "@/components/TypingText";
import { toArticleViewerHref } from "@/lib/articlePdfViewer";
import NumberFlow, { NumberFlowGroup } from "@number-flow/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaChevronCircleRight, FaChevronDown } from "react-icons/fa";

const issue1Articles = [
  {
    id: 10,
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
    volume: 1,
    issueNumber: 1,
  },
  {
    id: 1,
    title:
      "From Neurons to Leaders: A Brain-Targeted Framework for Leadership Education",
    author: "Mariale Hardiman",
    school: "Johns Hopkins University",
    image: "/images/optimized/leadership-800.webp",
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
    volume: 1,
    issueNumber: 1,
  },
  {
    id: 2,
    title:
      "Standing Steady in Shifting Ground: Why Leadership Education Matters for International Students",
    author: "Francella Ochillo, Clara Ma",
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
    link: "/articles/Standing Steady.pdf",
    volume: 1,
    issueNumber: 1,
  },
  {
    id: 3,
    title:
      "Religion, Ethics, and Medicine at End of Life: When It Is Acceptable for Physicians to Refuse Care?",
    author: "Guanxi Adam Luo",
    image: "/images/optimized/ethics-1600.webp",
    abstract: `In this article, the author considers physicians' right to refuse to participate in or offer
end-of-life care that includes medically assisted death. The author argues that physicians, like
patients, are guided by religious and more beliefs, and they do have a right to refuse medically
assisted death services if they violate their religious beliefs or moral convictions. To make this
case, the author reviews the historical relationship between religion and medicine, looking at
how the modern medical system came to be. This helps set the stage for understanding how these
two aspects of society affect end-of-life care. Landmark cases in the Right-to-Die movement are
presented to further illustrate how religious beliefs affect the care that a person receives at the
end of life. After reviewing possible reasons that a physician may object on religious grounds,
the author then provides recommendations that honor both the free will of the patient and the
physician.`,
    publishDate: "2025-04-05",
    category: "Research Articles",
    link: "/articles/Religion.pdf",
    volume: 1,
    issueNumber: 1,
  },
  {
    id: 4,
    title:
      "Meet Your Therapist: Exploring the Promise and Drawbacks of AI for Treating Digital Addictive Behavior among Adolescents",
    author: "Ray Gao",
    image: "/images/optimized/therapy-800.webp",
    abstract: `Within the public health domain, one of greatest concerns is the rise of addictive behavior among
adolescents and young adults. Questions have been raised as to how excessive video gaming,
social media overuse of misuse, and online gambling, for instance, present deleterious effects to
this population's psychological well-being as well as their overall development. In light of these
concerns, public health officials, policymakers, and mental health professionals have set out to
explore effective interventions designed to address this issue and improve this population's
quality of life and health outcomes. Due to its widespread accessibility, low-cost, relative
anonymity, and room for personalization and user engagement, artificial intelligence (AI) is one
such intervention currently being explored. This paper therefore joins the ongoing conversation
on the potential of AI as a mental health tool used to treat addiction behavior, but is also careful
to consider areas of concern in its application. Reviewing and synthesizing the existing literature
on this topic thus allows this paper to offer the view that although AI should not be used in lieu
of human mental health providers, it can serve as an auxiliary resource that complements
existing approaches to provide more comprehensive care to those in need.`,
    publishDate: "2025-04-08",
    category: "Research Articles",
    link: "/articles/Meet Your Therapist.pdf",
    volume: 1,
    issueNumber: 1,
  },
  {
    id: 5,
    title:
      "Making Our Seas Sustainable: Examining Iceland’s Maritime Sector through a Commercial, Legal, and Ethical Lens",
    author: "Jiahong Julia Fu, Siyi Lisa Feng",
    image: "/images/optimized/iceland-1600.webp",
    abstract: `Through the introduction of a tri-part framework focused on commercial, legal, and ethical 
considerations, this article examines the case of Iceland’s fishing industry to explore key 
concepts of sustainability. The article focuses on the fishing sector, specifically, as it is poised to 
grow exponentially in the coming years, as the world looks to more eco-friendly alternatives for 
land-based meat (e.g., beef, pork). Iceland was selected as the ideal case study for exploring 
these concepts because not only is the fishing sector well-established within the nation, but 
because the country’s industry has incorporated environmental, social, and governance (ESG) 
standards into its operations. Iceland’s fisheries demonstrate ecological stewardship through the 
use of a monitoring system that collects data on the total number and type of species caught, 
utilizing all parts of the fish and minimizing waste, and employing responsible harvesting 
methods. They exemplify social responsibility by adopting fair labor laws at the federal level that 
protect temporary and foreign workers and engaging in responsible marketing and ecolabeling. 
While Icelandic fisheries are presented as pioneers in sustainable business, this discussion also 
attends to areas for improvement, including issues pertaining to equal access to fishing rights 
among smaller or newer companies and concerns for animal welfare in farm-raised fishing and 
open-water catches. However, both the areas where Iceland’s fishing industry excels and falls 
short represent key considerations that can ideally be applied to a variety of other cultural contexts and economic sectors so that true sustainability is no longer seen as bound by region or 
industry.`,
    publishDate: "2025-04-10",
    category: "Research Articles",
    link: "/articles/Seas Sustainable.pdf",
    volume: 1,
    issueNumber: 1,
  },
  {
    id: 6,
    title:
      "The Plastic Problem: The Ecological and Epidemiological Implications of Bacteria-Plastic Relationships",
    author: "Albert Zhou",
    image: "/images/optimized/bacteria-1600.webp",
    abstract: `This article reviews scholarly literature examining bacteria-plastic interactions to provide
insights into the global plastic pollution crisis. Using a PRISMA approach, this review identified
and analyzed peer-reviewed studies across multiple databases, including Web of Science,
Science Direct, and Google Scholar.`,
    publishDate: "2025-04-15",
    category: "Research Articles",
    link: "/articles/The Plastic Problem.pdf",
    volume: 1,
    issueNumber: 1,
  },
  {
    id: 7,
    title:
      "Foul on the Play: Legal Discretion in Cases Brought Against Professional Athletes",
    author: "Cole Shuster",
    image: "/images/optimized/basketball-800.webp",
    abstract: `This article offers an in-depth look at three high-profile legal cases in which professional athletes
were charged with a crime. By examining the cases of football players Henry Ruggs III and
Rashee Rice, as well as Olympic wrestler Kyle Snyder, this comparative analysis explores how
social and financial capital, institutional response, and media framing all influence the legal
process for such elite athletes. Through this exploration, it aims to provide an implicit answer to
the question, “Is justice really blind?” By comprehensively investigating the details of each case,
this study explores the degree to which the confounding variables of material resources, severity
of the resulting harm, and prospect of rehabilitation influences legal outcomes. It furthermore
argues that there is another parallel punitive system at play, as relevant institutions and
professional sports associations administer their own set of consequences, which may or may not
align with legal proceedings and public opinion. It concludes by offering recommendations for
the development of a more equitable justice system, one which is more evenly applied across
social strata.`,
    publishDate: "2026-01-07",
    category: "Research Articles",
    link: "/articles/Foul on the Play.pdf",
    volume: 2,
    issueNumber: 1,
  },
  {
    id: 8,
    title:
      "Combat Sports: Friend or Foe to Youth’s Socioemotional and Physical Development?",
    author: "Shane Shuster",
    image: "/images/optimized/boxing-800.webp",
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
    volume: 2,
    issueNumber: 1,
  },
  {
    id: 9,
    title:
      "Beyond the Fairway: Access, Equity, and Inclusion in the New Golf Economy",
    author: "Aaron Xu",
    image: "/images/optimized/golf-1600.webp",
    abstract: `This article examines how shifts in golf’s business model and cultural profile are reshaping
access to the sport, with particular attention to affordability, public infrastructure, and who
benefits from the industry’s growth. It evaluates barriers to entry, the role of municipal courses
and youth programs, and the impact of new capital on community access. The piece argues that
expansion alone is insufficient without intentional equity and inclusion strategies that ensure the
new golf economy serves a broader and more diverse public.`,
    publishDate: "2026-01-22",
    category: "Research Articles",
    link: "/articles/Beyond the Fairway.pdf",
    volume: 2,
    issueNumber: 1,
  },
  {
    id: 11,
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
    volume: 2,
    issueNumber: 1,
  },
  {
    id: 12,
    title:
      "Lessons from Arthur Miller's The Crucible: The Consequences of Merging Government and Religion",
    author: "Kate Wheeler",
    school: "State College Area High School",
    image: "/images/optimized/crucible-1600.webp",
    abstract: `This perspective piece interrogates the implications of merging religious doctrine with
government authority. Using both literary analysis of Arthur Miller’s The Crucible and drawing
upon contemporary case studies, this paper argues that theoretical influence over legal systems
incites widespread fear, undermines the tenet of due process, and promotes systemic injustice.
The three illustrative case studies to be presented here include Stone v. Graham, the Taliban
government in Afghanistan, and the proposed policy framework Project 2025. These different
examples are collectively used to examine a wide range of government-state relations, from
constitutional separation to full theocracy. The Stone v. Graham case upholds the separation of
church and state in public schools. The Afghan example, on the other hand, serves as a direct
contrast, demonstrating how religious doctrine’s impact on federal law results in severe
restrictions to women’s rights. Finally, Project 2025 shows how religious influence may exert a
more indirect but nonetheless consequential impact in a U.S. context. Findings from the analysis
of these cases is used to advance the argument that maintaining a clear separation between
church and state is essential for preserving democratic principles, protecting individual rights,
and ensuring equitable governance`,
    publishDate: "2026-04-28",
    category: "Research Articles",
    link: "/articles/The Crucible.pdf",
    volume: 2,
    issueNumber: 2,
  },
];

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
            article.publishDate ? new Date(article.publishDate) : null,
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
                          backgroundImage: `url(${(article as any).image})`,
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
                              ? new Date(
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
