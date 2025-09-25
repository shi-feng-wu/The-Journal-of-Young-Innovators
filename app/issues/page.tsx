import Link from "next/link";
import Hero from "@/components/Hero";

// Reuse the same articles for now; later we can extract to a shared module if needed
const allArticles = [
  {
    id: 1,
    title:
      "Religion, Ethics, and Medicine at End of Life: When It Is Acceptable for Physicians to Refuse Care?",
    author: "Guanxi Adam Luo",
    school: "",
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
    publishDate: "2025-06-10",
    category: "Research Articles",
    link: "/articles/Religion End of Life.pdf",
    issue: "Volume 1, Issue 1",
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
    publishDate: "2025-08-20",
    category: "Research Articles",
    link: "/articles/Neurons to Leaders.pdf",
    issue: "Volume 1, Issue 2",
  },
  {
    id: 4,
    title:
      "Meet Your Therapist: Exploring the Promise and Drawbacks of AI for Treating Digital Addictive Behavior among Adolescents",
    author: "Ray Gao",
    school: "",
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
    publishDate: "2025-08-18",
    category: "Research Articles",
    link: "/articles/Meet Your Therapist.pdf",
    issue: "Volume 1, Issue 2",
  },
  {
    id: 5,
    title:
      "Negotiating girl power in contemporary China: Feminist possibilities and contradictions.",
    author: "Ashley Yu, Iris Zhu",
    image: "/images/optimized/feminism-1600.webp",
    abstract: `In recent years, the term girl power (女孩力量) has become increasingly prominent in Chinese  
discourse, yet its meanings remain insufficiently theorized within the country's unique  
sociocultural landscape. This article offers a qualitative literature synthesis to explore how girl  
power is being conceptualized, articulated, and negotiated in contemporary China. Drawing on  
29 qualitative studies published between 2005 and 2024, we use a meta-ethnographic approach  
to identify five overarching themes: Gender Norms & Power Structures, Identity & Self 
Determination, Media Female Imagery, Body Aesthetic Politics, and Social Consumption  
Narratives. Our analysis reveals that girl power in China is neither a straightforward import of  
Western feminist ideals nor a passing pop-cultural trend. Rather, it reflects a dynamic interplay  
between tradition and modernity, digital expression and state control, empowerment and  
commodification. While some narratives challenge patriarchal norms and enable self-expression,  
others risk reinscribing inequality through market-driven “pseudo-feminist” frameworks. We  
argue that girl power in China functions as both a site of agency and a mechanism of social  
regulation, complicating linear understandings of feminist progress. This study contributes to  
feminist theory by situating girl power within China’s hybrid sociopolitical landscape and offers  
a conceptual baseline for future empirical and theoretical inquiry.`,
    publishDate: "2025-05-18",
    category: "Research Articles",
    link: "/articles/Girl Power.pdf",
    issue: "Volume 1, Issue 1",
  },
  {
    id: 6,
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
    publishDate: "2025-08-17",
    category: "Research Articles",
    link: "/articles/Seas Sustainable.pdf",
    issue: "Volume 1, Issue 2",
  },
];

export default function Issues() {
  const issue1 = allArticles.filter((a) => a.issue.includes("Issue 1"));
  const issue2 = allArticles.filter((a) => a.issue.includes("Issue 2"));

  const renderGrid = (articles: typeof allArticles) => (
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
          {renderGrid(issue1)}
        </section>

        <section className="pb-24">
          <h2 className="text-2xl md:text-4xl text-black mb-8">Issue 2</h2>
          {renderGrid(issue2)}
        </section>
      </div>
    </div>
  );
}
