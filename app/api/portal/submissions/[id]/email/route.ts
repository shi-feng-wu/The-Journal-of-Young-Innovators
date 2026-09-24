import { ApiError, handle, requireApiEditor } from "@/lib/portal/auth";
import { SUBMISSION_STATUSES, type SubmissionStatus } from "@/lib/portal/constants";
import { getSubmission, logEvent, transaction, updateSubmission } from "@/lib/portal/db";
import { MailNotConfiguredError, sendAuthorEmail } from "@/lib/portal/mailer";
import { changeStatus } from "@/lib/portal/submissions";

export const runtime = "nodejs";

const MAX_ATTACHMENT_BYTES = 15 * 1024 * 1024;

export const POST = handle(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const editor = await requireApiEditor(request);
    const id = Number((await params).id);
    const submission = getSubmission(id);
    if (!submission) throw new ApiError(404, "Submission not found.");

    const form = await request.formData();
    let subject = String(form.get("subject") ?? "").trim();
    const text = String(form.get("body") ?? "").trim();
    const setStatus = String(form.get("setStatus") ?? "") as SubmissionStatus | "";
    const waiveFee = form.get("waiveFee") === "true";
    if (!subject || !text) throw new ApiError(400, "Add a subject and a message.");
    if (setStatus && !SUBMISSION_STATUSES.includes(setStatus)) {
      throw new ApiError(400, "Unknown status.");
    }

    // The reference in the subject lets the inbox sync file the author's reply.
    if (!subject.toUpperCase().includes(submission.ref)) subject = `${subject} [${submission.ref}]`;

    const files = form
      .getAll("attachments")
      .filter((f): f is File => typeof f === "object" && "arrayBuffer" in f && f.size > 0);
    const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
    if (totalBytes > MAX_ATTACHMENT_BYTES) {
      throw new ApiError(413, "Attachments must add up to 15 MB or less.");
    }
    const attachments = await Promise.all(
      files.map(async (f) => ({
        filename: f.name,
        content: Buffer.from(await f.arrayBuffer()),
      })),
    );

    try {
      await sendAuthorEmail({ to: submission.email, subject, text, attachments });
    } catch (error) {
      if (error instanceof MailNotConfiguredError) throw new ApiError(500, error.message);
      console.error("[portal] email send failed", error);
      throw new ApiError(502, "The email could not be sent. Nothing was changed.");
    }

    // The status only changes once the email has actually gone out.
    transaction(() => {
      logEvent(id, editor.id, "email", `Emailed author: ${subject}`, {
        to: submission.email,
        subject,
        body: text,
        attachments: attachments.map((a) => a.filename),
      });
      if (setStatus) {
        changeStatus(getSubmission(id)!, setStatus, editor.id, { waiveFee });
      }
      updateSubmission(id, { attention_since: null });
    });

    return Response.json({ ok: true });
  },
);
