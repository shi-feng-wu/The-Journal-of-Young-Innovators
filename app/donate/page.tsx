import type { Metadata } from "next";
import Hero from "@/components/Hero";
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
    <div className="min-h-screen bg-primary">
      <Hero
        title="Donate"
        subtitle="The Journal of Young Innovators is a not-for-profit organization."
      />
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-20 pt-10 pb-24 text-white">
        <p className="max-w-[62ch] font-text text-base leading-relaxed text-white/85">
          Donations pay for student scholarships, mentor honorariums, research
          support, and competition awards. There is no online donation form yet,
          so gifts are arranged by email with the editorial team.
        </p>
        <div className="mt-10">
          <SiteButton
            href="mailto:editor@young-innovator.org?subject=Donation"
            color="primary"
            variant="shadow"
            size="lg"
            variantStyle="whiteHover"
            className="border-white text-white"
          >
            Contact Us About Donating
          </SiteButton>
        </div>
      </div>
    </div>
  );
}
