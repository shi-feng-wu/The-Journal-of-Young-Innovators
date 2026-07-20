import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return new Response(
      JSON.stringify({
        error:
          "Payments are not configured. Please email editor@young-innovator.org.",
      }),
      { status: 500 },
    );
  }

  let manuscriptTitle: unknown;
  let email: unknown;

  try {
    const body = await request.json();
    manuscriptTitle = body?.manuscriptTitle;
    email = body?.email;
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request body." }),
      { status: 400 },
    );
  }

  if (
    !manuscriptTitle ||
    typeof manuscriptTitle !== "string" ||
    !manuscriptTitle.trim() ||
    !email ||
    typeof email !== "string" ||
    !email.trim()
  ) {
    return new Response(
      JSON.stringify({ error: "Manuscript title and email are required." }),
      { status: 400 },
    );
  }

  const stripe = new Stripe(secretKey);

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded_page",
      mode: "payment",
      redirect_on_completion: "never",
      allow_promotion_codes: true,
      customer_email: String(email),
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: 5500,
            product_data: {
              name: "JYI Manuscript Submission Fee",
              description:
                "One-time submission fee — The Journal of Young Innovators",
            },
          },
        },
      ],
      metadata: {
        source: "jyi-submission-fee",
        manuscriptTitle: String(manuscriptTitle).slice(0, 450),
        correspondingEmail: String(email).slice(0, 450),
      },
    });

    return new Response(
      JSON.stringify({
        clientSecret: session.client_secret,
        sessionId: session.id,
      }),
      { status: 200 },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Unable to start checkout. Please try again." }),
      { status: 500 },
    );
  }
}
