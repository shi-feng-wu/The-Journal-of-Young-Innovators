import nodemailer from "nodemailer";
import Stripe from "stripe";

export const runtime = "nodejs";

const toEmail = process.env.SUBMISSION_TO ?? "shifengwu241@gmail.com";
const MAX_FILE_BYTES = 25 * 1024 * 1024;

export async function POST(request: Request) {
  let checkoutSessionId = "";
  let paymentVerified = false;

  try {
    const formData = await request.formData();
    checkoutSessionId = String(formData.get("checkoutSessionId") ?? "");

    const firstName = String(formData.get("firstName") ?? "");
    const lastName = String(formData.get("lastName") ?? "");
    const email = String(formData.get("email") ?? "");
    const phone = String(formData.get("phone") ?? "");
    const school = String(formData.get("school") ?? "");
    const gradeLevel = String(formData.get("gradeLevel") ?? "");
    const manuscriptTitle = String(formData.get("manuscriptTitle") ?? "");
    const manuscript = formData.get("manuscript");
    const attachments: Array<{ filename: string; content: Buffer }> = [];

    if (
      manuscript &&
      typeof manuscript === "object" &&
      "arrayBuffer" in manuscript
    ) {
      const file = manuscript as File;
      if (file.size > MAX_FILE_BYTES) {
        return new Response(
          JSON.stringify({ error: "Manuscript must be 25MB or less." }),
          { status: 413 },
        );
      }
      const arrayBuffer = await file.arrayBuffer();
      attachments.push({
        filename: file.name || "manuscript.docx",
        content: Buffer.from(arrayBuffer),
      });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({
          error:
            "Payments are not configured. Please email editor@young-innovator.org.",
        }),
        { status: 500 },
      );
    }

    if (!checkoutSessionId.startsWith("cs_")) {
      return new Response(
        JSON.stringify({ error: "Payment is required before submitting." }),
        { status: 402 },
      );
    }

    const stripe = new Stripe(stripeSecretKey);

    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.retrieve(checkoutSessionId, {
        expand: ["payment_intent"],
      });
    } catch {
      return new Response(
        JSON.stringify({
          error:
            "Payment could not be verified. Please try again or email editor@young-innovator.org.",
        }),
        { status: 402 },
      );
    }

    const paymentStatusOk =
      session.payment_status === "paid" ||
      session.payment_status === "no_payment_required";

    if (
      !paymentStatusOk ||
      session.metadata?.source !== "jyi-submission-fee" ||
      session.currency !== "usd" ||
      session.amount_subtotal !== 5500
    ) {
      return new Response(
        JSON.stringify({ error: "Payment not completed or invalid." }),
        { status: 402 },
      );
    }

    const pi = session.payment_intent as Stripe.PaymentIntent | null;

    if (pi && pi.metadata?.submission_used === "true") {
      return new Response(
        JSON.stringify({
          error: "This payment has already been used for a submission.",
        }),
        { status: 409 },
      );
    }

    if (!pi) {
      const sessionAgeSeconds =
        Math.floor(Date.now() / 1000) - session.created;
      if (sessionAgeSeconds >= 24 * 60 * 60) {
        return new Response(
          JSON.stringify({
            error:
              "Payment session expired. Please contact editor@young-innovator.org.",
          }),
          { status: 402 },
        );
      }
    }

    paymentVerified = true;

    const textBody = [
      `First Name: ${firstName}`,
      `Last Name: ${lastName}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `School: ${school}`,
      `Grade Level: ${gradeLevel}`,
      `Manuscript Title: ${manuscriptTitle}`,
      "",
      `Payment reference: ${session.id}`,
      `Payment status: ${session.payment_status}`,
    ].join("\n");

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

    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      replyTo: email || undefined,
      subject: `New Submission: ${manuscriptTitle || "Untitled"} - ${firstName} ${lastName}`,
      text: textBody,
      attachments,
    });

    if (email) {
      const confirmationBody = [
        `Hi ${firstName || "there"},`,
        "",
        "Thanks for submitting your manuscript to The Journal of Young Innovators.",
        "Here is a summary of your submission:",
        "",
        `Name: ${[firstName, lastName].filter(Boolean).join(" ") || "(not provided)"}`,
        `Email: ${email}`,
        `Phone: ${phone || "(not provided)"}`,
        `School: ${school || "(not provided)"}`,
        `Grade Level: ${gradeLevel || "(not provided)"}`,
        `Manuscript Title: ${manuscriptTitle || "(not provided)"}`,
        "",
        `Payment reference: ${session.id}`,
        ...(session.payment_status === "no_payment_required"
          ? ["A fee waiver was applied to this submission."]
          : []),
        "",
        "If anything looks incorrect, reply to this email to let us know.",
        "",
        "— The Journal of Young Innovators",
      ].join("\n");

      await transporter.sendMail({
        from: fromEmail,
        to: email,
        replyTo: process.env.SUBMISSION_TO ?? smtpUser,
        subject: `Submission Received: ${manuscriptTitle || "Untitled"}`,
        text: confirmationBody,
      });
    }

    if (pi) {
      await stripe.paymentIntents
        .update(pi.id, {
          metadata: {
            submission_used: "true",
            manuscriptTitle: manuscriptTitle.slice(0, 450),
          },
        })
        .catch(() => {});
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    if (paymentVerified) {
      return new Response(
        JSON.stringify({
          error: `Your payment succeeded but we could not deliver your submission. Please email editor@young-innovator.org with payment reference ${checkoutSessionId} and your manuscript attached — do not pay again.`,
        }),
        { status: 500 },
      );
    }
    return new Response(
      JSON.stringify({ error: "Unable to send submission email." }),
      { status: 500 },
    );
  }
}
