import fs from "node:fs";
import path from "node:path";
import { ApiError, handle, requireApiEditor } from "@/lib/portal/auth";
import { SUBMISSION_STATUSES, type SubmissionStatus } from "@/lib/portal/constants";
import { MANUSCRIPT_DIR, getSubmission, logEvent, transaction, updateSubmission } from "@/lib/portal/db";
import { MailNotConfiguredError, sendAuthorEmail } from "@/lib/portal/mailer";
import { changeStatus } from "@/lib/portal/submissions";
import { sentLine } from "@/lib/portal/wording";

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
    // Emails go to the author unless another recipient (a reviewer) is given.
    const to = String(form.get("to") ?? "").trim() || submission.email;
    const toAuthor = to.toLowerCase() === submission.email.toLowerCase();
    if (!/^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(to)) throw new ApiError(400, "Enter one valid email address.");
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
    if (form.get("attachManuscript") === "true" && submission.manuscript_file) {
      const file = path.resolve(MANUSCRIPT_DIR, submission.manuscript_file);
      if (!file.startsWith(MANUSCRIPT_DIR + path.sep) || !fs.existsSync(file)) {
        throw new ApiError(404, "The stored manuscript file is missing.");
      }
      // Reviewers see only the reference: filenames often carry the author's name.
      const original = submission.manuscript_name ?? path.basename(file);
      attachments.unshift({
        filename: toAuthor ? original : `${submission.ref} manuscript${path.extname(original).toLowerCase()}`,
        content: fs.readFileSync(file),
      });
    }

    try {
      await sendAuthorEmail({ to, subject, text, attachments });
    } catch (error) {
      if (error instanceof MailNotConfiguredError) throw new ApiError(500, error.message);
      console.error("[portal] email send failed", error);
      throw new ApiError(502, "The email could not be sent. Nothing was changed.");
    }

    // The status only changes once the email has actually gone out.
    transaction(() => {
      logEvent(id, editor.id, "email", sentLine(to, submission.email, subject), {
        to,
        subject,
        body: text,
        attachments: attachments.map((a) => a.filename),
      });
      if (setStatus) {
        changeStatus(getSubmission(id)!, setStatus, editor.id, { waiveFee });
      }
      // Writing to the author answers them; writing to a reviewer does not.
      if (toAuthor) updateSubmission(id, { attention_since: null });
    });

    return Response.json({ ok: true });
  },
);
