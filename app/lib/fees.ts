// The $65 submission fee is paid in the form: once a submission is saved,
// the page opens an embedded Stripe Checkout (/api/checkout) tagged with the
// submission reference. Checkouts carry metadata purpose=FEE_CHECKOUT_PURPOSE
// so the portal can tell them apart from other payments on the account.
export const FEE_CHECKOUT_PURPOSE = "submission_fee";

export const SUBMISSION_FEE_PRODUCT_NAME = "JYI submission fee";

// The Stripe Payment Link stays as the fallback in confirmation and reminder
// emails. /pay redirects to it with the query string intact
// (?client_reference_id=<ref>&prefilled_email=...). If the link is replaced
// in the Stripe Dashboard, update the URL and add the new ID below.
export const FEE_PAYMENT_URL = "https://buy.stripe.com/dRm9AT7SB00ufXs06y5kk00";

export const FEE_PAY_PATH = "/pay";

// Checkouts made through these payment links count as fees in the editor
// portal. Keep old IDs listed so earlier payments still sync.
export const FEE_PAYMENT_LINK_IDS = ["plink_1UIsX6Ff4DD6F2X6xoTRiMPm"];
