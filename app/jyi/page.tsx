import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "JYI",
  description: "JYI stands for The Journal of Young Innovators.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function JyiPage() {
  redirect("/");
}
