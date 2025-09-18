"use client";

import Hero from "@/components/Hero";
import { ContentSection, TableOfContents } from "@/components/PageComponents";
import { FaCalendarAlt, FaLightbulb, FaMedal, FaTrophy } from "react-icons/fa";

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
    <div className="min-h-screen -mt-16 bg-gray-100 pb-30">
      <Hero
        title="Innovation Challenge Series"
        subtitle="National platforms for high school students and college students to showcase bold ideas and original work in AI, innovation, data ethics, biomedical technologies, and more."
      />

      {/* Main Content Area with TOC as Second Column */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-20 py-30">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-20">
          {/* Main Content - Takes up 3/4 of the width */}
          <div className="lg:col-span-3">
            <ContentSection
              noPadding
              className=""
              title="Innovation Case Challenge"
            >
              <div className="bg-primary text-white rounded-lg p-8 mb-8">
                <div className="flex items-center gap-8 justify-center">
                  <FaTrophy className="text-3xl" />
                  <h3 className="text-3xl font-bold">
                    Fall 2025 Student Research & Innovation Competition
                  </h3>
                </div>
              </div>

              <p className="mb-6">
                We’re thrilled to announce the Fall 2025 Annual Student Research
                & Innovation Competition—a national platform for high school and
                college students to showcase bold ideas and original work in AI,
                social innovation, ethics, biomedical technologies, and more.
                Proudly sponsored by the Johns Hopkins Ding Lab, this year’s
                competition will take the form of a case competition, where
                participants submit both a PowerPoint presentation and a final
                written report.
              </p>

              <p className="mb-6">
                Projects may include prototypes, data analyses, literature
                reviews, or ethical case studies exploring the frontiers of
                emerging technologies.
              </p>

              <p className="mb-6">
                Finalists will present their work to a panel of distinguished
                judges from academia and industry. Top teams will be recognized
                with awards, publication opportunities, and mentorship offers.
              </p>

              <p className="mb-8">
                Whether you're investigating AI in mental health, proposing a
                biotech solution, or evaluating ethical implications in data
                science—this is your stage to be seen, celebrated, and
                supported.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <FaCalendarAlt className="text-4xl" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    Timeline
                  </h4>
                  <ul className="text-gray-600 space-y-1 text-left">
                    <li>Sep 15, 2025: Applications open</li>
                    <li>Nov 15, 2025: Submission deadline</li>
                    <li>Jan 3, 2025: Preliminary selection of finalists</li>
                    <li>Feb 23, 2026: Final competition (online)</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <FaLightbulb className="text-4xl" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    Categories & Guidelines
                  </h4>
                  <ul className="text-gray-600 space-y-1 text-left">
                    <li>Artificial Intelligence & Data Science</li>
                    <li>Biomedical & Health Technologies</li>
                    <li>Ethics & Society</li>
                    <li>Innovation & Entrepreneurship</li>
                  </ul>
                  <div className="mt-3 text-gray-600 text-left">
                    <p className="mb-1">Teams of 2–4; HS or undergraduate.</p>
                    <p>Submit 12-slide PPT and 2,000–3,000 word report.</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <FaMedal className="text-4xl" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    Awards
                  </h4>
                  <p className="text-gray-600">
                    Top teams receive Certificates of Excellence and publication
                    opportunities; honorable mentions recognized for creativity,
                    impact, and rigor.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    How to Apply
                  </h4>
                  <p className="text-gray-600 mb-3">
                    Submit your application through our online portal (link to
                    be provided) or email us directly at{" "}
                    <a
                      href="mailto:clara.ma@inceptionconsulting.org"
                      className="text-primary underline"
                      aria-label="Email us your application"
                    >
                      this email
                    </a>
                    . Include a 250–300 word abstract outlining your idea,
                    approach, and significance.
                  </p>
                  <p className="text-gray-600">
                    Format: Entirely online to allow national participation.
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Fees</h4>
                  <p className="text-gray-600">
                    Application fee: $500 per team. Fee waiver available upon
                    request for students with financial need.
                  </p>
                </div>
              </div>
            </ContentSection>

            <ContentSection title="Summer Research & Innovation Bootcamp">
              <p className="mb-6">
                Our Summer Research & Innovation Bootcamp is an intensive,
                hands-on experience designed for curious and driven high school
                students (grades 9–12) who want to explore real-world problems
                through research, innovation, and leadership.
              </p>

              <p className="mb-8">
                Held over 2–4 weeks during the summer virtually, the camp
                combines:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-lg shadow-lg p-10">
                  <h3 className="text-xl font-bold text-black mb-4">
                    Program Components
                  </h3>
                  <ul className="space-y-3 text-gray">
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
                </div>

                <div className="bg-white rounded-lg shadow-lg p-10">
                  <h3 className="text-xl font-bold text-black mb-4">
                    What You'll Gain
                  </h3>
                  <ul className="space-y-3 text-gray">
                    <li>Deeper understanding of academic research</li>
                    <li>A polished and publication-ready project</li>
                    <li>Confidence to pursue future STEM opportunities</li>
                    <li>College preparation and application support</li>
                    <li>Network of peers and mentors</li>
                  </ul>
                </div>
              </div>

              <p className="mb-6">
                Students will leave this experience with a deeper understanding
                of academic research, a polished and publication-ready project,
                and the confidence to pursue future opportunities in STEM,
                policy, innovation, and beyond. Whether you're preparing for
                college, aiming for a journal publication, or ready to launch
                your first big idea, this is the summer to take your potential
                seriously.
              </p>

              <p className="">
                All of our mentors and bootcamp trainers are renowned university
                professors, each holding a Ph.D. and active appointments at top
                institutions. They bring cutting-edge expertise, real-world
                insights, and a deep commitment to nurturing the next generation
                of thinkers and leaders.
              </p>
              <p className="">
                For more information email{" "}
                <a
                  href="mailto:clara.ma@inceptionconsulting.org"
                  className="text-primary underline"
                  aria-label="Email us for more information"
                >
                  our team
                </a>
                .
              </p>
            </ContentSection>

            <ContentSection
              title="Occupation Health in Music"
              id="Occupation Health in Music"
            >
              <p>
                Visit our affiliated initiative:{" "}
                <a
                  className="text-primary underline"
                  href="https://occupationalhealthinmusic.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OccupationalHealthinMusic.org
                </a>
              </p>
            </ContentSection>
          </div>

          {/* Table of Contents - hidden on small screens */}
          <div className="hidden lg:block lg:col-span-1">
            <TableOfContents sections={challengeSections} />
          </div>
        </div>
      </div>
    </div>
  );
}
