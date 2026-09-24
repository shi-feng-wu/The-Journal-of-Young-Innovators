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
  /** Who the letter goes to. Reviewer letters get an editable To field. */
  audience?: "author" | "reviewer";
  subject: (c: TemplateContext) => string;
  body: (c: TemplateContext) => string;
}

const lines = (...parts: string[]) => parts.join("\n");

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    // Review request sent to a peer reviewer, 2026-04-30.
    id: "review-request",
    label: "Send to a reviewer",
    audience: "reviewer",
    setsStatus: "in_review",
    subject: (c) => `Peer Review Request: “${c.title}”`,
    body: (c) =>
      lines(
        "Hi [Reviewer name],",
        "",
        `We are reaching out to invite you to serve as a peer reviewer for a manuscript titled “${c.title}.” Given your editorial expertise, your perspective would be especially valuable in assessing this piece.`,
        "",
        "In your review, please focus on the strength and originality of the central argument, clarity and organization, and how effectively the manuscript engages a broader academic and professional audience. Suggestions for refinement or repositioning are also welcome.",
        "",
        "To help guide your feedback, we would appreciate it if you could consider and rate the following:",
        "",
        "1. Argument & Contribution – How strong and original is the central argument? (Rating: 1–5)",
        "2. Clarity & Structure – How clear, coherent, and well-organized is the manuscript? (Rating: 1–5)",
        "3. Engagement & Relevance – How effectively does the manuscript engage its intended audience and contribute to the field? (Rating: 1–5)",
        "4. Final Decision - Can this paper be published? What is the overall rating?",
        "",
        "We would appreciate receiving your feedback within the next 2–3 weeks. Please let us know if that timeline works for you.",
        "",
        "Thank you for your time and for helping uphold the quality of our publication.",
        "",
        "Best regards,",
        "Editor Team",
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
        `Dear ${c.firstName || "Author"},`,
        "",
        `We are pleased to inform you that following peer review, your manuscript, “${c.title},” has been accepted for publication in the Journal of Young Innovators.`,
        "",
        "Accepted articles carry a publication fee of $65 USD. Please complete the payment using the following link:",
        `Submit Payment (${c.paymentUrl})`,
        "",
        "Once your payment has been processed, our team will send you a confirmation and schedule your article for publication. If the fee would prevent you from publishing, or if you have any questions, please reply to this email.",
        "",
        "Sincerely,",
        "JYI Administration",
      ),
  },
  {
    // Acceptance sent 2026-08-18 (no fee).
    id: "accept-waived",
    label: "Accept, no fee",
    setsStatus: "accepted",
    waivesFee: true,
    subject: (c) => `Publication decision: “${c.title}”`,
    body: (c) =>
      lines(
        `Dear ${c.firstName || "Author"},`,
        "",
        `We are writing to inform you that following peer review, your manuscript, “${c.title},” has been approved for publication to our journal.`,
        "",
        "We would like to commend you on this achievement and your commitment to advancing academic research. Please expect your article to be published to the journal’s website within 30 days.",
        "",
        "Sincerely,",
        "The Editorial Team",
        "The Journal of Young Innovators",
      ),
  },
  {
    // Revision request sent 2026-05-29 (reviewer feedback attached).
    id: "revisions",
    label: "Request revisions",
    setsStatus: "revisions",
    subject: () => "Revision Request",
    body: (c) =>
      lines(
        `Dear ${c.firstName || "Author"},`,
        "",
        `Thank you for submitting your manuscript, “${c.title}” to the Journal of Young Innovators.`,
        "",
        "Following peer review, we are pleased to inform you that the editorial team has recommended your manuscript for publication pending minor revisions. The reviewer found the article to be a valuable contribution to the field and has suggested only limited revisions to strengthen the final version of the manuscript.",
        "",
        "Because the requested revisions are minor in scope, your revised manuscript will not require a second round of peer review and will instead undergo final editorial review upon resubmission.",
        "",
        "Please note that publication is contingent upon satisfactorily addressing the attached reviewer feedback.",
        "",
        "To ensure inclusion in the forthcoming issue, we kindly request that you submit your revised draft within six (6) weeks of the date of this letter.",
        "",
        "We appreciate your contribution to the Journal of Young Innovators and look forward to receiving your revised manuscript.",
        "",
        "Sincerely,",
        "The Editorial Team",
        "Journal of Young Innovators",
      ),
  },
  {
    // Acknowledgement sent 2026-05-19.
    id: "in-review",
    label: "Under review notice",
    setsStatus: "in_review",
    subject: (c) => `Re: Submission Received: ${c.title}`,
    body: (c) =>
      lines(
        `Hi ${c.firstName || "there"},`,
        "",
        "Thank you for your submission to The Journal of Young Innovators. Your article has been received and is currently under review by our editorial team.",
        "",
        "Please allow approximately 6–8 weeks for the review process to be completed. We appreciate your patience and interest in contributing to our journal.",
        "",
        "Best regards,",
        "The Editorial Team",
      ),
  },
  {
    // Decision sent 2026-08-13.
    id: "decline",
    label: "Decline",
    setsStatus: "rejected",
    subject: () => "Submission Decision",
    body: (c) =>
      lines(
        `Dear ${c.firstName || "Author"},`,
        "",
        "Thank you for your submission. However, the attached manuscript does not meet our criteria for a research article, and we are therefore unable to accept it for publication.",
        "",
        "We wish you the best of luck with your future submissions.",
        "",
        "Editorial Team",
      ),
  },
  {
    // Decision sent 2026-09-21.
    id: "decline-ai",
    label: "Decline for AI content",
    setsStatus: "rejected",
    subject: (c) => `Re: Submission Received: ${c.title}`,
    body: (c) =>
      lines(
        `Hi ${c.firstName || "there"},`,
        "",
        `Thank you for submitting your article, “${c.title},” for consideration on our website.`,
        "",
        "As part of our review process, we identified concerns regarding the extent of AI-generated content in the article. After careful consideration, we have decided not to move forward with the submission for publication at this time.",
        "",
        "We appreciate the time and effort you put into your submission and thank you for your interest in contributing to our website.",
        "",
        "Best regards,",
        "The Editorial Team",
      ),
  },
  {
    // Question sent 2026-08-27.
    id: "ai-question",
    label: "Ask about AI use",
    subject: (c) => `Re: New Submission: ${c.title}`,
    body: () =>
      lines(
        "Hi There,",
        "",
        "Thank you for your submission. Could you please clarify how much AI was used in writing the article? Our AI detection tool indicates that the article may contain 100% AI-generated content.",
        "",
        "Editor Team",
      ),
  },
  {
    // Note sent 2026-08-12.
    id: "format",
    label: "Formatting request",
    subject: (c) => `Re: New Submission: ${c.title}`,
    body: () =>
      lines(
        "Hi There,",
        "",
        "Please check the format in the page of requirement. We do not accept papers that are not aligned with our format.",
        "",
        "Editor team",
      ),
  },
  {
    id: "blank",
    label: "Blank letter",
    subject: (c) => `Re: Submission Received: ${c.title}`,
    body: (c) => lines(`Hi ${c.firstName || "there"},`, "", "", "Best regards,", "The Editorial Team"),
  },
];
