import Hero from "@/components/Hero";
import SiteButton from "@/components/SiteButton";
import Link from "next/link";
import { FaChevronCircleRight } from "react-icons/fa";

interface Person {
  name: string;
  affiliation: string;
}

const editors: Person[] = [
  { name: "Shanjin Li", affiliation: "Stanford University" },
  { name: "Geneva Jonathan", affiliation: "Harvard University" },
  { name: "Jessie Ford", affiliation: "Columbia University" },
  { name: "Claire Chuter", affiliation: "Johns Hopkins University" },
  { name: "Michele Moreau", affiliation: "Johns Hopkins University" },
  { name: "Mariale Hardiman", affiliation: "Johns Hopkins University" },
  { name: "Kris Chesky", affiliation: "Johns Hopkins University" },
];

const editorsInChief: Person[] = [
  { name: "Shelby Forbes", affiliation: "UNC–Chapel Hill" },
  { name: "Kai Ding", affiliation: "Johns Hopkins University" },
  { name: "Agu Emmanuel", affiliation: "Worcester Polytechnic Institute" },
];

const industryCollaborators: Person[] = [
  { name: "Tina Hou", affiliation: "McKinsey" },
  { name: "Fuxiao Liu", affiliation: "Nvidia" },
  { name: "Jenna Cohen", affiliation: "ACT" },
  { name: "Lola Adeyemi", affiliation: "Ministry of Health in Nigeria" },
  { name: "Annie Conderacci", affiliation: "Center for the American Family" },
];

const peerEditors: Person[] = [
  { name: "Ashley Yu", affiliation: "Concord Academy" },
  { name: "Andrew Leibowitz", affiliation: "Cornell University" },
  { name: "Lilia Chesky", affiliation: "Waseda University" },
];

function PeopleList({ people }: { people: Person[] }) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 lg:gap-x-16">
      {people.map((person) => (
        <li
          key={person.name}
          className="border-b border-black/10 py-4 flex flex-col gap-1"
        >
          <p className="font-display text-xl text-black leading-snug">
            {person.name}
          </p>
          <p className="font-text text-sm text-black/60">
            {person.affiliation}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default function EditorialTeam() {
  return (
    <div className="min-h-screen bg-background pb-10">
      <Hero
        title="Editorial Team"
        subtitle="Editors, industry collaborators, and peer editors of The Journal of Young Innovators."
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-20 pt-10 pb-24 space-y-16">
        <p className="max-w-[68ch] font-text text-sm md:text-base leading-relaxed text-black/80">
          Peer review and all editorial decisions are the responsibility of the
          Editors-in-Chief and the Editorial Board. How manuscripts are reviewed
          is set out in the{" "}
          <Link
            href="/policies#peer-review"
            className="text-primary underline underline-offset-2 decoration-primary/40 hover:decoration-primary"
          >
            Peer Review policy
          </Link>
          .
        </p>
        <section>
          <h2 className="font-display text-2xl md:text-3xl text-black tracking-wide mb-6">
            Editors-in-Chief
          </h2>
          <PeopleList people={editorsInChief} />
        </section>

        <section>
          <h2 className="font-display text-2xl md:text-3xl text-black tracking-wide mb-6">
            Editorial Board
          </h2>
          <PeopleList people={editors} />
        </section>

        <section>
          <h2 className="font-display text-2xl md:text-3xl text-black tracking-wide mb-6">
            Industry Collaborators
          </h2>
          <PeopleList people={industryCollaborators} />
        </section>

        <section>
          <h2 className="font-display text-2xl md:text-3xl text-black tracking-wide mb-6">
            Peer Editors
          </h2>
          <p className="max-w-[68ch] mb-8 font-text text-sm md:text-base leading-relaxed text-black/80">
            Peer editors are student editorial assistants. Under the supervision
            of the Editorial Board they read submissions and draft developmental
            comments on writing and structure, which authors receive alongside
            the reviewer reports. Peer editors do not act as peer reviewers and
            take no part in editorial decisions.
          </p>
          <PeopleList people={peerEditors} />

          <div className="mt-16 border-t border-black/30 pt-6 font-text text-sm md:text-base leading-relaxed text-black/80 space-y-5">
            <div>
              <Link
                href="https://docs.google.com/document/d/1Djo8TCZvwwE3tlrPlUXDpOaVyP8aH4PFOnbYlbFfQ78/edit?tab=t.0"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex"
              >
                <SiteButton
                  className="border-primary text-primary"
                  color="primary"
                  variant="ghost"
                  endContent={
                    <FaChevronCircleRight className="text-lg text-current" />
                  }
                >
                  Apply to be a Peer Editor
                </SiteButton>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
