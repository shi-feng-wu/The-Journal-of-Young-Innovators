import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Issues",
  description:
    "Explore published JYI issues and articles from young scholars on AI, leadership, and innovation.",
  alternates: {
    canonical: "/issues",
  },
};

export default function IssuesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
