import Hero from "@/components/Hero";

export default function Partners() {
  return (
    <div className="min-h-screen -mt-16 bg-gray-100">
      <Hero
        title="Strategic Partners"
        subtitle="Organizations supporting our mission."
      />

      <div className="pb-40">
        <section className="py-30">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-20 space-y-10">
            <div>
              <h2 className="text-2xl md:text-4xl mb-6">
                Brain-Targeted Teaching® (BTT) Model
              </h2>
              <p className="text-sm md:text-md mb-8">
                The Brain-Targeted Teaching® (BTT) Model, created by Dr.
                Mariale Hardiman—former Vice Dean of the School of Education and
                current Professor Emeritus—bridges science and practice through
                a cohesive, six-step framework for effective instruction
                grounded in the latest research.
              </p>
              <p className="text-sm md:text-md mb-2">
                The Journal of Young Innovators is supported by the principles
                of Brain-Targeted Teaching, which foster creativity, critical
                thinking, and research-driven learning for the next generation
                of changemakers.
              </p>
              <a
                className="text-primary text-sm underline"
                href="https://braintargetedteaching.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                braintargetedteaching.org
              </a>
            </div>

            <div>
              <h2 className="text-2xl md:text-4xl mb-6">
                World Trade Center Institute (WTCI)
              </h2>
              <p className="text-sm md:text-md mb-8">
                WTCI helps existing and emerging leaders develop the skills,
                knowledge, and connections they need to create a healthy
                economy, environment, and society in the Mid-Atlantic and
                globally.
              </p>
              <p className="text-sm md:text-md mb-2">
                WTCI extends this mission by preparing students to share ideas,
                build international networks, and grow as future
                changemakers—opportunities that the Journal of Young Innovators
                actively recommends and supports through fellowship programs.
              </p>
              <a
                className="text-primary text-sm underline"
                href="https://wtci.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                wtci.org
              </a>
            </div>

            <div>
              <h2 className="text-2xl md:text-4xl mb-6">Ding Research Lab</h2>
              <p className="text-sm md:text-md mb-8">
                Ding Research Lab is a leading research group dedicated to
                transforming cancer treatment through innovative radiotherapy
                technologies and translational science. The lab bridges
                fundamental discoveries with clinical applications, developing
                cutting-edge approaches to improve precision, effectiveness, and
                patient outcomes.
              </p>
              <p className="text-sm md:text-md mb-2">
                Ding Research Lab is committed to empowering young innovators to
                explore bold ideas, develop critical skills, and contribute to a
                healthier future.
              </p>
              <a
                className="text-primary text-sm underline"
                href="https://dinglab.jh.edu/"
                target="_blank"
                rel="noopener noreferrer"
              >
                dinglab.jh.edu
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
