import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Manuscript",
  description:
    "Submit your manuscript to The Journal of Young Innovators. Open to high school and college students; review takes 4–8 weeks (Fast Track available).",
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
