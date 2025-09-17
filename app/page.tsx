import Link from "next/link";
import Hero from "@/components/Hero";
import { getCategoryBackground } from "@/utils/categoryBackgrounds"; // kept as fallback if an article image is missing

// Featured articles pulled from uploaded Word docs. Place the files in /public/articles with these filenames.
// Base article list (full set) - removed Girl Power and Hoops from display per request below
const allArticles = [
  {
    id: 1,
    title:
      "Religion, Ethics, and Medicine at End of Life: When It Is Acceptable for Physicians to Refuse Care?",
    author: "Luo, G. (Adam)",
    school: "",
    image: "/images/optimized/ethics-1600.webp",
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
    category: "Ethics & Society",
    link: "/articles/adam-religion-and-medicine-article-pdf.pdf",
  },
  {
    id: 2,
    title: "Leadership Education for International Students",
    author: "Ma, C. F.",
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
    publishDate: "2025-09-16",
    category: "Leadership & Education",
    link: "/articles/leadership-education-for-international-students.pdf",
  },
  {
    id: 3,
    title: "Neuroleadership and Neuroeducation",
    author: "Hardiman, M. & Ma, C. F.",
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
    publishDate: "2025-09-16",
    category: "Neuroscience & Cognitive Science",
    link: "/articles/neuroleadership-and-neuroeducation.pdf",
  },
  {
    id: 4,
    title:
      "Meet Your Therapist: Exploring the Promise and Drawbacks of AI for Treating Digital Addictive Behavior among Adolescents",
    author: "Gao, R.",
    school: "",
    image: "/images/optimized/therapy-800.webp",
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
    category: "Technology & Innovation",
    link: "/articles/ray-gao-palo.pdf",
  },
];

// Articles to display on homepage (filtered)
const featuredArticles = allArticles; // currently all after removal

export default function Home() {
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

            {/* Four Full-Width Alternating Articles */}
            {featuredArticles.map((article, idx) => {
              const right = idx % 2 === 1; // alternate alignment
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
                        className="absolute inset-0 bg-center bg-cover opacity-40 group-hover:opacity-50 transition-opacity"
                        style={{
                          backgroundImage: `url(${(article as any).image || getCategoryBackground(article.category)})`,
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
                              <span className="text-white/80 ml-4 text-xs">
                                {new Date(
                                  article.publishDate
                                ).toLocaleDateString()}
                              </span>
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
          </div>
        </section>

        {/** Videos Section (temporarily disabled)
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
        */}
      </div>
    </div>
  );
}
