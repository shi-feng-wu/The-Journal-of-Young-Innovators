"use client";

import Hero from "@/components/Hero";
import { Image, Link } from "@heroui/react";
import { TableOfContents } from "@/components/PageComponents";
import { ReactNode } from "react";

function EditorialSection({
  id,
  title,
  children,
  noTopBorder = false,
}: {
  id: string;
  title: string;
  children: ReactNode;
  noTopBorder?: boolean;
}) {
  return (
    <section
      id={id}
      className={`${noTopBorder ? "pb-12" : "py-12 border-t border-black/30"} scroll-mt-24 font-text`}
    >
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="font-display text-3xl md:text-4xl text-black">
          {title}
        </h2>
      </div>
      <div className="space-y-5 text-sm md:text-base leading-relaxed text-black/80">
        {children}
      </div>
    </section>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="border-t border-black/30 pt-5">
      <div className="mb-4">
        <h3 className="font-display text-2xl text-black">{title}</h3>
      </div>
      <div className="font-text text-black/80 leading-relaxed [&_p]:text-sm [&_li]:text-sm md:[&_p]:text-base md:[&_li]:text-base [&_strong]:font-semibold [&_.card-subheading]:text-sm md:[&_.card-subheading]:text-base [&_.card-subheading]:font-semibold [&_.card-subheading]:text-black">
        {children}
      </div>
    </article>
  );
}

export default function ScholarlyEvent() {
  const challengeSections = [
    { id: "innovation-case-challenge", title: "Innovation Case Challenge" },
    {
      id: "summer-research-innovation-bootcamp",
      title: "Summer Research & Innovation Bootcamp",
    },
    {
      id: "occupational-health-in-music",
      title: "Occupational Health in Music",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <Hero
        title="Innovation Challenge Series"
        subtitle="Competitions and summer programs for high school and college student researchers."
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-20 pb-10 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 md:gap-14 lg:gap-20">
          <div className="lg:col-span-3">
            <EditorialSection
              id="innovation-case-challenge"
              title="Innovation Case Challenge"
              noTopBorder
            >
              <div className="bg-primary text-white p-6 md:p-8 mb-8">
                <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 justify-center">
                  <div className="flex items-center gap-3">
                    <Link
                      href="https://dinglab.jh.edu/"
                      isExternal
                      aria-label="Visit Ding Lab website"
                      className="inline-flex"
                    >
                      <Image
                        className="h-10 sm:h-12 w-auto object-contain"
                        src={"/images/logos/dinglab.png"}
                        alt="Ding Lab"
                      />
                    </Link>
                    <Link
                      href="https://www.jhu.edu"
                      isExternal
                      aria-label="Visit Johns Hopkins University website"
                      className="inline-flex"
                    >
                      <Image
                        className="h-10 sm:h-12 w-auto object-contain brightness-0 invert"
                        src={"/images/logos/jhu.png"}
                        alt="Johns Hopkins University"
                      />
                    </Link>
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl text-center">
                    Fall 2025 Student Research & Innovation Competition
                  </h3>
                </div>
              </div>

              <div className="space-y-5 mb-8">
                <p>
                  The Fall 2025 Annual Student Research & Innovation Competition
                  was a national competition for high school and college
                  students working in AI, social innovation, ethics, biomedical
                  technologies, and related fields. It was sponsored by the
                  Johns Hopkins Ding Lab and run as a case competition, so
                  participants submitted both a PowerPoint presentation and a
                  final written report.
                </p>

                <p>
                  Entries could take the form of prototypes, data analyses,
                  literature reviews, or ethical case studies on emerging
                  technologies.
                </p>

                <p>
                  Finalists presented their work to a panel of judges from
                  academia and industry. Top teams received awards, publication
                  opportunities, and mentorship offers.
                </p>
              </div>

              <InfoCard title="Timeline">
                <ol className="relative ml-1 border-l border-black/20 pl-6 space-y-5">
                  <li className="relative">
                    <span className="absolute -left-[1.9rem] top-1.5 h-3 w-3 rounded-full bg-primary" />
                    <p className="card-subheading">Dec 15, 2025</p>
                    <p>Applications opened</p>
                  </li>
                  <li className="relative">
                    <span className="absolute -left-[1.9rem] top-1.5 h-3 w-3 rounded-full bg-primary" />
                    <p className="card-subheading">Mar 1, 2026</p>
                    <p>Submission deadline</p>
                  </li>
                  <li className="relative">
                    <span className="absolute -left-[1.9rem] top-1.5 h-3 w-3 rounded-full bg-primary" />
                    <p className="card-subheading">Apr 3rd, 2026</p>
                    <p>Preliminary selection of finalists</p>
                  </li>
                  <li className="relative">
                    <span className="absolute -left-[1.9rem] top-1.5 h-3 w-3 rounded-full bg-primary" />
                    <p className="card-subheading">May 1st, 2026</p>
                    <p>Final competition (online presentations)</p>
                  </li>
                </ol>
              </InfoCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 items-start">
                <InfoCard title="Categories & Guidelines">
                  <div className="space-y-4">
                    <div>
                      <p className="card-subheading">
                        Innovation & Future Solutions
                      </p>
                      <p>
                        Creative concepts, prototypes, new products, emerging
                        technologies, sustainability ideas, disruptive business
                        models, platforms, and ventures across any industry
                        (education, environment, finance, culture, energy,
                        space, etc.).
                      </p>
                    </div>
                    <div>
                      <p className="card-subheading">
                        Science, Technology & Human Advancement
                      </p>
                      <p>
                        Research, applied science, AI, engineering, design
                        thinking, human performance, neuroscience,
                        biotechnology, AR/VR, climate tech, urban design:
                        anything that pushes knowledge or capability forward.
                      </p>
                    </div>
                    <div>
                      <p className="card-subheading">
                        Society, Policy & Ethics
                      </p>
                      <p>
                        Ideas tackling real-world issues: governance, digital
                        equity, legal frameworks, global challenges, public
                        health, social innovation, ethics, human rights, future
                        of work, cultural inclusion.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="mb-1">
                      Teams of 2–4, high school or undergraduate.
                    </p>
                    <p>
                      Each team submitted a 12-slide presentation and a
                      2,000–3,000 word report.
                    </p>
                  </div>
                </InfoCard>

                <InfoCard title="Awards & Recognition">
                  <ul className="space-y-2 list-disc pl-5">
                    <li>
                      First Place: USD $3,000, Certificate of Excellence, and
                      publication opportunity
                    </li>
                    <li>
                      Second Place: USD $1,500, Certificate of Excellence, and
                      publication opportunity
                    </li>
                    <li>
                      Third Place: USD $800, Certificate of Excellence, and
                      publication opportunity
                    </li>
                  </ul>
                  <p className="mt-3">
                    Selected projects were also eligible to be featured in the
                    Student Research & Innovation Digest.
                  </p>
                  <p className="mt-3">
                    Honorable Mentions were recognized as well.
                  </p>
                </InfoCard>
              </div>

              <p className="mt-8">
                Questions about the competition can go to{" "}
                <a
                  href="mailto:editor@young-innovator.org"
                  className="text-primary underline"
                >
                  editor@young-innovator.org
                </a>
                .
              </p>
            </EditorialSection>

            <EditorialSection
              id="summer-research-innovation-bootcamp"
              title="Summer Research & Innovation Bootcamp"
            >
              <p>
                Our Summer Research & Innovation Bootcamp is a hands-on program
                for high school students in grades 9–12 who want to work on
                real-world problems through research.
              </p>

              <p>
                The camp runs online over 2–4 weeks during the summer and
                includes:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <InfoCard title="Program Components">
                  <ul className="space-y-2 list-disc pl-5">
                    <li>
                      Faculty-led workshops on AI, biomedical innovation,
                      ethics, and data science
                    </li>
                    <li>
                      Research skill-building in writing, analysis, and critical
                      thinking
                    </li>
                    <li>Mentored group projects and presentations</li>
                    <li>
                      Guest talks from university researchers and industry
                      professionals
                    </li>
                    <li>Optional track: AI Case Challenge accelerator</li>
                  </ul>
                </InfoCard>

                <InfoCard title="What You'll Gain">
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Deeper understanding of academic research</li>
                    <li>A polished and publication-ready project</li>
                    <li>Confidence to pursue future STEM opportunities</li>
                    <li>College preparation and application support</li>
                    <li>Network of peers and mentors</li>
                  </ul>
                </InfoCard>
              </div>

              <p>
                Our mentors and bootcamp trainers are university professors,
                each holding a Ph.D. and an active appointment at a top
                institution.
              </p>
              <p>
                For more information,{" "}
                <a
                  href="mailto:editor@young-innovator.org"
                  className="text-primary underline"
                  aria-label="Email us for more information"
                >
                  editor@young-innovator.org
                </a>
                .
              </p>
            </EditorialSection>

            <EditorialSection
              id="occupational-health-in-music"
              title="Occupational Health in Music"
            >
              <p>
                This Global Occupational Health Summit in Tertiary Music
                Institutions, offered as a Pre-Conference Event to the
                Performing Arts Medicine Association’s International Symposium
                in Washington, D.C., brings together scholars and experts to
                address the pressing need for health promotion, education,
                research, and professional accountability in higher music
                education. The program highlights the importance of specialized
                training for healthcare providers, the development of tailored
                care protocols, and the use of measurable outcomes to meet the
                unique health challenges musicians face. The summit advocates
                for tertiary music institutions to assume responsibility for
                safe learning environments and to recognize occupational health
                as an essential area of knowledge and competency for all
                musicians. Visit:{" "}
                <a
                  className="text-primary underline"
                  href="https://occupationalhealthinmusic.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OccupationalHealthinMusic.org
                </a>
                .
              </p>
            </EditorialSection>
          </div>

          <div className="hidden lg:block lg:col-span-1">
            <TableOfContents sections={challengeSections} />
          </div>
        </div>
      </div>
    </div>
  );
}
