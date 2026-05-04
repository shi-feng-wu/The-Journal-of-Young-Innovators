import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Team",
  description:
    "Meet the editors, advisors, and reviewers guiding JYI — scholars and professionals from Stanford, Harvard, Johns Hopkins, and beyond.",
  alternates: {
    canonical: "/editorial-team",
  },
};

export default function EditorialTeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
