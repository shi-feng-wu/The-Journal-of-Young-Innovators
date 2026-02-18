import Hero from "@/components/Hero";
import SiteButton from "@/components/SiteButton";

export default function Donate() {
  return (
    <div className="h-screen bg-primary">
      <Hero
        title="Donate"
        showWave={false}
        sectionClassName="h-screen"
        subtitle="We are a mission-driven organization committed to empowering young minds to pursue bold ideas and real-world impact. Our goal is not for profit, we aim to create opportunities for students through scholarships, mentor honorariums, research support, and competition awards. Your generous contribution directly fuels these programs and helps us continue making a difference."
        additionalContent={
          <SiteButton
            color="primary"
            variant="shadow"
            size="lg"
            variantStyle="whiteHover"
            className="border-white text-white"
          >
            Make a Donation Today
          </SiteButton>
        }
      />
    </div>
  );
}
