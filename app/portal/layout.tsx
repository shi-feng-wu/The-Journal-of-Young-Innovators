import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Editor Portal", template: "%s | JYI Editor Portal" },
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
