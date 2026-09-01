import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import SiteButton from "@/components/SiteButton";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support JYI programs, scholarships, and student research initiatives by donating to The Journal of Young Innovators.",
  alternates: {
    canonical: "/donate",
  },
};

export default function Donate() {
  return (
    <div className="min-h-screen bg-primary text-white flex flex-col">
      <Navigation />
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 pb-16">
        <h1 className="hero-text font-display font-normal text-5xl md:text-6xl mb-6">
          Donate
        </h1>
        <p className="hero-text mb-12 max-w-[62ch] font-text text-base leading-relaxed text-white/85">
          The Journal of Young Innovators is a not-for-profit organization.
          Donations pay for student scholarships, mentor honorariums, research
          support, and competition awards. There is no online donation form
          yet, so gifts are arranged by email with the editorial team.
        </p>
        <SiteButton
          href="mailto:editor@young-innovator.org?subject=Donation"
          color="primary"
          variant="shadow"
          size="lg"
          variantStyle="whiteHover"
          className="hero-text border-white text-white"
        >
          Contact Us About Donating
        </SiteButton>
      </div>
    </div>
  );
}
