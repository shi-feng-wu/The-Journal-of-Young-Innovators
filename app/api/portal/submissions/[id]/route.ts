import { ApiError, handle, requireApiEditor } from "@/lib/portal/auth";
import {
  PAYMENT_STATUSES,
  SUBMISSION_STATUSES,
  type PaymentStatus,
  type SubmissionStatus,
} from "@/lib/portal/constants";
import { get, getSubmission, logEvent, transaction, updateSubmission, type Editor } from "@/lib/portal/db";
import { changeStatus, setPaymentStatus } from "@/lib/portal/submissions";

export const runtime = "nodejs";

interface PatchBody {
  status?: SubmissionStatus;
  waiveFee?: boolean;
  paymentStatus?: PaymentStatus;
  paymentNote?: string;
  assignedEditorId?: number | null;
  note?: string;
  /** Clears the "author replied" flag. */
  handled?: boolean;
}

export const PATCH = handle(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const editor = await requireApiEditor(request);
    const id = Number((await params).id);
    const body = (await request.json().catch(() => ({}))) as PatchBody;

    transaction(() => {
      if (!getSubmission(id)) throw new ApiError(404, "Submission not found.");

      if (body.status !== undefined) {
        if (!SUBMISSION_STATUSES.includes(body.status)) {
          throw new ApiError(400, "Unknown status.");
        }
        changeStatus(getSubmission(id)!, body.status, editor.id, {
          waiveFee: body.waiveFee,
        });
        updateSubmission(id, { attention_since: null });
      }

      if (body.handled) {
        updateSubmission(id, { attention_since: null });
        logEvent(id, editor.id, "note", "Marked the author's reply as handled");
      }

      if (body.paymentStatus !== undefined) {
        if (!PAYMENT_STATUSES.includes(body.paymentStatus)) {
          throw new ApiError(400, "Unknown fee status.");
        }
        setPaymentStatus(
          getSubmission(id)!,
          body.paymentStatus,
          editor.id,
          body.paymentNote?.trim() || undefined,
        );
      }

      if (body.assignedEditorId !== undefined) {
        const assignee = body.assignedEditorId
          ? get<Editor>("SELECT * FROM editors WHERE id = :id", {
              id: body.assignedEditorId,
            })
          : null;
        if (body.assignedEditorId && !assignee) {
          throw new ApiError(400, "Unknown editor.");
        }
        updateSubmission(id, { assigned_editor_id: assignee?.id ?? null });
        logEvent(
          id,
          editor.id,
          "assign",
          assignee ? `Assigned to ${assignee.name}` : "Unassigned",
        );
      }

      const note = body.note?.trim();
      if (note) logEvent(id, editor.id, "note", note);
    });

    return Response.json({ ok: true });
  },
);
