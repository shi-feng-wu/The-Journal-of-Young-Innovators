import Hero from "@/components/Hero";
import { Button } from "@heroui/react";

export default function Donate() {
  return (
    <div className="min-h-screen -mt-16 bg-primary">
      <Hero
        title="Donate"
        subtitle="We are a mission-driven organization committed to empowering young minds to pursue bold ideas and real-world impact. Our goal is not for profit, we aim to create opportunities for students through scholarships, mentor honorariums, research support, and competition awards. Your generous contribution directly fuels these programs and helps us continue making a difference."
        additionalContent={
          <Button
            color="primary"
            variant="shadow"
            size="lg"
            className="mt-4 border-2 rounded-lg p-4"
          >
            Donate
          </Button>
        }
      />
    </div>
  );
}
