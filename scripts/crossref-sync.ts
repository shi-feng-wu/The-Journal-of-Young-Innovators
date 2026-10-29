// Registers DOIs with Crossref for articles whose DOI does not resolve yet.
//
//   pnpm crossref-sync                 (deposit every unregistered article)
//   pnpm crossref-sync --dry-run       (only list what would be deposited)
//   pnpm crossref-sync --ids 13,14     (re-deposit these, e.g. after a metadata fix)
//
// deploy.sh runs it after each deploy, so a new article in articles.ts gets
// its DOI once the page is live. Needs CROSSREF_LOGIN and CROSSREF_PASSWORD.

import { parseArgs } from "node:util";
import { SITE_ARTICLES } from "../app/lib/articles";
import { buildDepositXml } from "./generate-crossref-deposit";

try {
  process.loadEnvFile(".env.local");
} catch {
  // No .env.local; rely on the environment.
}

const CROSSREF = "https://doi.crossref.org/servlet";

const { values } = parseArgs({
  options: {
    ids: { type: "string" },
    "dry-run": { type: "boolean" },
  },
});

function log(message: string) {
  console.log(`${new Date().toISOString()} ${message}`);
}

async function resolves(doi: string) {
  const res = await fetch(`https://doi.org/${doi}`, {
    method: "HEAD",
    redirect: "manual",
  });
  return res.status >= 300 && res.status < 400;
}

async function pickArticles() {
  if (values.ids) {
    const ids = new Set(values.ids.split(",").map((id) => Number(id.trim())));
    const picked = SITE_ARTICLES.filter((a) => ids.has(a.id));
    if (picked.length !== ids.size)
      throw new Error(`Unknown article ids in ${values.ids}`);
    return picked;
  }
  const checks = await Promise.all(
    SITE_ARTICLES.map(async (a) => ({ a, ok: await resolves(a.doi) })),
  );
  return checks.filter((c) => !c.ok).map((c) => c.a);
}

async function deposit(xml: string, batchId: string, login: string, password: string) {
  const form = new FormData();
  form.set("operation", "doMDUpload");
  form.set("login_id", login);
  form.set("login_passwd", password);
  form.set("fname", new Blob([xml], { type: "application/xml" }), `${batchId}.xml`);
  const res = await fetch(`${CROSSREF}/deposit`, { method: "POST", body: form });
  const text = await res.text();
  if (!res.ok || !/SUCCESS/i.test(text))
    throw new Error(`Crossref rejected the upload (${res.status}): ${text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300)}`);
}

// Crossref queues deposits; poll the submission log until it is processed.
async function waitForResult(batchId: string, login: string, password: string) {
  const url = `${CROSSREF}/submissionDownload?usr=${encodeURIComponent(login)}&pwd=${encodeURIComponent(password)}&doi_batch_id=${encodeURIComponent(batchId)}&type=result`;
  for (let attempt = 0; attempt < 40; attempt++) {
    await new Promise((r) => setTimeout(r, 15_000));
    const text = await (await fetch(url)).text();
    if (!/status="completed"/.test(text)) continue;
    const count = (tag: string) => Number(text.match(new RegExp(`<${tag}>(\\d+)</${tag}>`))?.[1] ?? 0);
    const failures = [...text.matchAll(/<record_diagnostic status="Failure">[\s\S]*?<doi>(.*?)<\/doi>[\s\S]*?<msg>([\s\S]*?)<\/msg>/g)].map(
      (m) => `${m[1]}: ${m[2].trim()}`,
    );
    return { success: count("success_count"), warnings: count("warning_count"), failures };
  }
  return undefined;
}

const articles = await pickArticles();
if (!articles.length) {
  log("every article DOI resolves; nothing to deposit");
  process.exit(0);
}
log(`to deposit: ${articles.map((a) => `${a.doi} (${a.title})`).join("; ")}`);
if (values["dry-run"]) process.exit(0);

const login = process.env.CROSSREF_LOGIN;
const password = process.env.CROSSREF_PASSWORD;
if (!login || !password) {
  console.error("CROSSREF_LOGIN and CROSSREF_PASSWORD must be set");
  process.exit(1);
}

try {
  const { xml, batchId } = buildDepositXml(articles);
  await deposit(xml, batchId, login, password);
  log(`uploaded batch ${batchId}; waiting for Crossref to process it`);
  const result = await waitForResult(batchId, login, password);
  if (!result) {
    log(`batch ${batchId} still queued after 10 minutes; Crossref will email the result`);
  } else if (result.failures.length) {
    console.error(`batch ${batchId}: ${result.success} registered, failures:\n${result.failures.join("\n")}`);
    process.exit(1);
  } else {
    log(`batch ${batchId}: ${result.success} registered, ${result.warnings} warnings`);
  }
} catch (error) {
  console.error(`${new Date().toISOString()} crossref sync failed:`, error instanceof Error ? error.message : error);
  process.exit(1);
}
