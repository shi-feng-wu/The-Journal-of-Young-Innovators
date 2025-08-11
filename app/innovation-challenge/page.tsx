"use client";

import Hero from "@/components/Hero";
import { ContentSection, TableOfContents } from "@/components/PageComponents";
import { FaCalendarAlt, FaLightbulb, FaMedal, FaTrophy } from "react-icons/fa";

export default function InnovationChallenge() {
  const challengeSections = [
    { id: "innovation-case-challenge", title: "Innovation Case Challenge" },
    {
      id: "summer-research-innovation-bootcamp",
      title: "Summer Research & Innovation Bootcamp",
    },
  ];

  return (
    <div className="min-h-screen -mt-16 bg-gray-100 pb-30">
      <Hero
        title="Innovation Challenge Series"
        subtitle="National platforms for high school students to showcase bold ideas and original work in AI, innovation, data ethics, biomedical technologies, and more."
      />

      {/* Main Content Area with TOC as Second Column */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-20 py-30">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
                We're thrilled to announce the Fall 2025 Annual Student Research
                & Innovation Competition—a national platform for 11th and 12th
                grade students to showcase bold ideas and original work in AI,
                innovation, data ethics, biomedical technologies, and more.
              </p>

              <p className="mb-6">
                This year's competition will take the form of a case
                competition, where participants submit both a PowerPoint
                presentation and a final written report. Projects may include
                prototypes, data analyses, literature reviews, or ethical case
                studies exploring the frontiers of emerging technologies.
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
                  <p className="text-gray-600">Competition opens Fall 2025</p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <FaLightbulb className="text-4xl" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    Guidelines
                  </h4>
                  <p className="text-gray-600">
                    Categories, submission guidelines, and deadlines will be
                    announced soon
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <FaMedal className="text-4xl" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    Awards
                  </h4>
                  <p className="text-gray-600">
                    Award results and honorable mentions will be published after
                    final presentations
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
            </ContentSection>
          </div>

          {/* Table of Contents - Takes up 1/4 of the width */}
          <div className="lg:col-span-1">
            <TableOfContents sections={challengeSections} />
          </div>
        </div>
      </div>
    </div>
  );
}
