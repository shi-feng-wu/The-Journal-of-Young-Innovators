import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import SiteButton from "@/components/SiteButton";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background pb-40">
      <Hero
        title="Page Not Found"
        subtitle="This page does not exist or has moved."
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-20 pt-10">
        <div className="max-w-[62ch] space-y-5 font-text text-sm md:text-base leading-relaxed text-black/80">
          <p>
            Published articles are listed on the{" "}
            <Link
              href="/issues"
              className="text-primary underline underline-offset-2"
            >
              Issues
            </Link>{" "}
            page. If a link on another site brought you here, email{" "}
            <a
              href="mailto:editor@young-innovator.org"
              className="text-primary underline underline-offset-2"
            >
              editor@young-innovator.org
            </a>{" "}
            and we will fix it.
          </p>
        </div>
        <div className="mt-10">
          <SiteButton
            href="/"
            className="border-primary text-primary"
            color="primary"
            variant="ghost"
          >
            Back to the Home Page
          </SiteButton>
        </div>
      </div>
    </div>
  );
}
