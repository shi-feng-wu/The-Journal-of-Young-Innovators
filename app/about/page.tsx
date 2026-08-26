import Hero from "@/components/Hero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about JYI (The Journal of Young Innovators), our mission, and how we support young scholars in AI and innovation.",
  alternates: {
    canonical: "/about",
  },
};

export default function About() {
  return (
    <div className="min-h-screen  bg-background">
      <Hero title="About" subtitle="Who we are and why we exist." />

      <div className="pb-40 mt-30">
        <section className="pb-10 pt-10">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-20">
            <h2 id="mission" className="text-2xl md:text-4xl mb-6 scroll-mt-24">
              Mission Statement
            </h2>
            <p className="text-sm md:text-md mb-12">
              The Journal of Young Innovators aims to cultivate a global
              community of young scholars exploring the impacts of artificial
              intelligence and innovation across disciplines—including, but not
              limited to, healthcare, ethics, humanities, business, science and
              technology, policy, law, and security—through research and
              interdisciplinary collaboration in a student-led, editorial
              board–reviewed scientific journal.
            </p>

            <h2
              id="aims-and-scope"
              className="text-2xl md:text-4xl mb-6 scroll-mt-24"
            >
              Aims and Scope
            </h2>
            <p className="text-sm md:text-md mb-4">
              The Journal of Young Innovators (JYI) is a peer-reviewed,
              open-access scholarly journal that publishes original research
              articles, literature reviews, and structured interview features
              authored by high school and college students.
            </p>
            <p className="text-sm md:text-md mb-4">
              JYI&apos;s scope spans the impact of artificial intelligence and
              innovation across disciplines, including — but not limited to —
              healthcare, ethics, humanities, business, science and technology,
              policy, law, and security. We welcome interdisciplinary work that
              engages with the social, ethical, technical, or policy dimensions
              of emerging technologies.
            </p>
            <p className="text-sm md:text-md mb-12">
              All accepted manuscripts undergo double-blind peer review and are
              published under a Creative Commons Attribution 4.0 International
              License (CC BY 4.0).
            </p>

            <h2
              id="journal-information"
              className="text-2xl md:text-4xl mb-6 scroll-mt-24"
            >
              Journal Information
            </h2>
            <ul className="text-sm md:text-md mb-12 space-y-1 list-disc pl-6">
              <li>
                <strong>Title:</strong> The Journal of Young Innovators (JYI)
              </li>
              <li>
                <strong>ISSN (Online):</strong> 3070-8885
              </li>
              <li>
                <strong>Publisher:</strong> The Journal of Young Innovators, an
                independent non-profit publishing collaboration
              </li>
              <li>
                <strong>Country of publication:</strong> United States
                (Baltimore, Maryland)
              </li>
              <li>
                <strong>Frequency:</strong> Two issues per year (biannual), with
                continuous online publication of accepted articles
              </li>
              <li>
                <strong>Peer review:</strong> Double-blind peer review
              </li>
              <li>
                <strong>License:</strong> Creative Commons Attribution 4.0
                International (CC BY 4.0)
              </li>
              <li>
                <strong>Fees:</strong> none for the 2025–2026 academic year — no
                submission fees, APCs, or publication fees. From 2026–2027, a
                $65 USD publication fee applies only after acceptance
                (need-based waivers available by request to{" "}
                <a
                  href="mailto:editor@young-innovator.org"
                  className="underline underline-offset-2"
                >
                  editor@young-innovator.org
                </a>
                )
              </li>
              <li>
                <strong>Contact:</strong>{" "}
                <a
                  href="mailto:editor@young-innovator.org"
                  className="underline underline-offset-2"
                >
                  editor@young-innovator.org
                </a>
              </li>
            </ul>

            <h2
              id="about-us"
              className="text-2xl md:text-4xl mb-6 scroll-mt-24"
            >
              About Us
            </h2>
            <p className="text-sm md:text-md mb-8">
              It all began with a vision: we want to prepare the next generation
              to lead in a world increasingly shaped by artificial intelligence.
              As AI accelerates change across every industry and reshapes the
              very fabric of society, the future belongs to those who understand
              it, question it, and build it with purpose.
            </p>
            <p className="text-sm md:text-md mb-8">
              We saw in today’s youth what the AI field needs: bold curiosity,
              ethical sensitivity, and interdisciplinary collaboration. Yet, far
              too often, their voices remain unheard, simply because of a lack
              of meaningful platforms to engage in real-world innovation.
            </p>
            <p className="text-sm md:text-md mb-8">
              Born from a deep belief in intellectual empowerment and the
              transformative power of research, our platform equips high school
              students to explore the frontiers of AI, innovation and its
              societal impact. We provide mentorship, tools, platform and a
              global community for purpose-driven learning for high school and
              college students.
            </p>
            <p className="text-sm md:text-md">
              The future of AI and the future of humanity depend on how we
              cultivate the next generation of thinkers, builders, and
              researchers.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
