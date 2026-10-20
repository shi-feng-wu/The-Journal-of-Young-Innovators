import {
  logEvent,
  now,
  transaction,
  updateSubmission,
  type Submission,
} from "./db";
import { WAIVER_REQUESTED } from "./wording";

export const MAX_WAIVER_REASON = 2000;

/**
 * Records an author's waiver request. Review stays on hold, and the
 * manuscript is flagged for the editors until one of them answers.
 */
export function requestWaiver(submission: Submission, reason: string) {
  transaction(() => {
    updateSubmission(submission.id, {
      payment_status: "waiver_requested",
      attention_since: now(),
    });
    logEvent(submission.id, null, "waiver", WAIVER_REQUESTED, { reason });
  });
}
