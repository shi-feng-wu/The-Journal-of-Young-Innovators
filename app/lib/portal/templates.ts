// Email templates for the portal composer. Client-safe: plain data only.
// Each one is taken from a real email the editors sent (or the template they
// already use), with only the names, title and payment link filled in.
// Editors always see and can edit the text before it is sent.

import type { SubmissionStatus } from "./constants";

export interface TemplateContext {
  firstName: string;
  title: string;
  ref: string;
  paymentUrl: string;
  editorName: string;
}

export interface EmailTemplate {
  id: string;
  label: string;
  /** Status the composer offers to set when this email is sent. */
  setsStatus?: SubmissionStatus;
  /** Sending this template marks the fee as waived. */
  waivesFee?: boolean;
  /** Who the email goes to. Reviewer emails get an editable To field. */
  audience?: "author" | "reviewer";
  subject: (c: TemplateContext) => string;
  body: (c: TemplateContext) => string;
}

const lines = (...parts: string[]) => parts.join("\n");

// One sign-off for every email.
const SIGN_OFF = ["Best regards,", "The Editorial Team", "The Journal of Young Innovators"];

const hello = (c: TemplateContext) => `Dear ${c.firstName || "Author"},`;

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    // From the review request sent to a peer reviewer, 2026-04-30.
    // Review is double-blind: nothing here names the author.
    id: "review-request",
    label: "Send to a reviewer",
    audience: "reviewer",
    setsStatus: "in_review",
    subject: (c) => `Peer review request: “${c.title}”`,
    body: (c) =>
      lines(
        "Dear [Reviewer name],",
        "",
        `We are reaching out to invite you to serve as a peer reviewer for a manuscript titled “${c.title}.” The manuscript is attached. Given your expertise, your perspective would be especially helpful in assessing this piece.`,
        "",
        "In your review, please focus on the strength and originality of the central argument, clarity and organization, and how effectively the manuscript engages a broader academic and professional audience. Suggestions for refinement or repositioning are also welcome.",
        "",
        "To guide your feedback, please rate the following:",
        "",
        "1. Argument and contribution: how strong and original is the central argument? (1 to 5)",
        "2. Clarity and structure: how clear, coherent, and well organized is the manuscript? (1 to 5)",
        "3. Engagement and relevance: how effectively does the manuscript engage its intended audience and contribute to the field? (1 to 5)",
        "4. Final decision: can this paper be published, and what is your overall rating?",
        "",
        "We would appreciate receiving your feedback within the next two to three weeks. Please let us know if that timeline works for you.",
        "",
        "Thank you for your time and for helping uphold the quality of our publication.",
        "",
        ...SIGN_OFF,
      ),
  },
  {
    // The journal's acceptance template, rewritten for the fee that is
    // charged only on acceptance, with this manuscript's payment link.
    id: "accept",
    label: "Accept",
    setsStatus: "accepted",
    subject: (c) => `Accepted for publication: “${c.title}”`,
    body: (c) =>
      lines(
        hello(c),
        "",
        `We are pleased to inform you that following peer review, your manuscript, “${c.title},” has been accepted for publication in The Journal of Young Innovators.`,
        "",
        "Accepted articles carry a publication fee of $65 USD. Please complete the payment using the following link:",
        c.paymentUrl,
        "",
        "Once your payment has been processed, we will send you a confirmation and schedule your article for publication. If the fee would prevent you from publishing, or if you have any questions, please reply to this email.",
        "",
        ...SIGN_OFF,
      ),
  },
  {
    // From the acceptance sent 2026-08-18 (no fee).
    id: "accept-waived",
    label: "Accept, no fee",
    setsStatus: "accepted",
    waivesFee: true,
    subject: (c) => `Accepted for publication: “${c.title}”`,
    body: (c) =>
      lines(
        hello(c),
        "",
        `We are pleased to inform you that following peer review, your manuscript, “${c.title},” has been approved for publication in The Journal of Young Innovators.`,
        "",
        "Congratulations on this achievement and on your commitment to academic research. Please expect your article to be published on the journal’s website within 30 days.",
        "",
        ...SIGN_OFF,
      ),
  },
  {
    // From the revision request sent 2026-05-29 (reviewer feedback attached).
    id: "revisions",
    label: "Request revisions",
    setsStatus: "revisions",
    subject: (c) => `Revision request: “${c.title}”`,
    body: (c) =>
      lines(
        hello(c),
        "",
        `Thank you for submitting your manuscript, “${c.title},” to The Journal of Young Innovators.`,
        "",
        "Following peer review, the editorial team has recommended your manuscript for publication pending minor revisions. The reviewer found the article to be a strong contribution to the field and has suggested only limited revisions to strengthen the final version.",
        "",
        "Because the requested revisions are minor in scope, your revised manuscript will not need a second round of peer review. It will go through a final editorial review when you resubmit.",
        "",
        "Please note that publication depends on satisfactorily addressing the attached reviewer feedback.",
        "",
        "To make sure your article is included in the forthcoming issue, please submit your revised draft within six weeks of the date of this email.",
        "",
        "We look forward to receiving your revised manuscript.",
        "",
        ...SIGN_OFF,
      ),
  },
  {
    // From the acknowledgement sent 2026-05-19.
    id: "in-review",
    label: "Under review notice",
    setsStatus: "in_review",
    subject: (c) => `Your manuscript is under review: “${c.title}”`,
    body: (c) =>
      lines(
        hello(c),
        "",
        "Thank you for your submission to The Journal of Young Innovators. Your article has been received and is currently under review by our editorial team.",
        "",
        "Please allow approximately six to eight weeks for the review process to be completed. We appreciate your patience and your interest in contributing to our journal.",
        "",
        ...SIGN_OFF,
      ),
  },
  {
    // From the decision sent 2026-08-13.
    id: "decline",
    label: "Decline",
    setsStatus: "rejected",
    subject: (c) => `Submission decision: “${c.title}”`,
    body: (c) =>
      lines(
        hello(c),
        "",
        `Thank you for your submission, “${c.title}.” Unfortunately, the manuscript does not meet our criteria for a research article, and we are unable to accept it for publication.`,
        "",
        "We wish you the best of luck with your future submissions.",
        "",
        ...SIGN_OFF,
      ),
  },
  {
    // From the decision sent 2026-09-21.
    id: "decline-ai",
    label: "Decline for AI content",
    setsStatus: "rejected",
    subject: (c) => `Submission decision: “${c.title}”`,
    body: (c) =>
      lines(
        hello(c),
        "",
        `Thank you for submitting your article, “${c.title},” to The Journal of Young Innovators.`,
        "",
        "As part of our review process, we identified concerns about the extent of AI-generated content in the article. After careful consideration, we have decided not to move forward with the submission for publication at this time.",
        "",
        "We appreciate the time and effort you put into your submission and thank you for your interest in contributing to the journal.",
        "",
        ...SIGN_OFF,
      ),
  },
  {
    // From the question sent 2026-08-27.
    id: "ai-question",
    label: "Ask about AI use",
    subject: (c) => `Question about AI use: “${c.title}”`,
    body: (c) =>
      lines(
        hello(c),
        "",
        "Thank you for your submission. Could you please tell us how much AI was used in writing the article? Our AI detection tool indicates that much of the article may be AI-generated.",
        "",
        ...SIGN_OFF,
      ),
  },
  {
    // From the note sent 2026-08-12.
    id: "format",
    label: "Formatting request",
    subject: (c) => `Formatting: “${c.title}”`,
    body: (c) =>
      lines(
        hello(c),
        "",
        "Please check your manuscript against the formatting requirements on our submission page and resubmit it in that format. We are unable to review papers that do not follow it.",
        "https://young-innovator.org/submission#formatting-requirements",
        "",
        ...SIGN_OFF,
      ),
  },
  {
    id: "blank",
    label: "Blank email",
    subject: (c) => `About your submission: “${c.title}”`,
    body: (c) => lines(hello(c), "", "", ...SIGN_OFF),
  },
];
