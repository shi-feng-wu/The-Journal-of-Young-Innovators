// Email templates for the portal composer. Client-safe: plain data only.
// Editors always see and can edit the filled-in text before it is sent.

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
  subject: (c: TemplateContext) => string;
  body: (c: TemplateContext) => string;
}

const signOff = (c: TemplateContext) =>
  [
    "",
    "Best regards,",
    c.editorName,
    "Editorial Team, The Journal of Young Innovators",
    "editor@young-innovator.org",
  ].join("\n");

const greeting = (c: TemplateContext) => `Dear ${c.firstName || "Author"},`;

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "in-review",
    label: "Send to reviewers",
    setsStatus: "in_review",
    subject: (c) => `Your manuscript is under review (${c.ref})`,
    body: (c) =>
      [
        greeting(c),
        "",
        `Thank you for submitting "${c.title}" to The Journal of Young Innovators. Our editors have completed an initial check, and the manuscript has now gone to peer review.`,
        "",
        "Review usually takes several weeks. We will write to you as soon as we have a decision or questions from the reviewers.",
        "",
        `Your submission reference is ${c.ref}. Please include it if you write to us about this manuscript.`,
        signOff(c),
      ].join("\n"),
  },
  {
    id: "revisions",
    label: "Request revisions",
    setsStatus: "revisions",
    subject: (c) => `Revisions requested for "${c.title}" (${c.ref})`,
    body: (c) =>
      [
        greeting(c),
        "",
        `Our reviewers have read "${c.title}" and would like to see some changes before we make a final decision. Their comments are attached to this email.`,
        "",
        "Please revise the manuscript to address each comment, and send the revised .docx file by replying to this email. A short note listing what you changed makes the second round of review much faster.",
        "",
        "If a comment is unclear, or you disagree with one, tell us in your reply and explain your reasoning.",
        signOff(c),
      ].join("\n"),
  },
  {
    id: "accept",
    label: "Accept",
    setsStatus: "accepted",
    subject: (c) => `Accepted for publication: "${c.title}"`,
    body: (c) =>
      [
        greeting(c),
        "",
        `Congratulations. We are pleased to accept "${c.title}" for publication in The Journal of Young Innovators.`,
        "",
        "Accepted articles carry a publication fee of $65 USD. You can pay securely by card at the link below. It is tied to your submission, so we will see the payment as soon as it goes through.",
        "",
        c.paymentUrl,
        "",
        "If the fee would prevent you from publishing, reply to this email and ask about a waiver. Our editors review every request.",
        "",
        "Once the fee is settled, we will be in touch about the final steps before the article goes online.",
        signOff(c),
      ].join("\n"),
  },
  {
    id: "accept-waived",
    label: "Accept and waive fee",
    setsStatus: "accepted",
    waivesFee: true,
    subject: (c) => `Accepted for publication: "${c.title}"`,
    body: (c) =>
      [
        greeting(c),
        "",
        `Congratulations. We are pleased to accept "${c.title}" for publication in The Journal of Young Innovators.`,
        "",
        "There is no publication fee for your article, so there is nothing for you to pay.",
        "",
        "We will be in touch about the final steps before the article goes online.",
        signOff(c),
      ].join("\n"),
  },
  {
    id: "decline",
    label: "Decline",
    setsStatus: "rejected",
    subject: (c) => `Decision on "${c.title}" (${c.ref})`,
    body: (c) =>
      [
        greeting(c),
        "",
        `Thank you for giving us the chance to consider "${c.title}". After careful review, we are unable to accept it for publication in The Journal of Young Innovators.`,
        "",
        "[Add the main reasons for the decision, or attach the reviewer comments.]",
        "",
        "We know how much work goes into a manuscript, and we hope you keep writing. You are welcome to submit new work to the journal in the future.",
        signOff(c),
      ].join("\n"),
  },
  {
    id: "payment-reminder",
    label: "Fee reminder",
    subject: (c) => `Publication fee reminder for "${c.title}"`,
    body: (c) =>
      [
        greeting(c),
        "",
        `This is a reminder that the $65 USD publication fee for "${c.title}" is still outstanding. We will schedule the article for publication once it is paid.`,
        "",
        "You can pay by card here:",
        c.paymentUrl,
        "",
        "If you have already paid, or if you would like to ask about a waiver, just reply to this email.",
        signOff(c),
      ].join("\n"),
  },
  {
    id: "payment-received",
    label: "Payment thank-you",
    subject: (c) => `Payment received for "${c.title}"`,
    body: (c) =>
      [
        greeting(c),
        "",
        `We have received your publication fee for "${c.title}". Thank you. Stripe sends a separate receipt to the email address used at checkout.`,
        "",
        "We will be in touch about the final steps before the article goes online.",
        signOff(c),
      ].join("\n"),
  },
  {
    id: "published",
    label: "Publication notice",
    setsStatus: "published",
    subject: (c) => `"${c.title}" is now published`,
    body: (c) =>
      [
        greeting(c),
        "",
        `Your article "${c.title}" is now live on The Journal of Young Innovators website.`,
        "",
        "[Paste the article link and DOI here.]",
        "",
        "Congratulations on your publication. Feel free to share the link with your school, teachers, and anyone who helped with the research.",
        signOff(c),
      ].join("\n"),
  },
  {
    id: "blank",
    label: "Blank letter",
    subject: (c) => `About your submission "${c.title}" (${c.ref})`,
    body: (c) => [greeting(c), "", "", signOff(c)].join("\n"),
  },
];
