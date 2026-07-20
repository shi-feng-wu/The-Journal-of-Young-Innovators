import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fee Waiver Request",
  description:
    "Request a need-based waiver for JYI's $55 submission fee. Waivers are confidential and reviewed independently of editorial decisions.",
  alternates: {
    canonical: "/waiver",
  },
};

export default function WaiverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
