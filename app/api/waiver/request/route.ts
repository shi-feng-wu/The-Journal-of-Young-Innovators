import nodemailer from "nodemailer";
import crypto from "crypto";

export const runtime = "nodejs";

const toEmail = process.env.SUBMISSION_TO ?? "shifengwu241@gmail.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NAME_MAX = 200;
const SCHOOL_MAX = 200;
const STATEMENT_MAX = 2000;

interface WaiverRequestPayload {
  name?: string;
  email?: string;
  school?: string;
  statement?: string;
}

function base64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function POST(request: Request) {
  try {
    let body: WaiverRequestPayload;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid request body." }),
        { status: 400 },
      );
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const school = typeof body.school === "string" ? body.school.trim() : "";
    const statement =
      typeof body.statement === "string" ? body.statement.trim() : "";

    if (!name || !email || !school || !statement) {
      return new Response(
        JSON.stringify({
          error: "Name, email, school, and a need statement are required.",
        }),
        { status: 400 },
      );
    }

    if (!EMAIL_RE.test(email)) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid email address." }),
        { status: 400 },
      );
    }

    if (name.length > NAME_MAX || school.length > SCHOOL_MAX) {
      return new Response(
        JSON.stringify({ error: "Name and school must be 200 characters or fewer." }),
        { status: 400 },
      );
    }

    if (statement.length > STATEMENT_MAX) {
      return new Response(
        JSON.stringify({
          error: "Need statement must be 2000 characters or fewer.",
        }),
        { status: 400 },
      );
    }

    const waiverSecret = process.env.WAIVER_LINK_SECRET;
    if (!waiverSecret) {
      return new Response(
        JSON.stringify({
          error:
            "Waiver approvals are not configured. Please email editor@young-innovator.org.",
        }),
        { status: 500 },
      );
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT ?? 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
      return new Response(
        JSON.stringify({
          error:
            "Email service is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS.",
        }),
        { status: 500 },
      );
    }

    const payload = base64url(
      JSON.stringify({ email, name, iat: Date.now() }),
    );
    const sig = crypto
      .createHmac("sha256", waiverSecret)
      .update(payload)
      .digest("hex");
    const token = `${payload}.${sig}`;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://young-innovator.org";
    const approvalLink = `${siteUrl}/api/waiver/approve?token=${encodeURIComponent(token)}`;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const fromEmail =
      process.env.SUBMISSION_FROM ??
      `The Journal of Young Innovators <${smtpUser}>`;

    const editorBody = [
      `A student has requested a need-based fee waiver.`,
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `School: ${school}`,
      "",
      "Need statement:",
      statement,
      "",
      `To approve, open the link below (a single-use waiver code will be emailed to the student automatically):`,
      approvalLink,
      "",
      "To decline, simply reply to this email.",
    ].join("\n");

    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `Fee Waiver Request — ${name}`,
      text: editorBody,
    });

    const studentBody = [
      `Hi ${name},`,
      "",
      "Thanks for reaching out. We've received your fee waiver request and will review it shortly.",
      "You'll hear back from us by email within a few days. Waiver requests are confidential and reviewed independently of editorial decisions.",
      "",
      "— The Journal of Young Innovators",
    ].join("\n");

    await transporter.sendMail({
      from: fromEmail,
      to: email,
      replyTo: toEmail,
      subject: "Fee Waiver Request Received",
      text: studentBody,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch {
    return new Response(
      JSON.stringify({ error: "Unable to send waiver request." }),
      { status: 500 },
    );
  }
}
