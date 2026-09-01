import type { Metadata } from "next";
import Hero from "@/components/Hero";
import SiteButton from "@/components/SiteButton";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "How to reach the editorial team of The Journal of Young Innovators.",
  alternates: {
    canonical: "/contact",
  },
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-primary">
      <Hero
        title="Contact Us"
        subtitle="Questions about submitting, reviewing, or working with the journal?"
      />
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-20 pt-10 pb-24 text-white">
        <p className="max-w-[62ch] font-text text-base leading-relaxed text-white/85">
          Email us at{" "}
          <a
            href="mailto:editor@young-innovator.org"
            className="text-white underline underline-offset-4 whitespace-nowrap"
          >
            editor@young-innovator.org
          </a>{" "}
          and include your full name, school name, and grade level.
        </p>
        <div className="mt-10">
          <SiteButton
            href="mailto:editor@young-innovator.org"
            color="primary"
            variant="shadow"
            size="lg"
            variantStyle="whiteHover"
            className="border-white text-white"
          >
            Contact our Editorial Team
          </SiteButton>
        </div>
      </div>
    </div>
  );
}
