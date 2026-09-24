import fs from "node:fs";
import path from "node:path";
import { ApiError, handle, requireApiEditor } from "@/lib/portal/auth";
import { get, getSubmissionByRef } from "@/lib/portal/db";
import { dismissMail, inboxFilePath, linkMail, type InboundMail } from "@/lib/portal/inbox";

export const runtime = "nodejs";

/** Link an unmatched email to a manuscript, or dismiss it. */
export const POST = handle(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const editor = await requireApiEditor(request);
    const id = Number((await params).id);
    const body = (await request.json().catch(() => ({}))) as { action?: string; ref?: string };
    if (body.action === "dismiss") {
      dismissMail(id);
      return Response.json({ ok: true });
    }
    if (body.action === "link") {
      const submission = body.ref ? getSubmissionByRef(body.ref.trim().toUpperCase()) : undefined;
      if (!submission) throw new ApiError(404, "No manuscript has that reference.");
      try {
        linkMail(id, submission, editor.id);
      } catch (error) {
        throw new ApiError(409, error instanceof Error ? error.message : "Could not file that email.");
      }
      return Response.json({ ok: true, submissionId: submission.id });
    }
    throw new ApiError(400, "Unknown action.");
  },
);

/** Download an attachment of an unmatched email: ?name=<file> */
export const GET = handle(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    await requireApiEditor(request);
    const mail = get<InboundMail>("SELECT * FROM inbound_mail WHERE id = :id", { id: Number((await params).id) });
    const name = new URL(request.url).searchParams.get("name") ?? "";
    const file = mail ? inboxFilePath(mail, name) : null;
    if (!file) throw new ApiError(404, "File not found.");
    return new Response(fs.readFileSync(file), {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(path.basename(file))}`,
        "Cache-Control": "private, no-store",
      },
    });
  },
);
