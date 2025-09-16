import Hero from "@/components/Hero";
import { Card, CardHeader } from "@heroui/react";

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
    affiliation: "Stanford",
    role: "Editor",
    team: "Crystal",
  },
  {
    name: "Geneva Jonathan",
    affiliation: "Harvard",
    role: "Editor",
    team: "Crystal",
  },
  {
    name: "Jessie Ford",
    affiliation: "Columbia",
    role: "Editor",
    team: "Clara",
  },
  {
    name: "Claire Chuter",
    affiliation: "JHU",
    role: "Editor",
    team: "Clara",
  },
  {
    name: "Mariale Hardiman",
    affiliation: "JHU",
    role: "Editor",
  },
];

const managingEditors: Person[] = [
  {
    name: "Shelby Forbes",
    affiliation: "University of North Carolina",
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
    name: "McKinsey Inc (Tina Hou)",
    affiliation: "",
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
];

const juniorEditors: Person[] = [
  {
    name: "Albert Zhou",
    affiliation: "",
    role: "Student Editor",
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
            <h4 className="text-small font-semibold leading-none text-default-600">
              {person.name}
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
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
    <div className="min-h-screen -mt-16 bg-gray-100">
      <Hero
        title="Editorial Team"
        subtitle="Meet the distinguished scholars and professionals guiding young innovators."
      />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-20 py-30">
        <section className="pb-20">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-4xl mb-12">Editorial Team</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {editors.map((editor, index) => (
                <PersonCard key={index} person={editor} />
              ))}
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-4xl mb-12">Managing Editors</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {managingEditors.map((editor, index) => (
                <PersonCard key={index} person={editor} />
              ))}
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-4xl mb-12">Junior Editors</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {juniorEditors.map((editor, index) => (
                <PersonCard key={index} person={editor} />
              ))}
            </div>
          </div>
        </section>

        <section className="pb-20">
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
      </div>
    </div>
  );
}
