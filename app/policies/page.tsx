import type { Metadata } from "next";
import Hero from "@/components/Hero";

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
  { id: "peer-review", title: "Peer Review" },
  { id: "plagiarism", title: "Plagiarism" },
  { id: "ethics", title: "Publication Ethics" },
  { id: "archiving", title: "Archiving and Preservation" },
  { id: "privacy", title: "Privacy" },
];

function PolicySection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-8 border-t border-black/15">
      <h2 className="text-2xl md:text-4xl mb-4 font-display tracking-wide">
        {title}
      </h2>
      <div className="text-sm md:text-md leading-relaxed text-black/80 space-y-3 [&_a]:underline [&_a]:underline-offset-2">
        {children}
      </div>
    </section>
  );
}

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Hero
        title="Policies"
        subtitle="Open access, licensing, peer review, ethics, and preservation policies."
      />

      <div className="pb-40 mt-30">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-20">
          <nav aria-label="Policy sections" className="mb-10">
            <ul className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-black/60">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="hover:text-black transition-colors"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <PolicySection id="open-access" title="Open Access">
            <p>
              The Journal of Young Innovators (JYI) is a fully open-access
              journal. All articles published in JYI are freely available to
              read, download, copy, distribute, print, search, link to, and
              reuse, immediately upon publication and without any subscription,
              registration, or payment barrier.
            </p>
            <p>
              JYI follows the Budapest Open Access Initiative (BOAI) definition
              of open access. There are no embargo periods.
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
              Under this license, anyone is free to share (copy and redistribute
              the material in any medium or format) and adapt (remix, transform,
              and build upon the material) for any purpose, including
              commercially, provided that appropriate credit is given to the
              original author(s), a link to the license is provided, and any
              changes made are indicated.
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
              Authors are free to deposit their published work in institutional
              repositories, share it on personal or scholarly websites, and
              reuse it in subsequent works, provided proper citation is given.
            </p>
          </PolicySection>

          <PolicySection id="peer-review" title="Peer Review">
            <p>
              All research articles submitted to JYI undergo{" "}
              <strong>double-blind peer review</strong>. Author identities and
              affiliations are concealed from reviewers, and reviewer identities
              are concealed from authors.
            </p>
            <p>
              Each manuscript is evaluated by at least two members of our
              editorial board or external reviewers selected for their expertise
              in the relevant subject area. Reviewers assess originality,
              scholarly rigor, methodological soundness, clarity, and
              contribution to the field.
            </p>
            <p>
              Editorial decisions (accept, accept with revisions, revise and
              resubmit, or reject) are communicated to authors typically within
              4–8 weeks of submission. Detailed reviewer feedback is provided to
              authors regardless of the final decision.
            </p>
          </PolicySection>

          <PolicySection id="plagiarism" title="Plagiarism">
            <p>
              JYI takes plagiarism seriously. All submissions are screened for
              originality through editorial review and cross-referencing
              against published literature and online sources prior to peer
              review.
            </p>
            <p>
              Plagiarism — including verbatim copying, substantial paraphrasing
              without attribution, self-plagiarism, and improperly attributed
              quotations — is grounds for immediate rejection. If plagiarism is
              detected after publication, the journal will issue a correction or
              retract the article in accordance with{" "}
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
              JYI is committed to the highest standards of publication ethics
              and follows the principles articulated by the{" "}
              <a
                href="https://publicationethics.org/core-practices"
                target="_blank"
                rel="noopener noreferrer"
              >
                Committee on Publication Ethics (COPE) Core Practices
              </a>
              .
            </p>
            <p>
              <strong>Author responsibilities.</strong> Authors must submit
              original work, properly cite all sources, disclose any conflicts
              of interest or sources of funding, and obtain permission for any
              third-party material they reproduce. Submissions must not be
              under consideration at another journal.
            </p>
            <p>
              <strong>Reviewer responsibilities.</strong> Reviewers must keep
              manuscripts confidential, declare conflicts of interest, provide
              fair and constructive feedback, and complete reviews in a timely
              manner.
            </p>
            <p>
              <strong>Editor responsibilities.</strong> Editors are responsible
              for the integrity of the published record. They make publication
              decisions free from commercial influence, handle complaints and
              corrections promptly, ensure the confidentiality of submissions,
              and act to prevent the publication of work in which a conflict of
              interest has not been declared.
            </p>
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
            <p>
              Authors are encouraged to deposit their published version in
              their institutional repository for additional preservation
              redundancy. JYI is exploring participation in long-term
              preservation networks (such as CLOCKSS or the Internet Archive)
              and will update this policy as those arrangements are
              established.
            </p>
          </PolicySection>

          <PolicySection id="privacy" title="Privacy">
            <p>
              JYI collects only the personal information necessary to operate
              the journal: author and reviewer names, affiliations, and contact
              details for the purpose of editorial correspondence and
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
      </div>
    </div>
  );
}
