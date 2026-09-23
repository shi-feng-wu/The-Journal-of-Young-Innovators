"use client";

import { Accordion, AccordionItem } from "@heroui/react";
import Link from "next/link";
import Hero from "@/components/Hero";

const faqData = [
  {
    id: 1,
    question: "What if I don't have an advisor?",
    answer:
      "You do not need an advisor. If you have one, please include their information.",
  },
  {
    id: 2,
    question: "What's the total cost to publish?",
    answer: (
      <>
        Submitting is free. If your article is accepted, there is a one-time
        publication fee of $65 USD, and your acceptance email includes a link to
        pay it by card. Articles accepted during the 2025–2026 academic year
        carry no fee. See{" "}
        <Link
          href="/policies#apc"
          className="text-primary underline underline-offset-2 decoration-primary/40 hover:decoration-primary"
        >
          Article Processing Charges
        </Link>{" "}
        for waivers and full details.
      </>
    ),
  },
  {
    id: 3,
    question: "How long will the review process take?",
    answer: (
      <>
        Editorial decisions are typically communicated within 4–8 weeks of
        submission. See{" "}
        <Link
          href="/policies#peer-review"
          className="text-primary underline underline-offset-2 decoration-primary/40 hover:decoration-primary"
        >
          Peer Review
        </Link>{" "}
        for how manuscripts are evaluated.
      </>
    ),
  },
  {
    id: 4,
    question: "Will I get feedback if my paper is not accepted?",
    answer:
      "Yes. If your paper is declined, you still receive detailed comments from the reviewers that you can use to improve the work.",
  },
  {
    id: 5,
    question: "Can more than one student be listed as an author?",
    answer:
      "Yes, as long as each listed author has made a substantive contribution to the work.",
  },
  {
    id: 6,
    question: "Can I revise and resubmit if my paper needs changes?",
    answer:
      "Yes. Many submissions are accepted pending revisions, and the editors will tell you clearly what needs to change before publication.",
  },
  {
    id: 7,
    question: "What disciplines do you accept papers from?",
    answer:
      "We accept research in any discipline, including healthcare, ethics, the humanities, business, science and technology, policy, law, and security. Work that relates to AI and innovation is especially welcome.",
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
      "After acceptance, you'll complete any final revisions requested by editors, sign a non-exclusive publishing agreement (you retain copyright), and pay the $65 USD publication fee unless you have been granted a waiver. Your paper will then be published open access under a CC BY 4.0 license with full attribution.",
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
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-20">
            <Accordion variant="light" className="max-w-[900px] px-0">
              {faqData.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  aria-label={faq.question}
                  title={faq.question}
                  classNames={{
                    base: "border-b border-black/30",
                    trigger: "py-5 px-0 cursor-pointer",
                    title:
                      "font-display font-normal text-xl md:text-2xl text-left text-black",
                    indicator: "text-black/60",
                    content: "px-0 pt-0 pb-6",
                  }}
                >
                  <p className="font-text text-sm md:text-base leading-relaxed text-black/80">
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
