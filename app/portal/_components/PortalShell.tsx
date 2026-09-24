import { get, type Editor } from "@/lib/portal/db";
import PortalNav from "./PortalNav";

/** Nav, the page's masthead, then the cream reading surface. */
export default function PortalShell({
  editor,
  masthead,
  children,
}: {
  editor: Editor;
  masthead: React.ReactNode;
  children: React.ReactNode;
}) {
  const lastRun =
    get<{ value: string }>("SELECT value FROM sync_state WHERE key = 'inbox_last_run'")?.value ?? null;
  return (
    <div className="min-h-screen bg-background text-[#111]">
      <PortalNav editorName={editor.name} isAdmin={!!editor.is_admin} lastRun={lastRun} />
      {masthead}
      <div className="mx-auto max-w-[1400px] px-4 pt-10 pb-32 sm:px-6 lg:px-20 lg:pt-12">{children}</div>
    </div>
  );
}
