import fs from "node:fs";
import path from "node:path";
import {
  createSubmission,
  MANUSCRIPT_DIR,
  updateSubmission,
  type Submission,
} from "@/lib/portal/db";
import { EDITOR_INBOX, getTransport } from "@/lib/portal/mailer";
import { SITE_URL } from "@/lib/portal/payments";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 25 * 1024 * 1024;

function safeFileName(name: string) {
  const cleaned = path
    .basename(name)
    .replace(/[^\w.\- ()]/g, "_")
    .slice(-120);
  return cleaned || "manuscript.docx";
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const school = String(formData.get("school") ?? "").trim();
  const gradeLevel = String(formData.get("gradeLevel") ?? "").trim();
  const manuscriptTitle = String(formData.get("manuscriptTitle") ?? "").trim();
  const submissionType = String(formData.get("submissionType") ?? "").trim();
  const manuscript = formData.get("manuscript");

  let file: { name: string; content: Buffer } | null = null;
  if (manuscript && typeof manuscript === "object" && "arrayBuffer" in manuscript) {
    const upload = manuscript as File;
    if (upload.size > MAX_FILE_BYTES) {
      return Response.json(
        { error: "Manuscript must be 25MB or less." },
        { status: 413 },
      );
    }
    file = {
      name: upload.name || "manuscript.docx",
      content: Buffer.from(await upload.arrayBuffer()),
    };
  }

  // Store the submission for the editor portal. If this fails, the emails
  // below still carry everything, so the author is never turned away.
  let saved: Submission | null = null;
  try {
    saved = createSubmission({
      firstName,
      lastName,
      email,
      phone,
      school,
      gradeLevel,
      title: manuscriptTitle || "Untitled",
      submissionType,
    });
    if (file) {
      const relative = path.join(saved.ref, safeFileName(file.name));
      fs.mkdirSync(path.join(MANUSCRIPT_DIR, saved.ref), { recursive: true });
      fs.writeFileSync(path.join(MANUSCRIPT_DIR, relative), file.content);
      updateSubmission(saved.id, {
        manuscript_file: relative,
        manuscript_name: file.name,
      });
    }
  } catch (error) {
    console.error("[submit] could not store submission", error);
  }

  let emailed = false;
  try {
    const { transporter, from } = getTransport();

    const textBody = [
      saved ? `Reference: ${saved.ref}` : null,
      `First Name: ${firstName}`,
      `Last Name: ${lastName}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `School: ${school}`,
      `Grade Level: ${gradeLevel}`,
      `Submission Type: ${submissionType}`,
      `Manuscript Title: ${manuscriptTitle}`,
      saved ? `\nOpen in the editor portal: ${SITE_URL}/portal/submissions/${saved.id}` : null,
    ]
      .filter((line) => line !== null)
      .join("\n");

    await transporter.sendMail({
      from,
      to: EDITOR_INBOX,
      replyTo: email || undefined,
      subject: `New Submission: ${manuscriptTitle || "Untitled"} - ${firstName} ${lastName}`,
      text: textBody,
      attachments: file ? [{ filename: file.name, content: file.content }] : [],
    });
    emailed = true;

    if (email) {
      const confirmationBody = [
        `Hi ${firstName || "there"},`,
        "",
        "Thanks for submitting your manuscript to The Journal of Young Innovators.",
        "Here is a summary of your submission:",
        "",
        saved ? `Reference: ${saved.ref}` : null,
        `Name: ${[firstName, lastName].filter(Boolean).join(" ") || "(not provided)"}`,
        `Email: ${email}`,
        `Phone: ${phone || "(not provided)"}`,
        `School: ${school || "(not provided)"}`,
        `Grade Level: ${gradeLevel || "(not provided)"}`,
        `Manuscript Title: ${manuscriptTitle || "(not provided)"}`,
        "",
        "If anything looks incorrect, reply to this email to let us know.",
        "",
        "The Journal of Young Innovators",
      ]
        .filter((line) => line !== null)
        .join("\n");

      await transporter.sendMail({
        from,
        to: email,
        replyTo: EDITOR_INBOX,
        subject: `Submission Received: ${manuscriptTitle || "Untitled"}`,
        text: confirmationBody,
      });
    }
  } catch (error) {
    console.error("[submit] email failed", error);
  }

  if (!saved && !emailed) {
    return Response.json(
      { error: "Unable to send submission email." },
      { status: 500 },
    );
  }
  return Response.json({ ok: true });
}
