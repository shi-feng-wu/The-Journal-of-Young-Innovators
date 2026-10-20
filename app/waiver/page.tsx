import type { Metadata } from "next";
import Hero from "@/components/Hero";
import WaiverForm from "./WaiverForm";

export const metadata: Metadata = {
  title: "Fee Waiver Request",
  description:
    "Ask The Journal of Young Innovators to waive the submission fee for a manuscript you have submitted.",
  robots: { index: false },
};

export default async function WaiverPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; email?: string }>;
}) {
  const { ref, email } = await searchParams;
  return (
    <div className="min-h-screen bg-primary">
      <Hero
        title="Fee Waiver Request"
        subtitle="If the $65 USD submission fee would keep you from submitting, tell us why. An editor reads every request and replies by email."
      />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-20 pt-10 pb-24">
        <WaiverForm initialRef={ref ?? ""} initialEmail={email ?? ""} />
      </div>
    </div>
  );
}
