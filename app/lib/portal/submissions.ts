import {
  PAYMENT_LABELS,
  STATUS_LABELS,
  type PaymentStatus,
  type SubmissionStatus,
} from "./constants";
import { logEvent, updateSubmission, type Submission } from "./db";

/**
 * Moves a submission to a new status. The fee is charged at submission, so
 * the stage never changes it.
 */
export function changeStatus(
  submission: Submission,
  status: SubmissionStatus,
  editorId: number,
) {
  if (status !== submission.status) {
    updateSubmission(submission.id, { status });
    logEvent(
      submission.id,
      editorId,
      "status",
      `Status changed from ${STATUS_LABELS[submission.status]} to ${STATUS_LABELS[status]}`,
      { from: submission.status, to: status },
    );
  }
}

export function setPaymentStatus(
  submission: Submission,
  payment: PaymentStatus,
  editorId: number,
  note?: string,
) {
  if (payment === submission.payment_status) return;
  updateSubmission(submission.id, { payment_status: payment });
  logEvent(
    submission.id,
    editorId,
    "payment",
    `Fee status changed from ${PAYMENT_LABELS[submission.payment_status]} to ${PAYMENT_LABELS[payment]}` +
      (note ? `: ${note}` : ""),
    { from: submission.payment_status, to: payment },
  );
}
