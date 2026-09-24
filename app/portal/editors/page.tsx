import { requirePageEditor } from "@/lib/portal/auth";
import { all, type Editor } from "@/lib/portal/db";
import PortalShell from "../_components/PortalShell";
import { META, Masthead, formatDate } from "../_components/ui";
import { EditorRowActions, InviteForm } from "./EditorControls";

export const metadata = { title: "Editors" };

export default async function EditorsPage() {
  const editor = await requirePageEditor({ admin: true });
  const editors = all<Editor & { handling: number }>(
    `SELECT editors.*,
            (SELECT COUNT(*) FROM submissions
              WHERE assigned_editor_id = editors.id
                AND status IN ('received','in_review','revisions','accepted')) AS handling
       FROM editors ORDER BY disabled, name`,
  );
  const active = editors.filter((e) => !e.disabled).length;

  return (
    <PortalShell
      editor={editor}
      masthead={
        <Masthead
          title="Editors"
          subtitle={`${active} ${active === 1 ? "person has" : "people have"} access to the portal. Admins can invite and remove editors.`}
        />
      }
    >
      <div className="grid gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1fr)_340px]">
        <ol className="min-w-0">
          {editors.map((e) => (
            <li
              key={e.id}
              className={`grid gap-y-3 border-t border-black/30 py-6 sm:grid-cols-[minmax(0,1fr)_170px] sm:gap-x-8 ${e.disabled ? "opacity-50" : ""}`}
            >
              <div className="min-w-0">
                <h2 className="font-display text-[26px] leading-tight">
                  {e.name}
                  {e.id === editor.id && <span className="ml-3 font-text text-sm text-[#111]/50">you</span>}
                </h2>
                <p className="mt-1.5 font-mono text-[13px] text-[#111]/75">{e.email}</p>
                <div className="mt-4">
                  <EditorRowActions id={e.id} disabled={!!e.disabled} isAdmin={!!e.is_admin} isSelf={e.id === editor.id} />
                </div>
              </div>
              <div className={`${META} sm:text-right`}>
                <span className="block text-[#111]/85">
                  {e.disabled ? "No access" : e.is_admin ? "Admin" : "Editor"}
                </span>
                <span className="block">
                  {e.handling} open {e.handling === 1 ? "manuscript" : "manuscripts"}
                </span>
                <span className="block">
                  {!e.password_hash
                    ? "Invite pending"
                    : e.last_login_at
                      ? `Seen ${formatDate(e.last_login_at)}`
                      : "Never signed in"}
                </span>
              </div>
            </li>
          ))}
        </ol>
        <aside>
          <div className="bg-primary px-6 py-7 text-white lg:sticky lg:top-8 lg:px-8 lg:py-9">
            <h2 className="font-display text-[28px] leading-tight">Invite an editor</h2>
            <p className="mt-2 mb-6 font-text text-[15px] leading-relaxed text-white/80">
              They get an email with a link to choose a password. The link works once, for 72 hours.
            </p>
            <InviteForm />
          </div>
        </aside>
      </div>
    </PortalShell>
  );
}
