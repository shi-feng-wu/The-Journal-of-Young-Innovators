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
    affiliation: "Stanford University",
    role: "Editor",
    team: "Crystal",
    bio: "Research focus on AI ethics and policy",
  },
  {
    name: "Raj Choudhury",
    affiliation: "Harvard University",
    role: "Editor",
    team: "Crystal",
    bio: "Expert in technology management and innovation",
  },
  {
    name: "Geneva Jonathan",
    affiliation: "Harvard University",
    role: "Editor",
    team: "Crystal",
    bio: "Specializes in interdisciplinary AI research",
  },
  {
    name: "Jessie Ford",
    affiliation: "Columbia University",
    role: "Editor",
    team: "Clara",
    bio: "Focus on educational technology and innovation",
  },
  {
    name: "Claire Chuter",
    affiliation: "Johns Hopkins University",
    role: "Editor",
    team: "Clara",
    bio: "Research in healthcare AI applications",
  },
  {
    name: "Mariale Hardiman",
    affiliation: "Johns Hopkins University",
    role: "Editor",
    team: "",
    bio: "Expert in education and neuroscience",
  },
  {
    name: "Brian Berkey",
    affiliation: "Wharton, University of Pennsylvania",
    role: "Editor",
    team: "Clara",
    bio: "Philosophy and ethics of technology",
  },
  {
    name: "Henry Smith",
    affiliation: "Department of Education",
    role: "Editor",
    team: "Clara",
    bio: "Educational policy and technology integration",
  },
  {
    name: "Jackie Renfrow",
    affiliation: "Johns Hopkins University",
    role: "Editor",
    team: "Clara",
    bio: "Research methodology and academic writing",
  },
];

const managingEditors: Person[] = [
  {
    name: "Shelby Forbes",
    affiliation: "University of North Carolina",
    role: "Managing Editor",
  },
  {
    name: "Clara Ma",
    affiliation: "Johns Hopkins University",
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
    name: "Kongli Liu",
    affiliation: "Google",
    role: "Industry Collaborator",
    team: "Crystal",
  },
  {
    name: "Tina Hou",
    affiliation: "McKinsey & Company",
    role: "Industry Collaborator",
    team: "Crystal",
  },
  {
    name: "Fuxiao Liu",
    affiliation: "NVIDIA",
    role: "Industry Collaborator",
    team: "",
  },
];

function PersonCard({ person }: { person: Person }) {
  return (
    <Card className="max-w-[340px] w-full border-primary border-2 rounded-lg p-2">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <div className="w-12 h-12 bg-primary  shadow-md rounded-full flex flex-col items-center justify-center text-foreground shrink-0">
            <div className="text-sm text-white font-medium leading-tight">
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
