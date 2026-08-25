"use client";

import { Accordion, AccordionItem } from "@heroui/react";
import Hero from "@/components/Hero";
import Link from "next/link";

const faqData = [
  {
    id: 1,
    question: "What if I don't have an advisor?",
    answer:
      "You do not have to have an advisor. But if you do, please list down his/her/their information as well.",
  },
  {
    id: 2,
    question: "What's the total cost to publish?",
    answer: (
      <>
        For the 2025–2026 academic year, submission and publication in JYI are
        free of charge — no submission fees, article processing charges (APCs),
        or publication fees. Beginning with the 2026–2027 academic year, a $65
        USD publication fee per article applies, payable only after acceptance;
        there is no fee to submit for review. Need-based waivers are available{" "}
        <Link href="/waiver" className="underline underline-offset-2">
          upon request
        </Link>
        . See our Policies page for full details.
      </>
    ),
  },
  {
    id: 3,
    question: "How long will the review process take?",
    answer:
      "Editorial decisions are typically communicated within 4–8 weeks of submission, including detailed reviewer feedback regardless of the final decision.",
  },
  {
    id: 4,
    question: "Will I get feedback if my paper is not accepted?",
    answer:
      "Yes. Even if a paper is not accepted, students receive detailed reviewer feedback to help improve their work.",
  },
  {
    id: 5,
    question: "Can more than one student be listed as an author?",
    answer:
      "Yes. Co-authorship is welcomed when each listed author has made a substantive contribution to the work.",
  },
  {
    id: 6,
    question: "Can I revise and resubmit if my paper needs changes?",
    answer:
      "Yes. Many submissions are accepted pending revisions. You'll be given clear guidance on what to improve before final publication.",
  },
  {
    id: 7,
    question: "What disciplines do you accept papers from?",
    answer:
      "We welcome research across all disciplines, including but not limited to healthcare, ethics, humanities, business, science and technology, policy, law, and security—particularly as they relate to AI and innovation.",
  },
  {
    id: 8,
    question: "Do I need to be enrolled in a specific program to submit?",
    answer:
      "You must be currently enrolled in an accredited high school or college. There are no specific program requirements beyond this.",
  },
  {
    id: 9,
    question: "What happens after my paper is accepted?",
    answer:
      "After acceptance, you'll complete any final revisions requested by editors, sign a non-exclusive publishing agreement (you retain copyright), and your paper will be published open access under a CC BY 4.0 license with full attribution.",
  },
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero
        title="Frequently Asked Questions"
        subtitle="Common questions about submitting to our journal."
      />

      {/* FAQ Section (aligned with other pages) */}
      <div className="pb-40">
        <section className="pb-10 pt-10">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-20">
            <Accordion variant="splitted">
              {faqData.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  aria-label={faq.question}
                  title={faq.question}
                  className="mb-4 bg-transparent border-none shadow-none"
                  classNames={{
                    title: "text-3xl font-medium mr-2 cursor-pointer",
                    base: "p-0",
                  }}
                >
                  <p className="text-foreground/80 leading-relaxed">
                    {faq.answer}
                  </p>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </div>
    </div>
  );
}
