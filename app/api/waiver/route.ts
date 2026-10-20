import { getSubmissionByRef } from "@/lib/portal/db";
import { EDITOR_INBOX, getTransport } from "@/lib/portal/mailer";
import { SITE_URL } from "@/lib/portal/payments";
import { MAX_WAIVER_REASON, requestWaiver } from "@/lib/portal/waivers";

export const runtime = "nodejs";

// An author asks for the submission fee to be waived. The request lands in
// the editor portal; nothing is decided automatically.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    ref?: unknown;
    email?: unknown;
    reason?: unknown;
  };
  const ref = typeof body.ref === "string" ? body.ref.trim().toUpperCase() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const reason = typeof body.reason === "string" ? body.reason.trim() : "";

  if (!reason) {
    return Response.json(
      { error: "Tell us briefly why you are asking for a waiver." },
      { status: 400 },
    );
  }
  if (reason.length > MAX_WAIVER_REASON) {
    return Response.json(
      { error: `Keep the explanation under ${MAX_WAIVER_REASON} characters.` },
      { status: 400 },
    );
  }
  const submission = ref ? getSubmissionByRef(ref) : undefined;
  if (!submission || submission.email.toLowerCase() !== email.toLowerCase()) {
    return Response.json(
      {
        error:
          "We could not find a submission with that reference and email address.",
      },
      { status: 404 },
    );
  }
  if (submission.payment_status === "waiver_requested") {
    return Response.json(
      { error: "You have already asked for a waiver. We will reply by email." },
      { status: 409 },
    );
  }
  if (submission.payment_status !== "due") {
    return Response.json(
      { error: "The fee for this submission is already settled." },
      { status: 409 },
    );
  }

  requestWaiver(submission, reason);

  try {
    const { transporter, from } = getTransport();
    const name = [submission.first_name, submission.last_name]
      .filter(Boolean)
      .join(" ");
    await transporter.sendMail({
      from,
      to: EDITOR_INBOX,
      replyTo: submission.email,
      subject: `Fee waiver request: ${submission.title} [${submission.ref}]`,
      text: [
        `${name || submission.email} asked for the submission fee to be waived.`,
        "",
        reason,
        "",
        `Answer in the editor portal: ${SITE_URL}/portal/submissions/${submission.id}`,
      ].join("\n"),
    });
    await transporter.sendMail({
      from,
      to: submission.email,
      replyTo: EDITOR_INBOX,
      subject: `Waiver request received: ${submission.title} [${submission.ref}]`,
      text: [
        `Hi ${submission.first_name || "there"},`,
        "",
        `We received your request to waive the submission fee for "${submission.title}". An editor will read it and reply by email, usually within a few days. Your manuscript stays on file in the meantime.`,
        "",
        "The Journal of Young Innovators",
      ].join("\n"),
    });
  } catch (error) {
    console.error("[waiver] email failed", error);
  }

  return Response.json({ ok: true });
}
