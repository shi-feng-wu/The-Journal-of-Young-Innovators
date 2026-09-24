import { ApiError, handle, requireApiEditor } from "@/lib/portal/auth";
import { get, now, run, type Editor } from "@/lib/portal/db";
import { sendInvite } from "@/lib/portal/invites";

export const runtime = "nodejs";

export const POST = handle(async (request: Request) => {
  const admin = await requireApiEditor(request, { admin: true });
  const body = (await request.json().catch(() => ({}))) as {
    email?: string;
    name?: string;
    isAdmin?: boolean;
  };
  const email = body.email?.trim().toLowerCase() ?? "";
  const name = body.name?.trim() ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !name) {
    throw new ApiError(400, "Enter a name and a valid email address.");
  }
  if (get("SELECT id FROM editors WHERE email = :email", { email })) {
    throw new ApiError(409, "An editor with that email already exists.");
  }
  const { lastInsertRowid } = run(
    `INSERT INTO editors (email, name, is_admin, created_at)
     VALUES (:email, :name, :isAdmin, :createdAt)`,
    { email, name, isAdmin: body.isAdmin ? 1 : 0, createdAt: now() },
  );
  const editor = get<Editor>("SELECT * FROM editors WHERE id = :id", {
    id: Number(lastInsertRowid),
  })!;
  const origin = request.headers.get("origin")!;
  try {
    await sendInvite(editor, origin, admin.name);
    return Response.json({ ok: true, emailed: true });
  } catch (error) {
    console.error("[portal] invite email failed", error);
    return Response.json({ ok: true, emailed: false });
  }
});
