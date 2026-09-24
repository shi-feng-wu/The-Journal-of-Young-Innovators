// Email templates for the portal composer. Client-safe: plain data only.
// Each one started from a real email the editors sent, rewritten in a
// business-casual voice. Only the names, title and payment link are filled in.
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

const SIGN_OFF = ["Best,", "The JYI editorial team"];

const hi = (c: TemplateContext) => `Hi ${c.firstName || "there"},`;

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    // From the review request sent to a peer reviewer, 2026-04-30.
    // Review is double-blind: nothing here names the author.
    id: "review-request",
    label: "Send to a reviewer",
    audience: "reviewer",
    setsStatus: "in_review",
    subject: () => "Would you review a manuscript for JYI?",
    body: (c) =>
      lines(
        "Hi [Reviewer name],",
        "",
        `Would you be up for reviewing a manuscript for us? It's called “${c.title}”, and it's attached. Our review is double-blind, so please keep it confidential and don't try to work out who wrote it.`,
        "",
        "We'd love your take on how strong and original the argument is and how clearly it's written. Any suggestions for revision are welcome too.",
        "",
        "It helps us if you can score these from 1 to 5:",
        "1. Argument and contribution",
        "2. Clarity and structure",
        "3. Engagement and relevance",
        "",
        "Then tell us what you'd recommend.",
        "",
        "Two to three weeks would be ideal. If that timing doesn't work, or you'd rather pass on this one, just reply and let us know.",
        "",
        "Thanks so much,",
        "The JYI editorial team",
      ),
  },
  {
    // From the acceptance template, for the fee charged only on acceptance.
    id: "accept",
    label: "Accept",
    setsStatus: "accepted",
    subject: (c) => `Good news about “${c.title}”`,
    body: (c) =>
      lines(
        hi(c),
        "",
        `Great news: “${c.title}” has been accepted for publication in The Journal of Young Innovators. Congratulations!`,
        "",
        "Accepted articles have a $65 publication fee. You can pay by card here:",
        c.paymentUrl,
        "",
        "Once it's paid, we'll confirm and get your article scheduled. If the fee would keep you from publishing, just reply and we can talk about a waiver.",
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
    subject: (c) => `Good news about “${c.title}”`,
    body: (c) =>
      lines(
        hi(c),
        "",
        `Great news: “${c.title}” has been accepted for publication in The Journal of Young Innovators. Congratulations, and thanks for all the work you put into it.`,
        "",
        "There's no publication fee for your article. We'll have it up on the journal's website within 30 days.",
        "",
        ...SIGN_OFF,
      ),
  },
  {
    // From the revision request sent 2026-05-29 (reviewer comments attached).
    id: "revisions",
    label: "Request revisions",
    setsStatus: "revisions",
    subject: (c) => `Revisions for “${c.title}”`,
    body: (c) =>
      lines(
        hi(c),
        "",
        `Thanks again for sending us “${c.title}”. Our reviewer liked it and recommended it for publication with a few minor revisions. Their comments are attached.`,
        "",
        "Since the changes are small, you won't need another round of peer review. We'll just do a final read when you send the new version.",
        "",
        "If you can get the revised draft back to us within six weeks, it can go in the next issue. Let us know if you have any questions about the comments.",
        "",
        ...SIGN_OFF,
      ),
  },
  {
    // From the acknowledgement sent 2026-05-19.
    id: "in-review",
    label: "Under review notice",
    setsStatus: "in_review",
    subject: (c) => `“${c.title}” is under review`,
    body: (c) =>
      lines(
        hi(c),
        "",
        "Thanks for submitting to The Journal of Young Innovators. Your article is now with our editorial team for review.",
        "",
        "Review usually takes six to eight weeks. We'll be in touch as soon as we have a decision.",
        "",
        ...SIGN_OFF,
      ),
  },
  {
    // From the decision sent 2026-08-13.
    id: "decline",
    label: "Decline",
    setsStatus: "rejected",
    subject: (c) => `Your submission “${c.title}”`,
    body: (c) =>
      lines(
        hi(c),
        "",
        `Thanks for sending us “${c.title}”. Unfortunately it doesn't meet our criteria for a research article, so we can't accept it for publication.`,
        "",
        "We hope you'll keep writing, and you're welcome to submit again in the future.",
        "",
        ...SIGN_OFF,
      ),
  },
  {
    // From the decision sent 2026-09-21.
    id: "decline-ai",
    label: "Decline for AI content",
    setsStatus: "rejected",
    subject: (c) => `Your submission “${c.title}”`,
    body: (c) =>
      lines(
        hi(c),
        "",
        `Thanks for sending us “${c.title}”. During review we had concerns about how much of the article was written with AI, so we've decided not to move forward with it.`,
        "",
        "We appreciate the time you put into it, and you're welcome to submit new work in the future.",
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
        hi(c),
        "",
        "Thanks for your submission. Our AI detection tool flagged a lot of the article as AI-generated. Could you tell us how you used AI while writing it?",
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
        hi(c),
        "",
        "Thanks for your submission. Before we can review it, it needs to follow our formatting requirements, which are here:",
        "https://young-innovator.org/submission#formatting-requirements",
        "",
        "Could you update the manuscript and send it back to us?",
        "",
        ...SIGN_OFF,
      ),
  },
  {
    id: "blank",
    label: "Blank email",
    subject: (c) => `About “${c.title}”`,
    body: (c) => lines(hi(c), "", "", ...SIGN_OFF),
  },
];
