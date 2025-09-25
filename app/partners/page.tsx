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
    abstract: `The Brain-Targeted Teaching® (BTT) Model, created by Dr. Mariale Hardiman—former Vice Dean of the School of Education and current Professor Emeritus—bridges science and practice through a cohesive, six-step framework for effective instruction grounded in the latest research. The Journal of Young Innovators is supported by the principles of Brain-Targeted Teaching, which foster creativity, critical thinking, and research-driven learning for the next generation of changemakers.`,
    link: "https://braintargetedteaching.org/",
  },
  {
    id: 2,
    title: "World Trade Center Institute (WTCI)",
    author: "Leadership & Global Business",
    school: "Mid-Atlantic and Global Network",
    image: "/images/logos/wtci.png",
    abstract: `WTCI helps existing and emerging leaders develop the skills, knowledge, and connections they need to create a healthy economy, environment, and society in the Mid-Atlantic and globally. WTCI extends this mission by preparing students to share ideas, build international networks, and grow as future changemakers—opportunities that the Journal of Young Innovators actively recommends and supports through fellowship programs.`,
    link: "https://wtci.org/",
  },
  {
    id: 3,
    title: "Ding Research Lab (Johns Hopkins University)",
    author: "Cancer Radiotherapy Innovation",
    school: "Johns Hopkins University",
    image: "/images/logos/dinglab.png",
    abstract: `Ding Research Lab is a leading research group dedicated to transforming cancer treatment through innovative radiotherapy technologies and translational science. The lab bridges fundamental discoveries with clinical applications, developing cutting-edge approaches to improve precision, effectiveness, and patient outcomes.
Ding Research Lab is committed to empowering young innovators to explore bold ideas, develop critical skills, and contribute to a healthier future.
`,
    link: "https://dinglab.jh.edu/",
  },
];

export default function Partners() {
  return (
    <div className="min-h-screen -mt-16 bg-gray-100">
      <Hero
        title="Strategic Partners"
        subtitle="Organizations supporting our mission."
      />

      <div className="pt-10 pb-50">
        <section className="py-10">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-20">
            <div className=" mb-12">
              <h2 className="text-3xl md:text-4xl text-black mb-4">
                Our partners.
              </h2>
            </div>

            {partners.map((p, idx) => {
              const right = idx % 2 === 1;
              const hasDate = false;
              const hasIssue = false;
              const dateStr = "";
              return (
                <div className="mb-8" key={p.id}>
                  <Link
                    href={p.link}
                    target={p.link.startsWith("http") ? "_blank" : undefined}
                    rel={
                      p.link.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="block group"
                    aria-label={p.title}
                  >
                    <article className="relative rounded-lg transition-colors hover:bg-white overflow-hidden bg-transparent border-primary border-1 duration-200 ease-in-out">
                      <div className="relative p-8">
                        <div
                          className={`flex flex-col md:flex-row ${right ? "md:flex-row-reverse" : ""} gap-8 md:items-stretch`}
                        >
                          <div
                            className={`md:w-2/3 ${right ? "md:text-right" : ""}`}
                          >
                            <div className="mb-4">
                              {hasDate && (
                                <span className="text-gray-500 ml-4 text-xs">
                                  {dateStr}
                                </span>
                              )}
                              {hasDate && hasIssue && (
                                <span className="text-gray-400 mx-2 text-xs">
                                  ·
                                </span>
                              )}
                              {hasIssue && (
                                <span className="text-gray-600 text-xs">
                                  {/* reserved */}
                                </span>
                              )}
                            </div>
                            <h3 className="text-2xl font-semibold text-black mb-2 line-clamp-2">
                              {p.title}
                            </h3>
                            <div className="mb-4">
                              <p className="text-gray-900 font-semibold text-sm">
                                {p.author}
                              </p>
                              <p className="text-gray-600 text-xs">
                                {p.school}
                              </p>
                            </div>
                            <p className="text-gray-700 text-sm mb-3 line-clamp-4 leading-relaxed">
                              {p.abstract}
                            </p>
                          </div>
                          <div
                            className={`md:w-1/3 flex items-center justify-center ${right ? "md:justify-start" : "md:justify-end"}`}
                          >
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
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
