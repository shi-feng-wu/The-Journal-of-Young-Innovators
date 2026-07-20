"use client";

import Hero from "@/components/Hero";
import { TableOfContents } from "@/components/PageComponents";
import SiteButton from "@/components/SiteButton";
import Link from "next/link";
import { ReactNode } from "react";
import { FaChevronCircleRight } from "react-icons/fa";

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
      className={`${noTopBorder ? "pb-12" : "py-12 border-t border-black/30"} font-text`}
    >
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="font-display text-3xl md:text-4xl text-black tracking-wide">
          {title}
        </h2>
      </div>
      <div className="space-y-5 text-sm md:text-md leading-relaxed text-black/80">
        {children}
      </div>
    </section>
  );
}

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-display text-2xl text-black tracking-wide">
        {title}
      </h3>
      <div className="font-text text-black/80 leading-relaxed [&_p]:text-sm [&_li]:text-sm md:[&_p]:text-md md:[&_li]:text-md [&_strong]:font-semibold">
        {children}
      </div>
    </article>
  );
}

export default function Home() {
  const submissionSections = [
    { id: "selectivity", title: "Selectivity" },
    { id: "who-can-submit", title: "Who Can Submit" },
    { id: "what-you-can-submit", title: "What You Can Submit" },
    { id: "submission-rules", title: "Submission Rules" },
    { id: "formatting-requirements", title: "Formatting Requirements" },
    { id: "review-process", title: "Review Process" },
    { id: "license-and-copyright", title: "License and Copyright" },
    {
      id: "article-processing-charges-apc",
      title: "Submission Fee",
    },
    { id: "need-help", title: "Need Help?" },
  ];

  return (
    <div className="min-h-screen bg-background pb-10">
      <Hero
        title="Submission Guidelines"
        subtitle="We welcome submissions from high school and college students who are
              passionate about academic inquiry and eager to contribute to
              meaningful scholarship. Our editorial board includes experienced
              researchers, educators, and editors dedicated to helping young
              scholars grow through rigorous feedback and mentorship."
        contentClassName="!mt-24"
        additionalContent={
          <Link href="/form" aria-label="Submit a paper" className="group">
            <SiteButton
              color="primary"
              variant="ghost"
              variantStyle="whiteHover"
              className="border-white text-white"
              endContent={
                <FaChevronCircleRight className="ml-2 text-base text-current" />
              }
            >
              Submit to Our Journal
            </SiteButton>
          </Link>
        }
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-20 pb-10 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 md:gap-14 lg:gap-20">
          <div className="lg:col-span-3">
            <EditorialSection id="selectivity" title="Selectivity" noTopBorder>
              <p>
                We are a highly competitive journal that upholds rigorous
                academic standards, and not every submission will be accepted.
                We value innovative thinking, strong writing, and a genuine
                commitment to meaningful research.
              </p>
              <p>
                Each manuscript is reviewed by editors and subject experts. If
                your work shows promise, we may invite revision to strengthen
                argumentation, structure, evidence, and scholarly clarity.
              </p>
            </EditorialSection>

            <EditorialSection id="who-can-submit" title="Who Can Submit">
              <p>
                The first author must be a student currently enrolled in an
                accredited high school or college.
              </p>
            </EditorialSection>

            <EditorialSection
              id="what-you-can-submit"
              title="What You Can Submit"
            >
              <div className="space-y-4">
                <p>
                  <strong>Original Research Articles:</strong> In-depth studies
                  presenting novel findings supported by data, analysis, and
                  scholarly references.
                </p>
                <p>
                  <strong>Literature Reviews:</strong> Focused syntheses of
                  existing scholarship that identify key debates, gaps, and
                  future directions.
                </p>
                <p>
                  <strong>Interview Features:</strong> Structured interviews
                  with technology leaders presented in journalistic or academic
                  style with analytical value.
                </p>
              </div>
            </EditorialSection>

            <EditorialSection id="submission-rules" title="Submission Rules">
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  No dual submissions. Simultaneous submission to multiple
                  journals is considered unethical.
                </li>
                <li>The manuscript must be original and unpublished.</li>
                <li>
                  Manuscripts are evaluated for rigor, clarity, integrity, and
                  relevance.
                </li>
                <li>
                  Submit as Microsoft Word (.docx). PDF and Google Docs are not
                  accepted.
                </li>
              </ul>
            </EditorialSection>

            <EditorialSection
              id="formatting-requirements"
              title="Formatting Requirements"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard title="File Format & Layout">
                  <ul className="space-y-2 list-disc pl-5">
                    <li>
                      <strong>Format:</strong> Microsoft Word (.docx)
                    </li>
                    <li>
                      <strong>Maximum:</strong> 20 pages (8.5" × 11", US Letter)
                    </li>
                    <li>
                      <strong>Margins:</strong> 1 inch on all sides
                    </li>
                    <li>
                      <strong>Body Font:</strong> Times New Roman, 10 pt,
                      single-spaced
                    </li>
                  </ul>
                </InfoCard>

                <InfoCard title="Headings">
                  <ul className="space-y-2 list-disc pl-5">
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
                </InfoCard>

                <InfoCard title="Visuals">
                  <ul className="space-y-2 list-disc pl-5">
                    <li>
                      <strong>Tables:</strong> Use Word’s table tool (not
                      images)
                    </li>
                    <li>
                      <strong>Figures:</strong> Centered, clearly titled, placed
                      within text
                    </li>
                    <li>
                      <strong>Image formats:</strong> .png or .jpg
                    </li>
                    <li>
                      Upload images separately with descriptive filenames.
                    </li>
                  </ul>
                </InfoCard>

                <InfoCard title="Other Specifications">
                  <ul className="space-y-2 list-disc pl-5">
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
                </InfoCard>
              </div>
            </EditorialSection>

            <EditorialSection id="review-process" title="Review Process">
              <ul className="list-disc pl-6 space-y-2">
                <li>Submissions undergo double-blind peer review.</li>
                <li>
                  Editorial feedback is typically provided within 4–8 weeks.
                </li>
                <li>
                  Accepted papers may require revision before publication.
                </li>
              </ul>
            </EditorialSection>

            <EditorialSection
              id="license-and-copyright"
              title="License and Copyright"
            >
              <p>
                By submitting to The Journal of Young Innovators, authors agree
                that their accepted article will be published open access under
                a{" "}
                <Link
                  href="https://creativecommons.org/licenses/by/4.0/"
                  className="underline underline-offset-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Creative Commons Attribution 4.0 International License (CC BY
                  4.0)
                </Link>
                .
              </p>
              <p>
                Authors retain copyright of their work and grant JYI a
                non-exclusive license to publish. Full details on our{" "}
                <Link
                  href="/policies#license"
                  className="underline underline-offset-2"
                >
                  Policies page
                </Link>
                .
              </p>
            </EditorialSection>

            <EditorialSection
              id="article-processing-charges-apc"
              title="Submission Fee"
            >
              <p>
                JYI charges a one-time $55 USD submission fee, paid when a
                manuscript is submitted. There are no article processing
                charges (APCs) and no publication fees — the journal is
                fully open access at no cost to readers, and the fee never
                influences editorial decisions.
              </p>
              <p>
                Need-based waivers are available to any student for whom
                the fee is a barrier. Request one at{" "}
                <Link
                  href="/waiver"
                  className="text-primary underline underline-offset-2"
                >
                  /waiver
                </Link>{" "}
                before submitting — approved requests receive a code that
                waives the fee in full at checkout. See our{" "}
                <Link
                  href="/policies#apc"
                  className="text-primary underline underline-offset-2"
                >
                  Policies page
                </Link>{" "}
                for full details.
              </p>
            </EditorialSection>

            <EditorialSection id="need-help" title="Need Help?">
              <p>
                For questions, email our editorial team at
                <a
                  className="text-primary underline ml-1"
                  href="mailto:editor@young-innovator.org"
                  aria-label="Email the editorial team"
                >
                  editor@young-innovator.org
                </a>
                . Please include your full name, school, grade level, and a
                concise description of your question.
              </p>
            </EditorialSection>

            <div className="mt-10 flex justify-end">
              <Link
                href="/form"
                aria-label="Open submission form"
                className="group"
              >
                <SiteButton
                  className="border-primary text-primary"
                  color="primary"
                  variant="ghost"
                  endContent={
                    <FaChevronCircleRight className="ml-2 text-lg text-current" />
                  }
                >
                  Start Submission
                </SiteButton>
              </Link>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1">
            <TableOfContents sections={submissionSections} />
          </div>
        </div>
      </div>
    </div>
  );
}
