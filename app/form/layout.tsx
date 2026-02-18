import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit Manuscript",
  description:
    "Submit your manuscript to JYI (The Journal of Young Innovators). We welcome high school and college student scholarship.",
  alternates: {
    canonical: "/form",
  },
};

export default function FormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
