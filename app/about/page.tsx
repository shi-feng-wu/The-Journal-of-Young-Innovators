import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen -mt-16 bg-gray-100">
      <Hero
        title="About Us"
        subtitle="Learn more about our mission and vision."
      />

      {/* Featured Articles Section */}
      <section className="py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <h2 className="text-2xl md:text-4xl mb-12">Mission Statement</h2>
          <p className="text-sm md:text-md mb-8">
            The Journal of Young Innovators aims to cultivate a global community
            of young scholars exploring the impacts of artificial intelligence
            and innovation across disciplines—including, but not limited to,
            healthcare, ethics, humanities, business, science and technology,
            policy, law, and security—through research and interdisciplinary
            collaboration in a student-led, editorial board–reviewed scientific
            journal.
          </p>
          <p className="text-sm md:text-md mb-8">
            It all began with a vision: we want to prepare the next generation
            to lead in a world increasingly shaped by artificial intelligence.
            As AI accelerates change across every industry and reshapes the very
            fabric of society, the future belongs to those who understand it,
            question it, and build it with purpose. We saw in today’s youth what
            the AI field needs: bold curiosity, ethical sensitivity, and
            interdisciplinary collaboration. Yet, far too often, their voices
            remain unheard, simply because of a lack of meaningful platforms to
            engage in real-world innovation. Born from a deep belief in
            intellectual empowerment and the transformative power of research,
            our platform equips high school students to explore the frontiers of
            AI, innovation and its societal impact. We provide mentorship,
            tools, platform and a global community for purpose-driven learning
            for high school and college students. The future of AI and the
            future of humanity depend on how we cultivate the next generation of
            thinkers, builders, and researchers.
          </p>
        </div>
      </section>
    </div>
  );
}
