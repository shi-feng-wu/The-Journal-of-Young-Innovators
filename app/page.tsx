import Link from "next/link";
import Hero from "@/components/Hero";

// Featured articles pulled from uploaded Word docs. Place the files in /public/articles with these filenames.
const featuredArticles = [
  {
    id: 1,
    title:
      "Religion, Ethics, and Medicine at End of Life: When It Is Acceptable for Physicians to Refuse Care?",
    author: "Luo, G. (Adam)",
    school: "",
    abstract: `In this article, the author considers physicians’ right to refuse to participate in or offer
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
    publishDate: "2025-09-16",
    category: "Humanities",
    link: "/articles/adam-religion-and-medicine-article-pdf.pdf",
  },
  {
    id: 2,
    title: "Leadership Education for International Students",
    author: "Ma, C. F.",
    school: "",
    abstract: `International students in U.S. higher education face increasing uncertainty, not only due to
shifting immigration policy and rising xenophobia, but also due to systemic failures in
institutional support. This article argues that leadership education—when centered on ethics,
creativity, and resilience—is no longer a curriculum enhancement. Drawing on narrative, policy
context, and global ethics scholarship, the piece calls for a reimagining of leadership
development as a core element of higher education and an essential navigational tool for future
leaders. A global moral compass, as defined by Thompson (2010), offers an essential
framework for international students navigating complex and inequitable systems.`,
    publishDate: "2025-09-16",
    category: "Education",
    link: "/articles/leadership-education-for-international-students.pdf",
  },
  {
    id: 3,
    title: "Girl Power",
    author: "Zhu, I., & Yu, A.",
    school: "",
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
    publishDate: "2025-09-16",
    category: "Society",
    link: "/articles/girl-power.pdf",
  },
  {
    id: 4,
    title: "Neuroleadership and Neuroeducation",
    author: "Hardiman, M., & Ma, C. F.",
    school: "Johns Hopkins University",
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
    publishDate: "2025-09-16",
    category: "Neuroscience",
    link: "/articles/neuroleadership-and-neuroeducation.pdf",
  },
  {
    id: 5,
    title:
      "Meet Your Therapist: Exploring the Promise and Drawbacks of AI for Treating Digital Addictive Behavior among Adolescents",
    author: "Gao, R.",
    school: "",
    abstract: `Within the public health domain, one of greatest concerns is the rise of addictive behavior among
adolescents and young adults. Questions have been raised as to how excessive video gaming,
social media overuse of misuse, and online gambling, for instance, present deleterious effects to
this population’s psychological well-being as well as their overall development. In light of these
concerns, public health officials, policymakers, and mental health professionals have set out to
explore effective interventions designed to address this issue and improve this population’s
quality of life and health outcomes. Due to its widespread accessibility, low-cost, relative
anonymity, and room for personalization and user engagement, artificial intelligence (AI) is one
such intervention currently being explored. This paper therefore joins the ongoing conversation
on the potential of AI as a mental health tool used to treat addiction behavior, but is also careful
to consider areas of concern in its application. Reviewing and synthesizing the existing literature
on this topic thus allows this paper to offer the view that although AI should not be used in lieu
of human mental health providers, it can serve as an auxiliary resource that complements
existing approaches to provide more comprehensive care to those in need.`,
    publishDate: "2025-09-16",
    category: "Research",
    link: "/articles/ray-gao-palo.pdf",
  },
  {
    id: 6,
    title:
      "Fostering Hope through Hoops: The Potential of Basketball Sports Diplomacy",
    author: "Zhu, E. , & Zhu, H.",
    school: "",
    abstract: `This article examines the potential of basketball to be used as a form of sports diplomacy. The
article argues that U.S.-China relations have soured over the past few decades, with relations
between the two countries becoming notably more tense amidst rising tariffs issued against each.
The authors show that basketball has a longstanding history in each country, as well as a
widespread following, making it an ideal candidate for assisting in achieving diplomatic goals.
The article points out that more traditional diplomatic negotiations have failed, presenting an
opportunity for the “backdoor” negotiations that sports diplomacy can foster. To make this
argument, this article provides a historical overview of successful cases of sports diplomacy,
citing previous examples like the Olympic Games and the FIFA World Cup. It is careful to
acknowledge the drawbacks of sports diplomacy as well, presenting the reader with a balanced
understanding of what this political tool can and cannot do.`,
    publishDate: "2025-09-16",
    category: "Sports Analytics",
    link: "/articles/basketball-paper-jul-23.pdf",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen -mt-16 bg-gray-100">
      {/* Hero Section */}
      <Hero
        title="The Journal of Young Innovators"
        subtitle="Leadership. Innovation. AI."
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

            {/* First Article - Full Width Left Aligned */}
            <div className="mb-8">
              <Link
                href={featuredArticles[0].link}
                target={
                  featuredArticles[0].link.startsWith("http")
                    ? "_blank"
                    : undefined
                }
                rel={
                  featuredArticles[0].link.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="block group"
                aria-label={featuredArticles[0].title}
              >
                <article className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="md:w-2/3">
                      <div className="mb-4">
                        <span className="bg-primary text-white text-xs font-semibold px-2 py-1 rounded">
                          {featuredArticles[0].category}
                        </span>
                        <span className="text-black ml-4 text-xs">
                          {new Date(
                            featuredArticles[0].publishDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-2xl font-semibold text-black mb-2 line-clamp-2">
                        {featuredArticles[0].title}
                      </h3>
                      <div className="mb-4">
                        <p className="text-black font-semibold text-sm">
                          {featuredArticles[0].author}
                        </p>
                        <p className="text-black opacity-70 text-xs">
                          {featuredArticles[0].school}
                        </p>
                      </div>
                      <p className="text-black text-sm mb-3 line-clamp-4 opacity-80 leading-relaxed">
                        {featuredArticles[0].abstract}
                      </p>
                    </div>
                    <div className="md:w-1/3">
                      <div className="bg-cinereous h-64 rounded-lg"></div>
                    </div>
                  </div>
                </article>
              </Link>
            </div>

            {/* Second Article - Full Width Right Aligned */}
            <div className="mb-8">
              <Link
                href={featuredArticles[1].link}
                target={
                  featuredArticles[1].link.startsWith("http")
                    ? "_blank"
                    : undefined
                }
                rel={
                  featuredArticles[1].link.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="block group"
                aria-label={featuredArticles[1].title}
              >
                <article className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
                  <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
                    <div className="md:w-2/3 md:text-right">
                      <div className="mb-4">
                        <span className="bg-primary text-white text-xs font-semibold px-2 py-1 rounded">
                          {featuredArticles[1].category}
                        </span>
                        <span className="text-black ml-4 text-xs">
                          {new Date(
                            featuredArticles[1].publishDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-2xl font-semibold text-black mb-2 line-clamp-2">
                        {featuredArticles[1].title}
                      </h3>
                      <div className="mb-4">
                        <p className="text-black font-semibold text-sm">
                          {featuredArticles[1].author}
                        </p>
                        <p className="text-black opacity-70 text-xs">
                          {featuredArticles[1].school}
                        </p>
                      </div>
                      <p className="text-black text-sm mb-3 line-clamp-4 opacity-80 leading-relaxed">
                        {featuredArticles[1].abstract}
                      </p>
                    </div>
                    <div className="md:w-1/3">
                      <div className="bg-cinereous h-64 rounded-lg"></div>
                    </div>
                  </div>
                </article>
              </Link>
            </div>

            {/* Remaining Articles - Four Cards in a Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredArticles.slice(2).map((article) => (
                <Link
                  key={article.id}
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
                  <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="p-4">
                      <div className="mb-3">
                        <span className="bg-primary text-white text-xs font-semibold px-2 py-1 rounded">
                          {article.category}
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="text-black text-xs">
                          {new Date(article.publishDate).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-black mb-2 line-clamp-2">
                        {article.title}
                      </h3>

                      <div className="mb-3">
                        <p className="text-black font-semibold text-sm">
                          {article.author}
                        </p>
                        <p className="text-black opacity-70 text-xs">
                          {article.school}
                        </p>
                      </div>

                      <p className="text-black text-sm mb-3 line-clamp-4 opacity-80 leading-relaxed">
                        {article.abstract}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Videos Section */}
        <section className="py-10">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-20">
            <div className=" mb-8">
              <h2 className="text-3xl md:text-4xl text-black mb-4">Videos</h2>
              <p className="text-foreground/70">
                From our scholars and students.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((v) => (
                <div
                  key={v}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-video bg-gray-200 flex items-center justify-center text-gray-500">
                    Video Placeholder
                  </div>
                  <div className="p-4">
                    <h3 className="text-black font-semibold mb-1">
                      Featured Talk #{v}
                    </h3>
                    <p className="text-foreground/70 text-sm">
                      Scholar/Student spotlight video.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
