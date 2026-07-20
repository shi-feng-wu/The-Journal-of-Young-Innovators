import nodemailer from "nodemailer";
import Stripe from "stripe";
import crypto from "crypto";

export const runtime = "nodejs";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const CODE_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // no 0/O/1/I

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function htmlPage(title: string, message: string, status: number) {
  const body = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f7f5f0; color: #16213e; max-width: 560px; margin: 80px auto; padding: 0 24px; line-height: 1.6; }
  h1 { font-size: 22px; margin-bottom: 12px; }
  p { font-size: 15px; color: #33415c; }
  .note { margin-top: 24px; font-size: 13px; color: #6b7280; }
  button { margin-top: 20px; padding: 14px 28px; border: 2px solid #002d72; background: #002d72; color: #fff; font-size: 13px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; border-radius: 8px; cursor: pointer; }
  button:hover { background: #003f9e; border-color: #003f9e; }
</style>
</head>
<body>
<h1>${escapeHtml(title)}</h1>
${message}
</body>
</html>`;
  return new Response(body, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function base64urlDecode(input: string) {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (padded.length % 4)) % 4;
  return Buffer.from(padded + "=".repeat(padLength), "base64").toString(
    "utf8",
  );
}

function randomCode(length = 6) {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += CODE_CHARS[crypto.randomInt(0, CODE_CHARS.length)];
  }
  return out;
}

type TokenValidation =
  | { ok: true; email: string; name: string }
  | { ok: false; response: Response };

function validateToken(token: string): TokenValidation {
  const waiverSecret = process.env.WAIVER_LINK_SECRET;
  if (!waiverSecret) {
    return {
      ok: false,
      response: htmlPage(
        "Configuration error",
        "<p>Waiver approvals are not configured. Please contact the site administrator.</p>",
        500,
      ),
    };
  }

  const invalid = (): TokenValidation => ({
    ok: false,
    response: htmlPage(
      "Invalid link",
      "<p>This approval link is invalid.</p>",
      400,
    ),
  });

  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return invalid();
  }

  const [payload, sig] = parts;
  const expectedSig = crypto
    .createHmac("sha256", waiverSecret)
    .update(payload)
    .digest("hex");

  const sigBuffer = Buffer.from(sig, "hex");
  const expectedBuffer = Buffer.from(expectedSig, "hex");
  const validSig =
    sigBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(sigBuffer, expectedBuffer);

  if (!validSig) {
    return invalid();
  }

  let parsed: { email?: string; name?: string; iat?: number };
  try {
    parsed = JSON.parse(base64urlDecode(payload));
  } catch {
    return invalid();
  }

  const email = typeof parsed.email === "string" ? parsed.email : "";
  const name = typeof parsed.name === "string" ? parsed.name : "";
  const iat = typeof parsed.iat === "number" ? parsed.iat : 0;

  if (!email || !iat) {
    return invalid();
  }

  if (Date.now() - iat > THIRTY_DAYS_MS) {
    return {
      ok: false,
      response: htmlPage(
        "Link expired",
        "<p>This approval link has expired.</p>",
        400,
      ),
    };
  }

  return { ok: true, email, name };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";

  const validation = validateToken(token);
  if (!validation.ok) {
    return validation.response;
  }

  const { email, name } = validation;

  return htmlPage(
    "Approve fee waiver?",
    `<p>Approve fee waiver for ${escapeHtml(name || "this student")} &lt;${escapeHtml(email)}&gt;?</p>
<p>A single-use 100%-off waiver code will be created in Stripe and emailed to the student automatically.</p>
<form method="POST" action="/api/waiver/approve">
<input type="hidden" name="token" value="${escapeHtml(token)}" />
<button type="submit">Approve &amp; send code</button>
</form>
<p class="note">If you did not intend to approve this request, simply close this page — nothing has been sent yet.</p>`,
    200,
  );
}

export async function POST(request: Request) {
  let token = "";
  try {
    const formData = await request.formData();
    token = String(formData.get("token") ?? "");
  } catch {
    return htmlPage(
      "Invalid link",
      "<p>This approval link is invalid.</p>",
      400,
    );
  }

  const validation = validateToken(token);
  if (!validation.ok) {
    return validation.response;
  }

  const { email, name } = validation;

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return htmlPage(
      "Configuration error",
      "<p>Payments are not configured. Please contact the site administrator to issue this waiver manually.</p>",
      500,
    );
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT ?? 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    return htmlPage(
      "Configuration error",
      "<p>Email service is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS.</p>",
      500,
    );
  }

  try {
    const stripe = new Stripe(stripeSecretKey);

    const coupon = await stripe.coupons.create({
      percent_off: 100,
      duration: "once",
      name: "JYI Fee Waiver",
    });

    const code = `JYI-${randomCode(6)}`;
    const expiresAt = Math.floor((Date.now() + THIRTY_DAYS_MS) / 1000);

    await stripe.promotionCodes.create({
      promotion: { type: "coupon", coupon: coupon.id },
      code,
      max_redemptions: 1,
      expires_at: expiresAt,
      metadata: { studentEmail: email },
    });

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

    const studentBody = [
      `Hi ${name || "there"},`,
      "",
      "Good news — your fee waiver request has been approved.",
      "",
      `Your single-use waiver code is: ${code}`,
      "",
      "How to use it: on the submission form at young-innovator.org/form, click \"Pay $55\" and choose \"Add promotion code\" at checkout, then enter your code. This will bring the fee to $0.",
      "",
      "This code is single-use and expires in 30 days.",
      "",
      "— The Journal of Young Innovators",
    ].join("\n");

    await transporter.sendMail({
      from: fromEmail,
      to: email,
      replyTo: process.env.SUBMISSION_TO ?? smtpUser,
      subject: "Your JYI Fee Waiver Code",
      text: studentBody,
    });

    return htmlPage(
      "Waiver approved",
      `<p>Waiver code sent to ${escapeHtml(email)}.</p>
<p class="note">Approved this student already? A previously issued code remains valid — duplicate clicks issue an extra single-use code, which you can ignore or deactivate in Stripe.</p>`,
      200,
    );
  } catch {
    return htmlPage(
      "Something went wrong",
      "<p>We couldn't issue the waiver code. Please try again or issue it manually in Stripe.</p>",
      500,
    );
  }
}
