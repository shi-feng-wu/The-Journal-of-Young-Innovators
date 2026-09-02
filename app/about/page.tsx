import Hero from "@/components/Hero";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about JYI (The Journal of Young Innovators), our mission, and how we support young scholars in AI and innovation.",
  alternates: {
    canonical: "/about",
  },
};

function AboutSection({
  id,
  title,
  children,
  noTopBorder = false,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  noTopBorder?: boolean;
}) {
  return (
    <section
      id={id}
      className={`${noTopBorder ? "pb-12" : "py-12 border-t border-black/30"} font-text scroll-mt-24`}
    >
      <h2 className="font-display text-2xl md:text-3xl text-black tracking-wide mb-6">
        {title}
      </h2>
      <div className="max-w-[68ch] space-y-5 text-sm md:text-base leading-relaxed text-black/80 [&_a]:underline [&_a]:underline-offset-2">
        {children}
      </div>
    </section>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-background pb-10">
      <Hero title="About" subtitle="Who we are and why we exist." />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-20 pb-10 pt-10">
        <AboutSection id="mission" title="Mission Statement" noTopBorder>
          <p>
            The Journal of Young Innovators aims to cultivate a global community
            of young scholars exploring the impacts of artificial intelligence
            and innovation across disciplines, including but not limited to
            healthcare, ethics, humanities, business, science and technology,
            policy, law, and security, through research and interdisciplinary
            collaboration in a student-led, editorial board–reviewed scientific
            journal.
          </p>
        </AboutSection>

        <AboutSection id="aims-and-scope" title="Aims and Scope">
          <p>
            The Journal of Young Innovators (JYI) is a peer-reviewed,
            open-access scholarly journal that publishes original research
            articles, literature reviews, and structured interview features
            authored by high school and college students.
          </p>
          <p>
            JYI&rsquo;s scope spans the impact of artificial intelligence and
            innovation across disciplines. We welcome interdisciplinary work
            that engages with the social, ethical, technical, or policy
            dimensions of emerging technologies.
          </p>
          <p>
            All accepted manuscripts undergo double-blind peer review and are
            published under a Creative Commons Attribution 4.0 International
            License (CC BY 4.0).
          </p>
        </AboutSection>

        <AboutSection id="journal-information" title="Journal Information">
          <ul className="space-y-1 list-disc pl-6">
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
              <strong>Country of publication:</strong> United States (Baltimore,
              Maryland)
            </li>
            <li>
              <strong>Frequency:</strong> One volume per year, published in two
              issues from Volume 2 (2026) onward. Volume 1 (2024–2025) was
              published as a single issue. Accepted articles are published
              online continuously.
            </li>
            <li>
              <strong>Peer review:</strong>{" "}
              <Link href="/policies#peer-review">
                Double-blind peer review by at least two independent reviewers
              </Link>
            </li>
            <li>
              <strong>License:</strong> Creative Commons Attribution 4.0
              International (CC BY 4.0)
            </li>
            <li>
              <strong>Fees:</strong> none for the 2025–2026 academic year, with
              no submission fees, article processing charges, or publication
              fees. From 2026–2027, a $65 USD publication fee applies only after
              acceptance. See{" "}
              <Link href="/policies#apc">Article Processing Charges</Link> for
              need-based waivers.
            </li>
            <li>
              <strong>Contact:</strong>{" "}
              <a href="mailto:editor@young-innovator.org">
                editor@young-innovator.org
              </a>
            </li>
          </ul>
        </AboutSection>
      </div>
    </div>
  );
}
