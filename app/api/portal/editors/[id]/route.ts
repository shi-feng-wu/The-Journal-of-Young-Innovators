import { ApiError, handle, requireApiEditor } from "@/lib/portal/auth";
import { get, run, type Editor } from "@/lib/portal/db";
import { sendInvite } from "@/lib/portal/invites";

export const runtime = "nodejs";

export const PATCH = handle(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const admin = await requireApiEditor(request, { admin: true });
    const id = Number((await params).id);
    const editor = get<Editor>("SELECT * FROM editors WHERE id = :id", { id });
    if (!editor) throw new ApiError(404, "Editor not found.");
    const body = (await request.json().catch(() => ({}))) as {
      disabled?: boolean;
      isAdmin?: boolean;
      sendInvite?: boolean;
    };

    if (editor.id === admin.id && (body.disabled || body.isAdmin === false)) {
      throw new ApiError(400, "You cannot remove your own access.");
    }
    if (body.disabled !== undefined) {
      run("UPDATE editors SET disabled = :disabled WHERE id = :id", {
        disabled: body.disabled ? 1 : 0,
        id,
      });
      if (body.disabled) run("DELETE FROM sessions WHERE editor_id = :id", { id });
    }
    if (body.isAdmin !== undefined) {
      run("UPDATE editors SET is_admin = :isAdmin WHERE id = :id", {
        isAdmin: body.isAdmin ? 1 : 0,
        id,
      });
    }
    if (body.sendInvite) {
      try {
        await sendInvite(editor, request.headers.get("origin")!, admin.name);
      } catch (error) {
        console.error("[portal] invite email failed", error);
        throw new ApiError(502, "The email could not be sent.");
      }
    }
    return Response.json({ ok: true });
  },
);
