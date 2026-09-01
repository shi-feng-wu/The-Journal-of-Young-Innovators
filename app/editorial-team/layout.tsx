import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Team",
  description:
    "The editors, industry collaborators, and peer editors of The Journal of Young Innovators.",
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
