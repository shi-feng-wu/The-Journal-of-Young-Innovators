"use client";

import Hero from "@/components/Hero";
import { ContentSection, TableOfContents } from "@/components/PageComponents";

export default function Home() {
  const submissionSections = [
    { id: "selectivity", title: "Selectivity" },
    { id: "who-can-submit", title: "Who Can Submit" },
    { id: "what-you-can-submit", title: "What You Can Submit" },
    { id: "submission-rules", title: "Submission Rules" },
    { id: "formatting-requirements", title: "Formatting Requirements" },
    { id: "review-process", title: "Review Process" },
    {
      id: "article-processing-charges-apc",
      title: "Article Processing Charges",
    },
    { id: "fast-track-review-optional", title: "Fast Track Review" },
    { id: "need-help", title: "Need Help?" },
  ];

  return (
    <div className="min-h-screen -mt-16 bg-gray-100 pb-30">
      <Hero
        title="Submission Guidelines"
        subtitle="We welcome submissions from high school students who are
              passionate about academic inquiry and eager to contribute to
              meaningful scholarship. Our editorial board includes experienced
              researchers, educators, and editors dedicated to helping young
              scholars grow through rigorous feedback and mentorship."
      />

      {/* Main Content Area with TOC as Second Column */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-20 py-30">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-20">
          {/* Main Content - Takes up 3/4 of the width */}
          <div className="lg:col-span-3">
            <ContentSection noPadding className="" title="Selectivity">
              <p>
                We are a highly competitive journal that upholds rigorous
                academic standards, not every submission will be accepted.
                However, our goal is to nurture intellectual curiosity and
                academic growth among the youth. We value innovative thinking,
                strong writing, and a genuine commitment to meaningful research.
                Each submission is carefully reviewed by a team of editors and
                subject experts. While we cannot accept every paper, we are
                committed to giving each student a fair opportunity. If your
                work shows promise, we may offer revision requests to help
                strengthen your submission.
              </p>
            </ContentSection>

            <ContentSection title="Who Can Submit">
              <p>
                The first author must be a student currently enrolled in an
                accredited high school or college.
              </p>
            </ContentSection>

            <ContentSection title="What You Can Submit">
              <p className="mb-4">
                <strong>Original Research Articles: </strong> In-depth research
                papers presenting novel findings, supported by data, analysis,
                and scholarly references.
              </p>
              <p className="mb-4">
                <strong>Literature Reviews: </strong> Comprehensive evaluations
                of existing research on a focused topic, highlighting key
                trends, gaps, and future directions.
              </p>
              <p>
                <strong>Interview Features: </strong> Thoughtfully crafted
                interviews with technology leaders (e.g., CEOs, founders),
                presented in a journalistic or academic style that provides
                insight into innovation, leadership, and emerging trends in the
                tech industry.
              </p>
            </ContentSection>

            <ContentSection title="Submission Rules">
              <ul>
                <li>
                  No dual submissions: Submitting the same paper to multiple
                  journals at once is considered unethical.
                </li>
                <li>The manuscript must be original and unpublished.</li>
                <li>
                  All manuscripts are reviewed by our editorial and academic
                  team, who assess academic rigor, clarity, and integrity.
                </li>
                <li>
                  The manuscript must be submitted in Microsoft Word (.docx)
                  format. PDFs or Google Docs will not be accepted.
                </li>
              </ul>
            </ContentSection>

            <ContentSection title="Formatting Requirements">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* File Format & Layout */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-black mb-4">
                    File Format & Layout
                  </h3>
                  <ul className="space-y-2 text-gray ">
                    <li>
                      <strong>Format:</strong> Microsoft Word (.docx)
                    </li>
                    <li>
                      <strong>Maximum:</strong> 20 pages (8.5" x 11", US Letter)
                    </li>
                    <li>
                      <strong>Margins:</strong> 1 inch on all sides
                    </li>
                    <li>
                      <strong>Font:</strong> Times New Roman, 10 pt,
                      single-spaced
                    </li>
                  </ul>
                </div>

                {/* Headings */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-black mb-4">
                    Headings
                  </h3>
                  <ul className="space-y-2 text-gray">
                    <li>
                      <strong>Title:</strong> Bold, 18 pt
                    </li>
                    <li>
                      <strong>Main Headings:</strong> Bold, 14 pt
                    </li>
                    <li>
                      <strong>Subheadings:</strong> 12 pt
                    </li>
                    <li>
                      <strong>Subsubheadings:</strong> Italic, 12 pt
                    </li>
                  </ul>
                </div>

                {/* Visuals */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-black mb-4">
                    Visuals
                  </h3>
                  <ul className="space-y-2 text-gray">
                    <li>
                      <strong>Tables:</strong> Use Word's table tool (not
                      images)
                    </li>
                    <li>
                      <strong>Figures:</strong> Centered, clearly titled, within
                      text
                    </li>
                    <li>
                      <strong>Image formats:</strong> .png or .jpg
                    </li>
                    <li>
                      Upload images separately with descriptive filenames.
                    </li>
                  </ul>
                </div>

                {/* Other Specifications */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-black mb-4">
                    Other Specifications
                  </h3>
                  <ul className="space-y-2 text-gray">
                    <li>
                      <strong>Abstract:</strong> Up to 250 words
                    </li>
                    <li>
                      <strong>Title:</strong> Maximum 100 characters
                    </li>
                    <li>
                      <strong>References:</strong> APA 7th edition preferred
                    </li>
                    <li>Include URLs or DOIs for online sources.</li>
                  </ul>
                </div>
              </div>
            </ContentSection>

            <ContentSection title="Review Process">
              <ul>
                <li>Submissions undergo double-blind peer review.</li>
                <li>Editorial feedback provided within 4–8 weeks.</li>
                <li>Accepted papers may be revised before publication.</li>
              </ul>
            </ContentSection>

            <ContentSection title="Article Processing Charges (APC)">
              <p className="mb-8">
                We are a mission-driven, open-access journal committed to making
                high-quality student research accessible to a global audience.
                To support the costs of editing, peer review, indexing, and
                digital hosting, we charge a two-stage fee:
              </p>
              <ul className="text-lg md:text-xl mb-8">
                <li>
                  <strong>Submission Fee:</strong> $50 – Due at the time of
                  submission.
                </li>
                <li>
                  <strong>Publication Fee:</strong> $300 – Due upon acceptance
                  after peer review.
                </li>
              </ul>
              <p>
                Need-based scholarships are available by request. Applicants may
                submit a brief statement of need during the submission process.
                All fees are non-refundable.
              </p>
            </ContentSection>

            <ContentSection title="Fast Track Review (Optional)">
              <p>
                We offer a Fast Track option (2–3 week turnaround). Email us
                with your submission ID to request this service. Expedited fees
                apply.
              </p>
            </ContentSection>

            <ContentSection title="Need Help?">
              <p className="mb-8">
                For any questions, contact our editorial team at [email]. Please
                include:
              </p>
              <ul>
                <li>Your Full Name</li>
                <li>School Name</li>
                <li>Current Grade Level</li>
                <li>Your specific question</li>
              </ul>
            </ContentSection>
          </div>

          {/* Table of Contents - Takes up 1/4 of the width */}
          <div className="lg:col-span-1">
            <TableOfContents sections={submissionSections} />
          </div>
        </div>
      </div>
    </div>
  );
}
