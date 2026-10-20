// The $65 submission fee is collected through a Stripe Payment Link, so the
// site holds no Stripe secret key. After the form saves a submission it sends
// the author to /pay, which redirects here with the query string intact
// (?client_reference_id=<ref>&prefilled_email=...), and the confirmation
// email carries the same link. If the link is replaced in the Stripe
// Dashboard, update the URL and add the new ID below.
export const FEE_PAYMENT_URL = "https://buy.stripe.com/dRm9AT7SB00ufXs06y5kk00";

export const FEE_PAY_PATH = "/pay";

// Checkouts made through these payment links count as fees in the editor
// portal. Keep old IDs listed so earlier payments still sync.
export const FEE_PAYMENT_LINK_IDS = ["plink_1UIsX6Ff4DD6F2X6xoTRiMPm"];
