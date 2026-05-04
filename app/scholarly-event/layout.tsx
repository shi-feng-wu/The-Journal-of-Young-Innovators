import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Innovation Challenge Series",
  description:
    "National competitions for high school and college students presenting original work in AI, innovation, data ethics, and biomedical technologies.",
  alternates: {
    canonical: "/scholarly-event",
  },
};

export default function ScholarlyEventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
