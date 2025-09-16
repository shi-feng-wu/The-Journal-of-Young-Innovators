"use client";

import { Accordion, AccordionItem } from "@heroui/react";
import Hero from "@/components/Hero";

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
    answer:
      "There is a $50 submission fee per author and a $300 post-acceptance fee, covering editing, peer review, indexing, and open access publishing.",
  },
  {
    id: 3,
    question: "How long will the review process take?",
    answer:
      "Our standard review takes 4–8 weeks. You can request a Fast Track Review for a 2–4 week turnaround (additional fee applies).",
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
    answer: "Yes. The submission fee is paid per author.",
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
      "After acceptance, you'll pay the publication fee, complete any final revisions requested by editors, and your paper will be published in our open-access journal with full attribution.",
  },
  {
    id: 10,
    question:
      "Are scholarships available for the submission and publication fees?",
    answer:
      "Yes, need-based scholarships are available by request. Applicants may submit a brief statement of need during the submission process.",
  },
];

export default function FAQ() {
  return (
    <div className="min-h-screen -mt-16 bg-gray-100">
      {/* Hero Section */}
      <Hero
        title="Frequently Asked Questions"
        subtitle="Common questions about submitting to our journal."
      />

      {/* FAQ Section (aligned with other pages) */}
      <div className="pb-40">
        <section className="py-30">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-20">
            <Accordion variant="splitted">
              {faqData.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  aria-label={faq.question}
                  title={faq.question}
                  className="mb-4 bg-transparent border-none shadow-none"
                  classNames={{
                    title: "text-3xl font-medium mr-2",
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
