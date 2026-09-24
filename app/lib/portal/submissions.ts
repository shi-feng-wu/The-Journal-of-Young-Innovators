import {
  PAYMENT_LABELS,
  STATUS_LABELS,
  type PaymentStatus,
  type SubmissionStatus,
} from "./constants";
import { logEvent, updateSubmission, type Submission } from "./db";

/**
 * Moves a submission to a new status and keeps the fee state consistent:
 * acceptance makes the fee due (or waived), and leaving acceptance clears a
 * fee that was never paid.
 */
export function changeStatus(
  submission: Submission,
  status: SubmissionStatus,
  editorId: number,
  opts: { waiveFee?: boolean } = {},
) {
  let payment: PaymentStatus = submission.payment_status;
  if (status === "accepted" || status === "published") {
    if (payment === "not_due") payment = opts.waiveFee ? "waived" : "due";
    if (payment === "due" && opts.waiveFee) payment = "waived";
  } else if (payment === "due") {
    payment = "not_due";
  }

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
  if (payment !== submission.payment_status) {
    setPaymentStatus(submission, payment, editorId);
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
