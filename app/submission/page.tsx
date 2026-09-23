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
      className={`${noTopBorder ? "pb-12" : "py-12 border-t border-black/30"} scroll-mt-24 font-text`}
    >
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="font-display text-3xl md:text-4xl text-black tracking-wide">
          {title}
        </h2>
      </div>
      <div className="space-y-5 text-sm md:text-base leading-relaxed text-black/80">
        {children}
      </div>
    </section>
  );
}

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="border-t border-black/30 pt-5">
      <h3 className="mb-4 font-display text-2xl text-black tracking-wide">
        {title}
      </h3>
      <div className="font-text text-black/80 leading-relaxed [&_p]:text-sm [&_li]:text-sm md:[&_p]:text-base md:[&_li]:text-base [&_strong]:font-semibold">
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
    { id: "fees", title: "Fees" },
    { id: "need-help", title: "Need Help?" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <Hero
        title="Submission Guidelines"
        subtitle="How to prepare, format, and submit a manuscript. Submissions from high school and college students are open for the 2026-2027 academic year."
        additionalContent={
          <SiteButton
            href="/form"
            color="primary"
            variant="ghost"
            variantStyle="whiteHover"
            className="mt-4 border-white text-white"
            endContent={
              <FaChevronCircleRight className="ml-2 text-base text-current" />
            }
          >
            Submit a Manuscript
          </SiteButton>
        }
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-20 pb-10 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 md:gap-14 lg:gap-20">
          <div className="lg:col-span-3">
            <details className="group lg:hidden mb-8 border-t border-b border-black/30 py-3">
              <summary className="font-mono text-xs uppercase tracking-[0.16em] text-black/70 cursor-pointer list-none marker:hidden [&::-webkit-details-marker]:hidden flex items-center justify-between gap-4">
                On this page
                <span
                  aria-hidden="true"
                  className="text-black/40 group-open:hidden"
                >
                  +
                </span>
                <span
                  aria-hidden="true"
                  className="hidden text-black/40 group-open:inline"
                >
                  &minus;
                </span>
              </summary>
              <nav aria-label="Sections on this page" className="mt-3">
                <ul className="font-text text-sm text-black/80 space-y-2">
                  {submissionSections.map(({ id, title }) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        className="underline underline-offset-4 decoration-black/20 hover:decoration-black"
                      >
                        {title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </details>

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
              <p>
                All manuscripts must follow the Publication Manual of the
                American Psychological Association, 7th edition, in both
                formatting and citation style. Where APA 7 permits more than one
                option, follow the single option specified on this page.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard title="File Format & Layout">
                  <ul className="space-y-2 list-disc pl-5">
                    <li>
                      <strong>Format:</strong> Microsoft Word (.docx)
                    </li>
                    <li>
                      <strong>Length:</strong> 6,000 words maximum, excluding
                      references and appendices
                    </li>
                    <li>
                      <strong>Page:</strong> 8.5" × 11" (US Letter), 1 inch
                      margins on all sides
                    </li>
                    <li>
                      <strong>Font:</strong> Times New Roman, 12 pt
                    </li>
                    <li>
                      <strong>Spacing:</strong> Double-spaced throughout,
                      including the abstract, block quotations, table notes, and
                      references
                    </li>
                    <li>
                      <strong>Paragraphs:</strong> Left-aligned with a ragged
                      right margin, first line indented 0.5 inch
                    </li>
                  </ul>
                </InfoCard>

                <InfoCard title="Title Page & Abstract">
                  <ul className="space-y-2 list-disc pl-5">
                    <li>
                      <strong>Title:</strong> Bold, centered, title case, in the
                      upper half of the page. 12 words or fewer.
                    </li>
                    <li>
                      <strong>Below the title:</strong> Author name, school
                      affiliation, and date, each on its own line
                    </li>
                    <li>
                      <strong>Abstract:</strong> On its own page, 250 words
                      maximum, one paragraph, not indented
                    </li>
                    <li>
                      <strong>Keywords:</strong> 3 to 5, indented, with{" "}
                      <em>Keywords:</em> in italics
                    </li>
                  </ul>
                </InfoCard>

                <InfoCard title="Headings">
                  <p className="mb-3">
                    APA 7 uses five heading levels, all in 12 pt Times New
                    Roman.
                  </p>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>
                      <strong>Level 1:</strong> Centered, Bold, Title Case
                    </li>
                    <li>
                      <strong>Level 2:</strong> Flush Left, Bold, Title Case
                    </li>
                    <li>
                      <strong>Level 3:</strong> Flush Left, Bold Italic, Title
                      Case
                    </li>
                    <li>
                      <strong>Level 4:</strong> Indented, Bold, Title Case,
                      ending with a period. Text begins on the same line.
                    </li>
                    <li>
                      <strong>Level 5:</strong> Indented, Bold Italic, Title
                      Case, ending with a period. Text begins on the same line.
                    </li>
                  </ul>
                </InfoCard>

                <InfoCard title="Tables & Figures">
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Do not paste tables as images.</li>
                    <li>
                      <strong>Table number:</strong> Table 1, Table 2, and so
                      on. Bold, flush left, on the line above the title.
                    </li>
                    <li>
                      <strong>Table title:</strong> On the line below the
                      number, in italics and title case, flush left.
                    </li>
                    <li>
                      <strong>Table note:</strong> Below the table, beginning
                      with <em>Note.</em> in italics
                    </li>
                    <li>
                      Place within the text, near where it is first mentioned.
                    </li>
                    <li>
                      <strong>Figures:</strong> Follow the same order. Figure
                      number in bold above the figure, figure title in italics
                      on the next line, then the image, then the note below.
                    </li>
                  </ul>
                </InfoCard>

                <InfoCard title="References">
                  <ul className="space-y-2 list-disc pl-5">
                    <li>APA 7th edition is required</li>
                    <li>
                      On a new page, with <strong>References</strong> bold and
                      centered
                    </li>
                    <li>
                      Alphabetical by first author&apos;s surname, hanging
                      indent of 0.5 inch
                    </li>
                    <li>
                      Every in-text citation must appear in the reference list,
                      and every reference must be cited in the text
                    </li>
                  </ul>
                </InfoCard>
              </div>
              <div>
                <p className="font-semibold text-black">
                  Need help with APA 7?
                </p>
                <ul className="mt-2 space-y-2 list-disc pl-5 [&_a]:underline [&_a]:underline-offset-2">
                  <li>
                    <Link
                      href="https://apastyle.apa.org/instructional-aids/student-paper-setup-guide.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Student Paper Setup Guide (PDF)
                    </Link>
                    : APA&apos;s own step-by-step setup instructions with
                    annotated diagrams
                  </li>
                  <li>
                    <Link
                      href="https://apastyle.apa.org/style-grammar-guidelines/paper-format/sample-papers"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      APA Sample Papers
                    </Link>
                    : full sample papers, including an annotated version
                  </li>
                  <li>
                    <Link
                      href="https://owl.purdue.edu/owl/research_and_citation/apa_style/apa_formatting_and_style_guide/general_format.html"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Purdue OWL: APA Formatting Guide
                    </Link>
                    : clear examples, popular with students
                  </li>
                </ul>
              </div>
            </EditorialSection>

            <EditorialSection id="review-process" title="Review Process">
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Submissions undergo double-blind peer review by at least two
                  independent reviewers.
                </li>
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

            <EditorialSection id="fees" title="Fees">
              <p>
                Submitting a manuscript is free. If your article is accepted
                for publication, JYI charges a one-time publication fee of $65
                USD. Nothing is charged for manuscripts that are declined.
              </p>
              <p>
                Your acceptance email includes a link to our Stripe checkout
                page, where you can pay the fee by card. A parent, guardian, or
                school may pay on your behalf.
              </p>
              <p>
                Need-based waivers are available. If the fee would stop you
                from publishing, email{" "}
                <a
                  href="mailto:editor@young-innovator.org"
                  className="text-primary underline underline-offset-2"
                >
                  editor@young-innovator.org
                </a>{" "}
                before paying. Articles accepted during the 2025–2026 academic
                year carry no fee, thanks to support from the Brain-Targeted
                Teaching Institute and grant funding for student publishing.
                Refunds and full details are on our{" "}
                <Link
                  href="/policies#apc"
                  className="underline underline-offset-2"
                >
                  Policies page
                </Link>
                .
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

            <div className="mt-10 flex justify-start">
              <SiteButton
                href="/form"
                className="border-primary text-primary"
                color="primary"
                variant="ghost"
                endContent={
                  <FaChevronCircleRight className="ml-2 text-lg text-current" />
                }
              >
                Submit a Manuscript
              </SiteButton>
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
