import Hero from "@/components/Hero";
import { Button } from "@heroui/react";

export default function Contact() {
  return (
    <div className="min-h-screen -mt-16 bg-primary">
      <Hero
        title="Contact Us"
        subtitle="Have questions or want to get involved? We'd love to hear from you!"
        additionalContent={
          <div>
            <p className="mb-2">Please include:</p>
            <ul className="list-disc pl-6 space-y-1 mb-12">
              <li>Your Full Name</li>
              <li>School Name</li>
              <li>Current Grade Level</li>
              <li>Your specific question</li>
            </ul>
            <Button
              color="primary"
              variant="shadow"
              size="lg"
              className="border-2 rounded-lg p-4"
            >
              Email Us
            </Button>
          </div>
        }
      />
    </div>
  );
}
