import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Strategic Partners",
  description:
    "JYI's strategic partners across academia, research, and global business — including Johns Hopkins, the World Trade Center Institute, and the Ding Research Lab.",
  alternates: {
    canonical: "/partners",
  },
};

export default function PartnersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
