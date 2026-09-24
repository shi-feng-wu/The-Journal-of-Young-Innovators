import type { Editor } from "@/lib/portal/db";
import PortalNav from "./PortalNav";

export default function PortalShell({
  editor,
  children,
}: {
  editor: Editor;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-primary pb-24 text-white">
      <PortalNav editorName={editor.name} isAdmin={!!editor.is_admin} />
      <div className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-6 lg:px-20 lg:pt-10">
        {children}
      </div>
    </div>
  );
}
