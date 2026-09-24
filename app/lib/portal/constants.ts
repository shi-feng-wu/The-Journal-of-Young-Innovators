// Shared by server code and client components: no Node imports here.

export const SUBMISSION_STATUSES = [
  "received",
  "in_review",
  "revisions",
  "accepted",
  "published",
  "rejected",
  "withdrawn",
] as const;
export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

export const STATUS_LABELS: Record<SubmissionStatus, string> = {
  received: "Received",
  in_review: "In review",
  revisions: "Revisions requested",
  accepted: "Accepted",
  published: "Published",
  rejected: "Declined",
  withdrawn: "Withdrawn",
};

export const PAYMENT_STATUSES = [
  "not_due",
  "due",
  "paid",
  "waived",
  "refunded",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  not_due: "Not due",
  due: "Fee due",
  paid: "Paid",
  waived: "Waived",
  refunded: "Refunded",
};

export type EventType =
  | "created"
  | "status"
  | "payment"
  | "email"
  | "note"
  | "assign"
  | "reply";

export const SUBMISSION_TYPE_LABELS: Record<string, string> = {
  "research-article": "Research Article",
  "literature-review": "Literature Review",
  "opinion-piece": "Opinion Piece",
};

export const GRADE_LABELS: Record<string, string> = {
  "hs-9": "Grade 9",
  "hs-10": "Grade 10",
  "hs-11": "Grade 11",
  "hs-12": "Grade 12",
  "college-1": "College Year 1",
  "college-2": "College Year 2",
  "college-3": "College Year 3",
  "college-4": "College Year 4",
  "college-grad": "Graduate",
};

export const PUBLICATION_FEE_CENTS = 6500;
