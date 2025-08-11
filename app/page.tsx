import Link from "next/link";

// Sample articles data - replace with real data
const featuredArticles = [
  {
    id: 1,
    title: "The Next Big Arenas of Competition",
    author:
      "Chris Bradley, Michael Chui, Kevin Russell, Kweilin Ellingrud et al.",
    school: "McKinsey Global Institute",
    abstract:
      "Arenas are industries that transform the business landscape. Eighteen future arenas could reshape the global economy and generate $29 trillion to $48 trillion in revenues by 2040.",
    publishDate: "2024-01-01",
    category: "Economic Research",
    link: "https://www.mckinsey.com/~/media/mckinsey/mckinsey%20global%20institute/our%20research/the%20next%20big%20arenas%20of%20competition/the-next-big-arenas-of-competition_final.pdf",
  },
  {
    id: 2,
    title: "Machine Learning Applications in Climate Change Mitigation",
    author: "Marcus Johnson",
    school: "MIT Early College",
    abstract:
      "Analyzing how machine learning algorithms can optimize renewable energy distribution...",
    publishDate: "2024-12-10",
    category: "Environmental Science",
    link: `/articles/2`,
  },
  {
    id: 3,
    title: "The Future of AI in Education: Student-Led Innovation",
    author: "Priya Patel",
    school: "Harvard-Westlake School",
    abstract:
      "Investigating personalized learning platforms and their effectiveness in diverse educational settings...",
    publishDate: "2024-12-05",
    category: "Education Technology",
    link: `/articles/3`,
  },
  {
    id: 4,
    title: "Blockchain and AI: Securing Data in the Digital Age",
    author: "Alex Rivera",
    school: "Phillips Exeter Academy",
    abstract:
      "A comprehensive analysis of how blockchain technology can enhance AI security protocols...",
    publishDate: "2024-11-28",
    category: "Cybersecurity",
    link: `/articles/4`,
  },
  {
    id: 5,
    title: "AI-Powered Mental Health Support: Opportunities and Challenges",
    author: "Emma Thompson",
    school: "Stuyvesant High School",
    abstract:
      "Examining the role of artificial intelligence in providing accessible mental health resources...",
    publishDate: "2024-11-20",
    category: "Mental Health",
    link: `/articles/5`,
  },
  {
    id: 6,
    title: "Autonomous Vehicles and Urban Planning: A Student's Vision",
    author: "David Kim",
    school: "Thomas Jefferson High School",
    abstract:
      "Exploring how self-driving cars will reshape city infrastructure and transportation systems...",
    publishDate: "2024-11-15",
    category: "Urban Technology",
    link: `/articles/6`,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen -mt-16 bg-gray-100">
      {/* Hero Section */}
      <section className="bg-primary text-white pb-20 pt-30">
        <div className="max-w-7xl px-4 ml-[8%] sm:px-6 lg:px-8 py-20">
          <div className="">
            <h1 className="text-4xl md:text-6xl mb-6">
              The Journal of Young Innovators
            </h1>
            <h2 className="text-xl md:text-2xl mb-8 opacity-90">
              Leadership. Innovation. AI.
            </h2>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-20 pb-40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-20">
          <div className=" mb-12">
            <h2 className="text-3xl md:text-4xl text-black mb-4">
              Current Articles
            </h2>
          </div>

          {/* First Article - Full Width Left Aligned */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-2/3">
                  <div className="mb-4">
                    <span className="bg-primary text-white text-sm font-semibold px-3 py-1 rounded">
                      {featuredArticles[0].category}
                    </span>
                    <span className="text-black ml-4 text-sm">
                      {new Date(
                        featuredArticles[0].publishDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-semibold text-black mb-4">
                    {featuredArticles[0].title}
                  </h3>
                  <div className="mb-4">
                    <p className="text-black font-semibold text-lg">
                      {featuredArticles[0].author}
                    </p>
                    <p className="text-black opacity-70">
                      {featuredArticles[0].school}
                    </p>
                  </div>
                  <p className="text-black mb-6 text-lg leading-relaxed">
                    {featuredArticles[0].abstract}
                  </p>
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
                    className="text-black hover:opacity-70 font-semibold text-lg"
                  >
                    Read Full Article →
                  </Link>
                </div>
                <div className="md:w-1/3">
                  <div className="bg-cinereous h-64 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Second Article - Full Width Right Aligned */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
                <div className="md:w-2/3 md:text-right">
                  <div className="mb-4">
                    <span className="bg-primary text-white text-sm font-semibold px-3 py-1 rounded">
                      {featuredArticles[1].category}
                    </span>
                    <span className="text-black ml-4 text-sm">
                      {new Date(
                        featuredArticles[1].publishDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-semibold text-black mb-4">
                    {featuredArticles[1].title}
                  </h3>
                  <div className="mb-4">
                    <p className="text-black font-semibold text-lg">
                      {featuredArticles[1].author}
                    </p>
                    <p className="text-black opacity-70">
                      {featuredArticles[1].school}
                    </p>
                  </div>
                  <p className="text-black mb-6 text-lg leading-relaxed">
                    {featuredArticles[1].abstract}
                  </p>
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
                    className="text-black hover:opacity-70 font-semibold text-lg"
                  >
                    Read Full Article →
                  </Link>
                </div>
                <div className="md:w-1/3">
                  <div className="bg-cinereous h-64 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Remaining Articles - Four Cards in a Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArticles.slice(2).map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
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
                    className="text-black hover:opacity-70 font-semibold text-xs"
                  >
                    Read Full Article →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
