import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submission Guidelines",
  description:
    "Read JYI submission guidelines, review process, and formatting requirements before submitting your manuscript.",
  alternates: {
    canonical: "/submission",
  },
};

export default function SubmissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
