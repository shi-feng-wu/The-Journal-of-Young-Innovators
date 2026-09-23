import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Issues",
  description:
    "Published issues and articles of The Journal of Young Innovators, with research by high school and college students on AI, leadership, and innovation.",
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
