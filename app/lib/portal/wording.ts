// The only phrasing the portal writes into a manuscript's history. Every
// entry is either one of these fixed forms or the literal text of an email;
// nothing in the history is a summary.

import { PAYMENT_LABELS, STATUS_LABELS, type PaymentStatus, type SubmissionStatus } from "./constants";

export const SUBMITTED = "Submitted through the website form";

export const sentLine = (to: string, authorEmail: string, subject: string) =>
  to.toLowerCase() === authorEmail.toLowerCase() ? `Emailed author: ${subject}` : `Emailed ${to}: ${subject}`;

export const receivedLine = (
  fromAddress: string,
  fromName: string | null,
  authorEmail: string,
  subject: string,
  withManuscript: boolean,
) => {
  const who = fromAddress.toLowerCase() === authorEmail.toLowerCase() ? "Author" : fromName || fromAddress;
  return withManuscript ? `${who} sent a revised manuscript: ${subject}` : `${who} wrote: ${subject}`;
};

export const importedStatusLine = (status: SubmissionStatus) => `Status set to ${STATUS_LABELS[status]} when imported`;

export const importedFeeLine = (payment: PaymentStatus) => `Fee status set to ${PAYMENT_LABELS[payment]} when imported`;
