import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
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
    <div className="min-h-screen bg-primary text-white flex flex-col">
      <Navigation />
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 pb-16">
        <h1 className="hero-text font-display font-normal text-5xl md:text-6xl mb-6">
          Contact Us
        </h1>
        <p className="hero-text mb-12 max-w-[62ch] font-text text-base leading-relaxed text-white/85">
          Questions about submitting, reviewing, or working with the journal?
          Email us at{" "}
          <a
            href="mailto:editor@young-innovator.org"
            className="text-white underline underline-offset-4 whitespace-nowrap"
          >
            editor@young-innovator.org
          </a>{" "}
          and include your full name, school name, and grade level.
        </p>
        <SiteButton
          href="mailto:editor@young-innovator.org"
          color="primary"
          variant="shadow"
          size="lg"
          variantStyle="whiteHover"
          className="hero-text border-white text-white"
        >
          Contact our Editorial Team
        </SiteButton>
      </div>
    </div>
  );
}
