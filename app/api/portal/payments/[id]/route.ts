import { ApiError, handle, requireApiEditor } from "@/lib/portal/auth";
import { getSubmissionByRef } from "@/lib/portal/db";
import { assignPayment } from "@/lib/portal/payments";

export const runtime = "nodejs";

/** Links an unmatched payment to a submission, given its reference. */
export const POST = handle(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const editor = await requireApiEditor(request);
    const { ref } = (await request.json().catch(() => ({}))) as { ref?: string };
    const submission = ref ? getSubmissionByRef(ref.trim().toUpperCase()) : undefined;
    if (!submission) throw new ApiError(404, "No submission has that reference.");
    assignPayment(Number((await params).id), submission.id, editor.id);
    return Response.json({ ok: true });
  },
);
