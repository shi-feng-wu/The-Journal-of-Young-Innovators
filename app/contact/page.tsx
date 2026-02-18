import type { Metadata } from "next";
import Hero from "@/components/Hero";
import SiteButton from "@/components/SiteButton";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact JYI (The Journal of Young Innovators) editorial team for questions, collaborations, and support.",
  alternates: {
    canonical: "/contact",
  },
};

export default function Contact() {
  return (
    <div className="h-screen bg-primary">
      <Hero
        showWave={false}
        title="Contact Us"
        subtitle="Have questions or want to get involved? We'd love to hear from you! Email us at editor@young-innovator.org and make sure to include your full name, school name, grade level."
        sectionClassName="h-screen"
        additionalContent={
          <a
            href="mailto:editor@young-innovator.org"
            aria-label="Email the editorial team"
          >
            <SiteButton
              color="primary"
              variant="shadow"
              size="lg"
              variantStyle="whiteHover"
              className="border-white text-white"
            >
              Contact our Editorial Team
            </SiteButton>
          </a>
        }
      />
    </div>
  );
}
