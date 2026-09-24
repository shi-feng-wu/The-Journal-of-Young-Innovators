import nodemailer from "nodemailer";

export const EDITOR_INBOX = process.env.SUBMISSION_TO ?? "editor@young-innovator.org";

export class MailNotConfiguredError extends Error {
  constructor() {
    super(
      "Email service is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS.",
    );
  }
}

export function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) throw new MailNotConfiguredError();

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  const from =
    process.env.SUBMISSION_FROM ?? `The Journal of Young Innovators <${user}>`;
  return { transporter, from };
}

export interface OutgoingEmail {
  to: string;
  subject: string;
  text: string;
  attachments?: Array<{ filename: string; content: Buffer }>;
}

/**
 * Sends an author-facing email from the journal address. Replies go to the
 * editor inbox, and a blind copy lands there too so the inbox keeps the full
 * thread (set PORTAL_BCC_INBOX=false to turn that off).
 */
export async function sendAuthorEmail(email: OutgoingEmail) {
  const { transporter, from } = getTransport();
  const bcc =
    process.env.PORTAL_BCC_INBOX === "false" ? undefined : EDITOR_INBOX;
  return transporter.sendMail({
    from,
    to: email.to,
    bcc,
    replyTo: EDITOR_INBOX,
    subject: email.subject,
    text: email.text,
    attachments: email.attachments,
  });
}
