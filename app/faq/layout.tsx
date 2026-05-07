import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about submitting to JYI: fees, review timeline, advisor requirements, and feedback policy.",
  alternates: {
    canonical: "/faq",
  },
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
