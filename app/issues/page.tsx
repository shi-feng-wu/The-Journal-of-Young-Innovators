import Link from "next/link";
import Hero from "@/components/Hero";
import ParallaxWatermark from "@/components/ParallaxWatermark";
import { Great_Vibes } from "next/font/google";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
});

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
    issue: "Volume 1, Issue 1",
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
    issue: "Volume 1, Issue 1",
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
    issue: "Volume 1, Issue 1",
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
    issue: "Volume 1, Issue 1",
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
    issue: "Volume 1, Issue 1",
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
    issue: "Volume 1, Issue 1",
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
    issue: "Volume 2, Issue 1",
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
    issue: "Volume 2, Issue 1",
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
    issue: "Volume 2, Issue 1",
  },
  {
    id: 11,
    title: "A Quantitative Analysis of Natural Resource Economics on Global Wealth",
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
    issue: "Volume 2, Issue 1",
  },
];

export default function Issues() {
  const renderGrid = (articles: typeof issue1Articles) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
          aria-label={article.title}
        >
          <article className="relative rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden h-[300px] font-text">
            <div
              className="absolute inset-0 bg-center bg-cover opacity-55 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundImage: `url(${(article as any).image})` }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90"
              aria-hidden="true"
            />
            <div className="relative p-6 h-full flex flex-col justify-start">
              <div className="mb-3">
                <span className="ring-1 ring-default text-white text-xs font-semibold px-2 py-1 mr-0 mx-auto rounded">
                  {article.category}
                </span>
                <br />
                {article.publishDate ? (
                  <span className="text-white/80 text-xs">
                    {new Date(article.publishDate).toLocaleDateString()}
                  </span>
                ) : null}
                {article.publishDate && article.issue ? (
                  <span className="text-white/60 mx-2 text-xs">·</span>
                ) : null}
                {article.issue ? (
                  <span className="text-white/80 text-xs">
                    {article.issue}
                  </span>
                ) : null}
              </div>
              <h3 className="text-lg leading-7 font-semibold text-white mb-2 line-clamp-3">
                {article.title}
              </h3>
              <p className="text-white/90 text-xs line-clamp-1">
                {article.author}
              </p>
              <p className="text-white/80 text-xs mt-2 line-clamp-4">
                {article.abstract}
              </p>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen -mt-16 bg-gradient-to-b from-primary via-primary to-gray-100 relative overflow-hidden">
      <Hero
        title="Issues"
        subtitle="Explore our published issues and articles."
        subtitleClassName="mb-0"
        sectionClassName="pb-0"
        contentClassName="pb-0"
      />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-20 pt-0 pb-30">
        <section className="pb-16">
          {renderGrid(issue1Articles)}
        </section>
      </div>
    </div>
  );
}
