// The publication fee is collected through a Stripe Payment Link sent only in
// acceptance emails, so the site holds no Stripe keys and shows no pay button.
// Editors link to /pay, which redirects here (query strings such as
// ?prefilled_email= pass through). If the link is replaced in the Stripe
// Dashboard, update it here.
export const PUBLICATION_FEE_PAYMENT_URL =
  "https://buy.stripe.com/dRm9AT7SB00ufXs06y5kk00";

export const PUBLICATION_FEE_PAY_PATH = "/pay";
