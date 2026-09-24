import { requirePageEditor } from "@/lib/portal/auth";
import { all, type Editor } from "@/lib/portal/db";
import PortalShell from "../_components/PortalShell";
import { PANEL, PageTitle, formatDate } from "../_components/ui";
import { EditorRowActions, InviteForm } from "./EditorControls";

export const metadata = { title: "Editors" };

export default async function EditorsPage() {
  const editor = await requirePageEditor({ admin: true });
  const editors = all<Editor>("SELECT * FROM editors ORDER BY disabled, name");

  return (
    <PortalShell editor={editor}>
      <PageTitle title="Editors" eyebrow="Portal access" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className={`${PANEL} min-w-0`} aria-label="Editor accounts">
          <ul className="divide-y divide-black/10">
            {editors.map((e) => (
              <li key={e.id} className={`px-5 py-4 ${e.disabled ? "opacity-55" : ""}`}>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="font-text text-[15px] font-semibold">{e.name}</p>
                  <p className="font-text text-sm text-black/60">{e.email}</p>
                  {!!e.is_admin && (
                    <span className="rounded-full bg-primary px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                      Admin
                    </span>
                  )}
                  {!!e.disabled && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-black/60">No access</span>
                  )}
                </div>
                <p className="mt-0.5 font-mono text-[11px] text-black/50">
                  {e.password_hash
                    ? e.last_login_at
                      ? `Last signed in ${formatDate(e.last_login_at)}`
                      : "Has not signed in yet"
                    : "Invite not accepted yet"}
                </p>
                <div className="mt-2">
                  <EditorRowActions id={e.id} disabled={!!e.disabled} isAdmin={!!e.is_admin} isSelf={e.id === editor.id} />
                </div>
              </li>
            ))}
          </ul>
        </section>
        <aside className={`${PANEL} h-fit p-5`}>
          <h2 className="mb-4 font-display text-2xl font-normal">Invite an editor</h2>
          <InviteForm />
        </aside>
      </div>
    </PortalShell>
  );
}
