import nodemailer from "nodemailer";

export const runtime = "nodejs";

const toEmail = process.env.SUBMISSION_TO ?? "shifengwu241@gmail.com";
const MAX_FILE_BYTES = 25 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const firstName = String(formData.get("firstName") ?? "");
    const lastName = String(formData.get("lastName") ?? "");
    const email = String(formData.get("email") ?? "");
    const phone = String(formData.get("phone") ?? "");
    const school = String(formData.get("school") ?? "");
    const gradeLevel = String(formData.get("gradeLevel") ?? "");
    const manuscriptTitle = String(formData.get("manuscriptTitle") ?? "");
    const scholarshipStatement = String(
      formData.get("scholarshipStatement") ?? ""
    );
    const needScholarship = formData.get("needScholarship") === "yes";
    const fastTrack = formData.get("fastTrack") === "yes";

    const manuscript = formData.get("manuscript");
    const attachments: Array<{ filename: string; content: Buffer }> = [];

    if (manuscript && typeof manuscript === "object" && "arrayBuffer" in manuscript) {
      const file = manuscript as File;
      if (file.size > MAX_FILE_BYTES) {
        return new Response(
          JSON.stringify({ error: "Manuscript must be 25MB or less." }),
          { status: 413 }
        );
      }
      const arrayBuffer = await file.arrayBuffer();
      attachments.push({
        filename: file.name || "manuscript.docx",
        content: Buffer.from(arrayBuffer),
      });
    }

    const textBody = [
      `First Name: ${firstName}`,
      `Last Name: ${lastName}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `School: ${school}`,
      `Grade Level: ${gradeLevel}`,
      `Manuscript Title: ${manuscriptTitle}`,
      `Need-Based Scholarship Requested: ${needScholarship ? "Yes" : "No"}`,
      `Scholarship Statement: ${scholarshipStatement || "(none)"}`,
      `Fast Track Review: ${fastTrack ? "Yes" : "No"}`,
    ].join("\n");

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT ?? 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
      return new Response(
        JSON.stringify({
          error: "Email service is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS.",
        }),
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const fromEmail = process.env.SUBMISSION_FROM ?? `The Journal of Young Innovators <${smtpUser}>`;

    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      replyTo: email || undefined,
      subject: `New Submission: ${manuscriptTitle || "Untitled"} - ${firstName} ${lastName}`,
      text: textBody,
      attachments,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Unable to send submission email." }),
      { status: 500 }
    );
  }
}
