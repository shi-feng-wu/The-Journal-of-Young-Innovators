"use client";

import Link from "next/link";
import Hero from "@/components/Hero";
import { Card, CardHeader } from "@heroui/react";
import SiteButton from "@/components/SiteButton";
import { FaChevronCircleRight } from "react-icons/fa";

interface Person {
  name: string;
  affiliation: string;
  role: string;
  team?: string;
  bio?: string;
}

const editors: Person[] = [
  {
    name: "Shanjin Li",
    affiliation: "Stanford University",
    role: "Editor",
    team: "Crystal",
  },
  {
    name: "Geneva Jonathan",
    affiliation: "Harvard University",
    role: "Editor",
    team: "Crystal",
  },
  {
    name: "Jessie Ford",
    affiliation: "Columbia University",
    role: "Editor",
    team: "Clara",
  },
  {
    name: "Claire Chuter",
    affiliation: "Johns Hopkins University",
    role: "Editor",
    team: "Clara",
  },
  {
    name: "Michele Moreau",
    affiliation: "Johns Hopkins University",
    role: "Editor",
  },
  {
    name: "Mariale Hardiman",
    affiliation: "Johns Hopkins University",
    role: "Editor",
  },
  {
    name: "Kris Chesky",
    affiliation: "Johns Hopkins University",
    role: "Editor",
  },
];

const managingEditors: Person[] = [
  {
    name: "Shelby Forbes",
    affiliation: "UNC–Chapel Hill",
    role: "Managing Editor",
  },
  {
    name: "Kai Ding",
    affiliation: "Johns Hopkins University",
    role: "Managing Editor",
  },
  {
    name: "Agu Emmanuel",
    affiliation: "Worcester Polytechnic Institute",
    role: "Managing Editor",
  },
];

const industryCollaborators: Person[] = [
  {
    name: "Tina Hou",
    affiliation: "McKinsey",
    role: "Industry Collaborator",
    team: "Crystal",
  },
  {
    name: "Fuxiao Liu",
    affiliation: "Nvidia",
    role: "Industry Collaborator",
  },
  {
    name: "Jenna Cohen",
    affiliation: "ACT",
    role: "Industry Collaborator",
  },
  {
    name: "Lola Adeyemi",
    affiliation: "Ministry of Health in Nigeria",
    role: "Industry Collaborator",
  },
  {
    name: "Annie Conderacci",
    affiliation: "Center for the American Family",
    role: "Industry Collaborator",
  },
];

const peerEditors: Person[] = [
  {
    name: "Ashley Yu",
    affiliation: "Concord Academy",
    role: "Peer Editor",
  },
  {
    name: "Andrew Leibowitz",
    affiliation: "Cornell University",
    role: "Peer Editor",
  },
  {
    name: "Lilia Chesky",
    affiliation: "Waseda University",
    role: "Peer Editor",
  },
];

function PersonCard({ person }: { person: Person }) {
  return (
    <Card className="max-w-[340px] w-full border-primary border-2 rounded-lg p-2">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <div className="w-12 h-12 bg-primary  shadow-md rounded-full flex flex-col items-center justify-center text-foreground shrink-0">
            <div className="text-sm text-default font-medium leading-tight">
              {person.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          </div>
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-md font-semibold leading-none text-default-600">
              {person.name}
            </h4>
            <h5 className="text-xs tracking-tight text-default-500 font-mono">
              {person.affiliation}
            </h5>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export default function EditorialTeam() {
  return (
    <div className="min-h-screen bg-background">
      <Hero
        title="Editorial Team"
        subtitle="Meet the distinguished scholars and professionals guiding young innovators."
      />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-20 pb-10 pt-10">
        <section className="pb-10">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-4xl mb-12">Editorial Team</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {editors.map((editor, index) => (
                <PersonCard key={index} person={editor} />
              ))}
            </div>
          </div>
        </section>

        <section className="pb-10">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-4xl mb-12">Managing Editors</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {managingEditors.map((editor, index) => (
                <PersonCard key={index} person={editor} />
              ))}
            </div>
          </div>
        </section>

        <section className="pb-10">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-4xl mb-12">
              Industry Collaborators
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {industryCollaborators.map((editor, index) => (
                <PersonCard key={index} person={editor} />
              ))}
            </div>
          </div>
        </section>

        <section className="pb-10">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-4xl mb-8">Peer Editors</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              {peerEditors.map((editor, index) => (
                <PersonCard key={index} person={editor} />
              ))}
            </div>

            <div className="w-full lg:w-190 rounded-2xl border border-black/10 bg-white p-6 shadow-sm space-y-4">
              <p className="text-base leading-relaxed text-gray-700">
                We are seeking a select group of exceptional student editors to
                join our Peer Editor Team. As a Peer Editor, you will review and
                provide feedback on submitted research papers, help maintain the
                academic integrity and quality of the publications, and
                collaborate with an international team of editors and mentors.
              </p>
              <p className="text-base leading-relaxed text-gray-700">
                This is a highly competitive leadership opportunity for students
                passionate about AI, innovative research, and ethics.
              </p>
              <div className="flex justify-end">
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
          </div>
        </section>
      </div>
    </div>
  );
}
