// Email templates for the portal composer. Client-safe: plain data only.
// Each one started from a real email the editors sent, rewritten in a
// friendly, lightly formal voice. Only the names, title and payment link are filled in.
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

const SIGN_OFF = ["Best regards,", "The Editorial Team", "The Journal of Young Innovators"];

const dear = (c: TemplateContext) => `Dear ${c.firstName || "Author"},`;

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    // From the review request sent to a peer reviewer, 2026-04-30.
    // Review is double-blind: nothing here names the author.
    id: "review-request",
    label: "Send to a reviewer",
    audience: "reviewer",
    setsStatus: "in_review",
    subject: (c) => `Review request: “${c.title}”`,
    body: (c) =>
      lines(
        "Dear [Reviewer name],",
        "",
        `Would you be willing to review a manuscript for The Journal of Young Innovators? It is titled “${c.title}”, and it is attached. Our review is double-blind, so please keep the manuscript confidential and do not try to identify the author.`,
        "",
        "We would especially like your view on the strength and originality of the argument and on how clearly it is written. Suggestions for revision are welcome as well.",
        "",
        "Please score the following from 1 to 5:",
        "1. Argument and contribution",
        "2. Clarity and structure",
        "3. Engagement and relevance",
        "",
        "Then let us know what you would recommend.",
        "",
        "We would be grateful to hear back within two to three weeks. If that timing doesn't work, or you would prefer not to review this one, just reply and let us know.",
        "",
        "Thank you for your time,",
        "The Editorial Team",
        "The Journal of Young Innovators",
      ),
  },
  {
    // From the acceptance template, for the fee charged only on acceptance.
    id: "accept",
    label: "Accept",
    setsStatus: "accepted",
    subject: (c) => `Accepted for publication: “${c.title}”`,
    body: (c) =>
      lines(
        dear(c),
        "",
        `We're pleased to let you know that “${c.title}” has been accepted for publication in The Journal of Young Innovators. Congratulations.`,
        "",
        "Accepted articles carry a $65 publication fee, which you can pay by card here:",
        c.paymentUrl,
        "",
        "Once the payment goes through, we will confirm it and schedule your article for publication. If the fee would keep you from publishing, please reply and we can discuss a waiver.",
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
        dear(c),
        "",
        `We're pleased to let you know that “${c.title}” has been accepted for publication in The Journal of Young Innovators. Congratulations, and thank you for the work you put into it.`,
        "",
        "There is no publication fee for your article. We expect to publish it on the journal's website within 30 days.",
        "",
        ...SIGN_OFF,
      ),
  },
  {
    // From the revision request sent 2026-05-29 (reviewer comments attached).
    id: "revisions",
    label: "Request revisions",
    setsStatus: "revisions",
    subject: (c) => `Revisions requested: “${c.title}”`,
    body: (c) =>
      lines(
        dear(c),
        "",
        `Thank you again for submitting “${c.title}”. Our reviewer has recommended it for publication with a few minor revisions, and their comments are attached.`,
        "",
        "Since the changes are small, the revised manuscript will not need another round of peer review. We will do a final editorial read once you send it.",
        "",
        "If you can return the revised draft within six weeks, it can be included in the next issue. Please let us know if you have any questions about the comments.",
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
        dear(c),
        "",
        "Thank you for submitting to The Journal of Young Innovators. Your article is now under review by our editorial team.",
        "",
        "Review usually takes six to eight weeks, and we will be in touch as soon as we have a decision.",
        "",
        ...SIGN_OFF,
      ),
  },
  {
    // From the decision sent 2026-08-13.
    id: "decline",
    label: "Decline",
    setsStatus: "rejected",
    subject: (c) => `Decision on “${c.title}”`,
    body: (c) =>
      lines(
        dear(c),
        "",
        `Thank you for submitting “${c.title}”. Unfortunately, it does not meet our criteria for a research article, so we are unable to accept it for publication.`,
        "",
        "We hope you will keep writing, and you are welcome to submit new work in the future.",
        "",
        ...SIGN_OFF,
      ),
  },
  {
    // From the decision sent 2026-09-21.
    id: "decline-ai",
    label: "Decline for AI content",
    setsStatus: "rejected",
    subject: (c) => `Decision on “${c.title}”`,
    body: (c) =>
      lines(
        dear(c),
        "",
        `Thank you for submitting “${c.title}”. During review, we had concerns about how much of the article was written with AI, and we have decided not to move forward with it.`,
        "",
        "We appreciate the time you put into your submission, and you are welcome to submit new work in the future.",
        "",
        ...SIGN_OFF,
      ),
  },
  {
    // From the question sent 2026-08-27.
    id: "ai-question",
    label: "Ask about AI use",
    subject: (c) => `A question about “${c.title}”`,
    body: (c) =>
      lines(
        dear(c),
        "",
        "Thank you for your submission. Our AI detection tool flagged much of the article as AI-generated. Could you tell us how you used AI in writing it?",
        "",
        ...SIGN_OFF,
      ),
  },
  {
    // From the note sent 2026-08-12.
    id: "format",
    label: "Formatting request",
    subject: (c) => `Formatting for “${c.title}”`,
    body: (c) =>
      lines(
        dear(c),
        "",
        "Thank you for your submission. Before we can review it, the manuscript needs to follow our formatting requirements, which you can find here:",
        "https://young-innovator.org/submission#formatting-requirements",
        "",
        "Could you please update it and send it back to us?",
        "",
        ...SIGN_OFF,
      ),
  },
  {
    id: "blank",
    label: "Blank email",
    subject: (c) => `About “${c.title}”`,
    body: (c) => lines(dear(c), "", "", ...SIGN_OFF),
  },
];
