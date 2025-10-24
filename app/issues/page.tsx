import Link from "next/link";
import Hero from "@/components/Hero";

const issue1Articles = [
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
];

export default function Issues() {
  const renderGrid = (articles: typeof issue1Articles) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={article.link}
          target={article.link.startsWith("http") ? "_blank" : undefined}
          rel={
            article.link.startsWith("http") ? "noopener noreferrer" : undefined
          }
          className="group block"
          aria-label={article.title}
        >
          <article className="relative rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden h-[300px] ">
            <div
              className="absolute inset-0 bg-center bg-cover opacity-60 group-hover:opacity-80 transition-opacity "
              style={{ backgroundImage: `url(${(article as any).image})` }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90"
              aria-hidden="true"
            />
            <div className="relative p-6 h-full flex flex-col justify-start">
              <div className="mb-3">
                <span className="bg-primary text-white text-xs font-semibold px-2 py-1 mr-0 mx-auto rounded">
                  {article.category}
                </span>
                <br />
                <span className="text-white/80 text-xs">
                  {new Date(article.publishDate).toLocaleDateString()}
                </span>
                <span className="text-white/60 mx-2 text-xs">·</span>
                <span className="text-white/80 text-xs">{article.issue}</span>
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
    <div className="min-h-screen -mt-16 bg-gray-100">
      <Hero
        title="Issues"
        subtitle="Explore our published issues and articles."
        titleClassName="font-kenao"
        subtitleClassName="font-kenao"
      />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-20 py-30">
        <section className="pb-16">
          <h2 className="text-2xl md:text-4xl text-black mb-8">Issue 1</h2>
          {renderGrid(issue1Articles)}
        </section>
      </div>
    </div>
  );
}
