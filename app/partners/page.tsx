"use client";

import Link from "next/link";
import Hero from "@/components/Hero";
import { Image } from "@heroui/react";

const partners = [
  {
    id: 1,
    title: "Brain-Targeted Teaching® (BTT) Model",
    author: "Dr. Mariale Hardiman",
    school: "Johns Hopkins University",
    image: "/images/logos/btt.png",
    abstract: `The Brain-Targeted Teaching® (BTT) Model was created by Dr. Mariale Hardiman, former Vice Dean of the School of Education and current Professor Emeritus. It connects research on learning to classroom practice through a six-step framework for instruction. The Journal of Young Innovators is supported by the principles of Brain-Targeted Teaching.`,
    link: "https://braintargetedteaching.org/",
  },
  {
    id: 2,
    title: "World Trade Center Institute (WTCI)",
    author: "Leadership & Global Business",
    school: "Mid-Atlantic and Global Network",
    image: "/images/logos/wtci.png",
    abstract: `WTCI helps existing and emerging leaders develop the skills, knowledge, and connections they need to create a healthy economy, environment, and society in the Mid-Atlantic and globally. WTCI extends this work to students by helping them share ideas and build international networks. The Journal of Young Innovators recommends and supports those opportunities through its fellowship programs.`,
    link: "https://wtci.org/",
  },
  {
    id: 3,
    title: "Ding Research Lab (Johns Hopkins University)",
    author: "Cancer Radiotherapy Innovation",
    school: "Johns Hopkins University",
    image: "/images/logos/dinglab.png",
    abstract: `Ding Research Lab is a research group working on cancer treatment through radiotherapy technologies and translational science. The lab carries fundamental discoveries into clinical applications, with the aim of improving treatment precision and patient outcomes. The lab sponsors the Journal's student research and innovation competition.`,
    link: "https://dinglab.jh.edu/",
  },
];

export default function Partners() {
  return (
    <div className="min-h-screen  bg-background">
      <Hero
        title="Strategic Partners"
        subtitle="Organizations supporting our mission."
      />

      <div className="pb-24">
        <section className="">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-20">
            {partners.map((p) => (
              <div className="mb-8" key={p.id}>
                <Link
                  href={p.link}
                  target={p.link.startsWith("http") ? "_blank" : undefined}
                  rel={
                    p.link.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  className="block group"
                  aria-label={p.title}
                >
                  <article className="relative rounded-lg transition-colors hover:bg-white overflow-hidden bg-transparent duration-200 ease-in-out">
                    <div className="relative p-8">
                      <div className="flex flex-col md:flex-row gap-8 md:items-stretch">
                        <div className="md:w-2/3">
                          <h3 className="text-2xl text-black mb-2">
                            {p.title}
                          </h3>
                          <div className="mb-4">
                            <p className="text-black/80 font-semibold text-sm">
                              {p.author}
                            </p>
                            <p className="text-black/60 text-xs">{p.school}</p>
                          </div>
                          <p className="text-black/80 text-sm mb-3 leading-relaxed">
                            {p.abstract}
                          </p>
                        </div>
                        <div className="md:w-1/3 flex items-center justify-center md:justify-end">
                          <div className="w-full md:w-auto rounded-md p-4 md:p-6 flex items-center justify-center">
                            <Image
                              src={p.image}
                              alt={p.title}
                              className="h-34 object-contain"
                            ></Image>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </div>
            ))}

            <p className="mt-4 px-8 font-text text-sm md:text-base leading-relaxed text-black/80">
              To discuss a partnership, write to{" "}
              <a
                href="mailto:editor@young-innovator.org"
                className="text-primary underline"
              >
                editor@young-innovator.org
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
