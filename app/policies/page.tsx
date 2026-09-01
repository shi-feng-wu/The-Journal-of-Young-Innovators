import type { Metadata } from "next";
import Hero from "@/components/Hero";
import { TableOfContents } from "@/components/PageComponents";

export const metadata: Metadata = {
  title: "Policies",
  description:
    "Open access, licensing, copyright, peer review, plagiarism, ethics, archiving, and privacy policies for The Journal of Young Innovators.",
  alternates: {
    canonical: "/policies",
  },
};

const sections = [
  { id: "open-access", title: "Open Access" },
  { id: "license", title: "License" },
  { id: "copyright", title: "Copyright" },
  { id: "self-archiving", title: "Author Self-Archiving" },
  { id: "peer-review", title: "Peer Review" },
  { id: "frequency", title: "Publication Frequency" },
  { id: "apc", title: "Article Processing Charges" },
  { id: "plagiarism", title: "Plagiarism" },
  { id: "ethics", title: "Publication Ethics" },
  { id: "ai", title: "Generative AI Policy" },
  { id: "conflicts-of-interest", title: "Conflicts of Interest" },
  { id: "data-availability", title: "Data Availability" },
  { id: "complaints", title: "Complaints and Appeals" },
  { id: "corrections", title: "Corrections and Retractions" },
  { id: "archiving", title: "Archiving and Preservation" },
  { id: "ownership", title: "Ownership and Governance" },
  { id: "advertising", title: "Advertising and Direct Marketing" },
  { id: "privacy", title: "Privacy" },
];

function PolicySection({
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
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="font-display text-3xl md:text-4xl text-black tracking-wide">
          {title}
        </h2>
      </div>
      <div className="space-y-5 text-sm md:text-base leading-relaxed text-black/80 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-primary/40 hover:[&_a]:decoration-primary">
        {children}
      </div>
    </section>
  );
}

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-background pb-10">
      <Hero
        title="Policies"
        subtitle="Open access, licensing, peer review, ethics, and preservation policies."
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-20 pb-10 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 md:gap-14 lg:gap-20">
          <div className="lg:col-span-3 max-w-[68ch]">
            <details className="lg:hidden mb-8 border-b border-black/30 pb-4 font-text">
              <summary className="cursor-pointer font-mono text-xs uppercase tracking-[0.2em] text-black/70">
                On this page
              </summary>
              <nav aria-label="On this page" className="mt-4">
                <ul className="grid grid-cols-1 xs:grid-cols-2 gap-y-2 gap-x-6 text-sm text-black/80">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="underline-offset-2 hover:underline"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </details>

            <PolicySection id="open-access" title="Open Access" noTopBorder>
              <p>
                The Journal of Young Innovators (JYI) is a fully open-access
                journal. All articles published in JYI are freely available to
                read, download, copy, distribute, print, search, link to, and
                reuse, immediately upon publication and without any
                subscription, registration, or payment barrier.
              </p>
              <p>
                JYI follows the Budapest Open Access Initiative (BOAI)
                definition of open access. There are no embargo periods.
              </p>
            </PolicySection>

            <PolicySection id="license" title="License">
              <p>
                All articles published in JYI are licensed under a{" "}
                <a
                  href="https://creativecommons.org/licenses/by/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Creative Commons Attribution 4.0 International License (CC BY
                  4.0)
                </a>
                .
              </p>
              <p>
                Under this license, anyone is free to share (copy and
                redistribute the material in any medium or format) and adapt
                (remix, transform, and build upon the material) for any purpose,
                including commercially, provided that appropriate credit is
                given to the original author(s), a link to the license is
                provided, and any changes made are indicated.
              </p>
              <p>
                Each article displays its license terms on the article page and,
                where applicable, in machine-readable metadata.
              </p>
            </PolicySection>

            <PolicySection id="copyright" title="Copyright">
              <p>
                <strong>Authors retain copyright of their work.</strong> By
                submitting to JYI, authors grant the journal a non-exclusive
                license to publish the article and identify it as having been
                first published in The Journal of Young Innovators, while
                retaining all other rights to their work.
              </p>
              <p>
                Authors are free to deposit their published work in
                institutional repositories, share it on personal or scholarly
                websites, and reuse it in subsequent works, provided proper
                citation is given.
              </p>
            </PolicySection>

            <PolicySection id="self-archiving" title="Author Self-Archiving">
              <p>
                JYI imposes no embargo on author self-archiving. Authors may
                deposit and distribute the <strong>submitted manuscript</strong>{" "}
                (preprint), the <strong>accepted manuscript</strong>{" "}
                (postprint), and the <strong>published version</strong> (Version
                of Record) in any of the following venues, immediately upon
                publication and without seeking further permission:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>The author&apos;s personal or institutional website</li>
                <li>
                  An institutional or subject repository (e.g., arXiv, SSRN)
                </li>
                <li>
                  A scholarly social network (e.g., ResearchGate, Academia.edu)
                </li>
                <li>A funder-mandated repository</li>
              </ul>
              <p>
                The published version remains licensed under CC BY 4.0 wherever
                it is shared. Authors are asked to include the original citation
                and a link to the article on young-innovator.org.
              </p>
            </PolicySection>

            <PolicySection id="peer-review" title="Peer Review">
              <p>
                All research articles submitted to JYI undergo{" "}
                <strong>double-blind peer review</strong>. Author identities and
                affiliations are concealed from reviewers, and reviewer
                identities are concealed from authors.
              </p>
              <p>
                Each manuscript is evaluated by at least two members of our
                editorial board or external reviewers selected for their
                expertise in the relevant subject area. Reviewers assess
                originality, scholarly rigor, methodological soundness, clarity,
                and contribution to the field.
              </p>
              <p>
                Editorial decisions (accept, accept with revisions, revise and
                resubmit, or reject) are communicated to authors typically
                within 4–8 weeks of submission. Detailed reviewer feedback is
                provided to authors regardless of the final decision.
              </p>
            </PolicySection>

            <PolicySection id="frequency" title="Publication Frequency">
              <p>
                JYI publishes <strong>two issues per year</strong> (biannual): a
                winter issue and a spring issue. Articles are also released
                continuously online as soon as they have completed peer review,
                copyediting, and final author approval, and are subsequently
                collected into the next scheduled issue.
              </p>
            </PolicySection>

            <PolicySection id="apc" title="Article Processing Charges">
              <p>
                For the 2025–2026 academic year,{" "}
                <strong>
                  submission and publication in JYI are free of charge
                </strong>
                . There are no submission fees, article processing charges
                (APCs), or publication fees, thanks to the generous support of
                the Brain-Targeted Teaching Institute, and grant funding
                dedicated to making scholarly publishing accessible to students
                of all income levels. Need-based waivers are also available by
                request to{" "}
                <a href="mailto:editor@young-innovator.org">
                  editor@young-innovator.org
                </a>
                .
              </p>
              <p>
                Beginning with the 2026–2027 academic year, JYI will introduce a
                $65 USD publication fee per article, payable only after the
                article has been accepted for publication. There is no fee to
                submit an article for review.
              </p>
            </PolicySection>

            <PolicySection id="plagiarism" title="Plagiarism">
              <p>
                JYI takes plagiarism seriously. Beginning June 2026, all
                submissions will be screened for originality using{" "}
                <a
                  href="https://www.crossref.org/services/similarity-check/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Crossref Similarity Check
                </a>{" "}
                (powered by iThenticate) prior to peer review. Until that date,
                submissions are screened through editorial review and
                cross-referencing against published literature and online
                sources. Manuscripts flagged with substantial overlap are
                returned to the author or rejected outright, depending on the
                nature of the match.
              </p>
              <p>
                Plagiarism, including verbatim copying, substantial paraphrasing
                without attribution, self-plagiarism, and improperly attributed
                quotations, is grounds for immediate rejection. If plagiarism is detected after publication, the
                journal will issue a correction or retract the article in
                accordance with{" "}
                <a
                  href="https://publicationethics.org/guidance/Flowcharts"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  COPE
                </a>{" "}
                guidelines and notify the author&apos;s affiliated institution
                where appropriate.
              </p>
            </PolicySection>

            <PolicySection id="ethics" title="Publication Ethics">
              <p>
                JYI follows the principles articulated by the{" "}
                <a
                  href="https://publicationethics.org/core-practices"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Committee on Publication Ethics (COPE) Core Practices
                </a>
                .
              </p>
              <div>
                <h3 className="inline text-[length:inherit] font-text font-semibold text-black">
                  Author responsibilities.
                </h3>{" "}
                Authors must submit original work, properly cite all sources,
                disclose any conflicts of interest or sources of funding, and
                obtain permission for any third-party material they reproduce.
                Submissions must not be under consideration at another journal.
              </div>
              <div>
                <h3 className="inline text-[length:inherit] font-text font-semibold text-black">
                  Reviewer responsibilities.
                </h3>{" "}
                Reviewers must keep manuscripts confidential, declare conflicts
                of interest, provide fair and constructive feedback, and
                complete reviews in a timely manner.
              </div>
              <div>
                <h3 className="inline text-[length:inherit] font-text font-semibold text-black">
                  Editor responsibilities.
                </h3>{" "}
                Editors are responsible for the integrity of the published
                record. They make publication decisions free from commercial
                influence, handle complaints and corrections promptly, ensure
                the confidentiality of submissions, and act to prevent the
                publication of work in which a conflict of interest has not been
                declared.
              </div>
              <p>
                Concerns about misconduct, including data fabrication,
                falsification, plagiarism, or undisclosed conflicts of interest,
                may be sent to{" "}
                <a href="mailto:editor@young-innovator.org">
                  editor@young-innovator.org
                </a>
                .
              </p>
            </PolicySection>

            <PolicySection id="ai" title="Generative AI Policy">
              <div>
                <h3 className="inline text-[length:inherit] font-text font-semibold text-black">
                  Authors.
                </h3>{" "}
                Generative AI tools (such as large language models) may be used
                to assist with language polishing, spelling, and grammar. They
                may not be used to generate substantive scholarly content,
                analysis, citations, data, or figures. Any use of AI tools
                beyond minor language assistance must be disclosed in the
                manuscript&apos;s methods or acknowledgements section, including
                the tool name, version, and how it was used. AI tools cannot be
                listed as authors and cannot be cited as a source of authority.
                The human authors are fully responsible for the integrity,
                accuracy, and originality of all submitted content.
              </div>
              <div>
                <h3 className="inline text-[length:inherit] font-text font-semibold text-black">
                  Reviewers.
                </h3>{" "}
                Reviewers must not upload manuscripts, in whole or in part, to
                generative AI tools, as doing so violates the confidentiality of
                the peer review process.
              </div>
              <div>
                <h3 className="inline text-[length:inherit] font-text font-semibold text-black">
                  Editors.
                </h3>{" "}
                Editors may use AI-assisted tools for administrative tasks
                (e.g., similarity screening) but final editorial decisions are
                made by human editors.
              </div>
            </PolicySection>

            <PolicySection
              id="conflicts-of-interest"
              title="Conflicts of Interest"
            >
              <p>
                All authors, reviewers, and editors must declare any financial,
                personal, professional, or institutional relationships that
                could reasonably be perceived as influencing their work in
                connection with a submission.
              </p>
              <p>
                <strong>Authors</strong> must include a Conflicts of Interest
                statement at the end of the manuscript. If there are no
                conflicts to declare, the statement should read &ldquo;The
                authors declare no conflicts of interest.&rdquo; Funding
                sources, grants, employment, consulting relationships, stock
                ownership, patents, and personal relationships with editors or
                reviewers must be disclosed.
              </p>
              <p>
                <strong>Reviewers</strong> must decline review if they have a
                conflict with the authors, the work, or any party that funded or
                is affected by the work.
              </p>
              <p>
                <strong>Editors</strong> must recuse themselves from handling
                any manuscript with which they have a personal, professional, or
                competitive conflict, and must not handle manuscripts authored
                by close colleagues, recent collaborators, students, or family
                members. In such cases the manuscript is reassigned to another
                editor.
              </p>
            </PolicySection>

            <PolicySection id="data-availability" title="Data Availability">
              <p>
                JYI encourages authors to make the data, code, and materials
                underlying their findings openly available to the extent
                permitted by ethical, legal, and privacy constraints. Authors
                are asked to deposit datasets in a public, recognized repository
                (e.g., Zenodo, OSF, Dryad, GitHub for code) and to cite the
                dataset in the manuscript with a persistent identifier where
                possible.
              </p>
              <p>
                Each accepted manuscript should include a brief{" "}
                <strong>Data Availability Statement</strong> describing where
                the data can be accessed, any restrictions that apply, and how
                to request access where data cannot be made fully public (e.g.,
                human-subjects data subject to IRB restrictions).
              </p>
            </PolicySection>

            <PolicySection id="complaints" title="Complaints and Appeals">
              <p>
                Authors, reviewers, readers, and other parties may raise
                concerns or appeals about the editorial process or any published
                content. JYI follows{" "}
                <a
                  href="https://publicationethics.org/appeals"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  COPE&apos;s guidance on appeals and complaints
                </a>
                .
              </p>
              <div>
                <h3 className="inline text-[length:inherit] font-text font-semibold text-black">
                  Step 1.
                </h3>{" "}
                Direct your complaint or appeal to the handling editor by
                emailing{" "}
                <a href="mailto:editor@young-innovator.org">
                  editor@young-innovator.org
                </a>{" "}
                with the subject line &ldquo;Appeal&rdquo; or
                &ldquo;Complaint&rdquo;. Include the manuscript or article
                title, the nature of the concern, and any supporting evidence.
                We acknowledge receipt within 5 business days.
              </div>
              <div>
                <h3 className="inline text-[length:inherit] font-text font-semibold text-black">
                  Step 2.
                </h3>{" "}
                If the response from the handling editor does not resolve the
                matter, the appeal is escalated to the Editor-in-Chief, who
                reviews the case independently. Decisions at this stage are
                final within JYI.
              </div>
              <div>
                <h3 className="inline text-[length:inherit] font-text font-semibold text-black">
                  Step 3.
                </h3>{" "}
                If the complaint concerns the Editor-in-Chief, an editor with no
                conflict of interest is designated to handle the case.
                Unresolved disputes about publication ethics may be referred to{" "}
                <a
                  href="https://publicationethics.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  COPE
                </a>{" "}
                for external guidance.
              </div>
              <p>
                Retaliation against complainants in good faith is prohibited.
              </p>
            </PolicySection>

            <PolicySection id="corrections" title="Corrections and Retractions">
              <p>
                JYI follows{" "}
                <a
                  href="https://publicationethics.org/retraction-guidelines"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  COPE&apos;s retraction and correction guidelines
                </a>
                .
              </p>
              <div>
                <h3 className="inline text-[length:inherit] font-text font-semibold text-black">
                  Corrections (errata).
                </h3>{" "}
                Minor errors that do not affect the conclusions of an article
                (e.g., typographical errors, errors in author affiliations,
                mislabelled figures) are addressed by issuing a correction
                notice. The original article remains in place and is updated
                with a clearly visible link to the correction notice.
              </div>
              <div>
                <h3 className="inline text-[length:inherit] font-text font-semibold text-black">
                  Expressions of concern.
                </h3>{" "}
                If a credible concern is raised about the integrity of an
                article and an investigation is required, JYI may issue an
                Expression of Concern linked to the article while the matter is
                being resolved.
              </div>
              <div>
                <h3 className="inline text-[length:inherit] font-text font-semibold text-black">
                  Retractions.
                </h3>{" "}
                Articles are retracted when there is clear evidence of
                unreliable findings (resulting from misconduct or honest error),
                redundant publication, plagiarism, undisclosed major conflicts
                of interest, or unethical research practices. Retracted articles
                are not removed from the site. They remain accessible with a
                clearly displayed retraction notice and a watermark on the PDF,
                so the scholarly record remains intact and citing parties can
                identify the retraction.
              </div>
              <p>
                All correction, expression-of-concern, and retraction notices
                are open access, freely linked from the original article, and
                indexed alongside the original record.
              </p>
            </PolicySection>

            <PolicySection id="archiving" title="Archiving and Preservation">
              <p>
                JYI maintains a permanent, freely-accessible online archive of
                all published articles at{" "}
                <a
                  href="https://young-innovator.org/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  young-innovator.org/issues
                </a>
                . Each article is hosted as a downloadable PDF with a stable URL
                based on its title slug.
              </p>
              <div>
                <h3 className="inline text-[length:inherit] font-text font-semibold text-black">
                  Web archiving.
                </h3>{" "}
                Every JYI article URL is captured by the Internet
                Archive&apos;s Wayback Machine at the time of publication and at
                regular intervals thereafter, so the full content of the
                journal, including the article landing page and the article PDF,
                can be retrieved through{" "}
                <a
                  href="https://web.archive.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  web.archive.org
                </a>{" "}
                even if young-innovator.org becomes unavailable.
              </div>
              <div>
                <h3 className="inline text-[length:inherit] font-text font-semibold text-black">
                  Author deposit.
                </h3>{" "}
                Because every article is published under a CC BY 4.0 license
                with no embargo, authors are encouraged, and explicitly
                permitted, to deposit the published version in their
                institutional or subject repository for additional preservation
                redundancy. See the{" "}
                <a href="#self-archiving">Author Self-Archiving</a> section
                above.
              </div>
              <p>
                In the event the journal ceases publication, the editorial team
                will ensure that the existing article archive remains accessible
                through web archives and, where possible, through transfer to a
                partner institution or repository.
              </p>
            </PolicySection>

            <PolicySection id="ownership" title="Ownership and Governance">
              <p>
                The Journal of Young Innovators is an independent, non-profit
                open-access journal published from Baltimore, Maryland, USA. The
                journal is operated by its editorial team for the purpose of
                youth educational advancement and is not owned by, sponsored by,
                or operated for the financial benefit of any commercial entity.
              </p>
              <p>
                Editorial decisions are made independently of any sponsor,
                funder, or institutional affiliation of the editors. The
                editorial team is solely responsible for the content of the
                journal, the selection of reviewers, and the acceptance or
                rejection of manuscripts.
              </p>
            </PolicySection>

            <PolicySection
              id="advertising"
              title="Advertising and Direct Marketing"
            >
              <p>
                JYI does not accept paid advertising on the journal website or
                within published articles. The journal does not engage in direct
                marketing of acceptance, expedited review, or publication
                services to authors. Solicitations purporting to offer
                guaranteed acceptance, paid placement, or fee-based indexing
                should not be regarded as genuine communications from JYI and
                may be reported to{" "}
                <a href="mailto:editor@young-innovator.org">
                  editor@young-innovator.org
                </a>
                .
              </p>
            </PolicySection>

            <PolicySection id="privacy" title="Privacy">
              <p>
                JYI collects only the personal information necessary to operate
                the journal: author and reviewer names, affiliations, and
                contact details for the purpose of editorial correspondence and
                attribution.
              </p>
              <p>
                We do not sell or share personal information with third parties.
                Information collected during submission is used solely for
                editorial workflow, peer review, and publication. Aggregated,
                anonymized site analytics may be collected to improve the
                service.
              </p>
              <p>
                Questions about personal data may be sent to{" "}
                <a href="mailto:editor@young-innovator.org">
                  editor@young-innovator.org
                </a>
                .
              </p>
            </PolicySection>
          </div>

          <div className="hidden lg:block lg:col-span-1">
            <TableOfContents sections={sections} />
          </div>
        </div>
      </div>
    </div>
  );
}
