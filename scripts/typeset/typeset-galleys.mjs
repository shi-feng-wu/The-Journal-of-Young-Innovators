/**
 * Typesets authored article fragments into branded galley PDFs.
 *
 *   node typeset-galleys.mjs [slug ...]
 *
 * With no arguments it does every slug that has a content/<slug>.html.
 *
 * Pipeline: content/<slug>.html (fragment) -> wrapped document -> Chrome with
 * the Paged.js polyfill (CSS paged media) -> per-page running head + folio
 * injected into the DOM -> out/<slug>.pdf.
 *
 * Page geometry lives in galley.css (@page: 612x792pt, margins 102/84/72/84).
 * Chrome prints with zero margins of its own, so one .pagedjs_page is one sheet.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";
import { DIRS, PROJECT_ROOT, TYPESET_DIR, getArticle } from "./articles-meta.mjs";
import { getTypesetConfig } from "./typeset.config.mjs";

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const POLYFILL = path.join(
  PROJECT_ROOT,
  "node_modules",
  "pagedjs",
  "dist",
  "paged.polyfill.js",
);
const CSS = path.join(TYPESET_DIR, "galley.css");
const BUILD_DIR = path.join(DIRS.out, ".build");
const PAGECOUNTS = path.join(DIRS.out, "pagecounts.json");

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Wraps a content fragment in a full document.
 *
 * <base> points at content/ so the fragment's ../figures/<slug>/fig-NN.png
 * image paths resolve; the stylesheet is linked by absolute URL so its own
 * ../pdf-fonts/ font URLs resolve against scripts/typeset/.
 */
function buildDocument({ fragment, title }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<base href="${pathToFileURL(DIRS.content).href}/">
<title>${escapeHtml(title)}</title>
<link rel="stylesheet" href="${pathToFileURL(CSS).href}">
<script>
  window.PagedConfig = {
    auto: true,
    before: () => document.fonts.ready,
    after: (flow) => {
      window.__pagedTotal = flow.total;
      window.__pagedDone = true;
    },
  };
</script>
<script src="${pathToFileURL(POLYFILL).href}"></script>
</head>
<body>
${fragment}
</body>
</html>
`;
}

/**
 * Runs inside the page: drops trailing pages Paged.js emitted with nothing on
 * them, then stamps a running head and folio band onto every remaining page.
 */
function injectBands({ runhead, firstPage, doi }) {
  const pageEls = () => Array.from(document.querySelectorAll(".pagedjs_page"));

  let dropped = 0;
  for (;;) {
    const pages = pageEls();
    if (pages.length <= 1) break;
    const last = pages[pages.length - 1];
    const content = last.querySelector(".pagedjs_page_content");
    const hasText = Boolean(content && content.innerText.trim());
    const hasArt = Boolean(content && content.querySelector("img, svg, table"));
    if (hasText || hasArt) break;
    last.remove();
    dropped += 1;
  }

  const pages = pageEls();
  pages.forEach((pageEl, index) => {
    for (const stale of pageEl.querySelectorAll(".jyi-runhead, .jyi-folio")) {
      stale.remove();
    }

    const head = document.createElement("div");
    head.className = "jyi-runhead";
    const mark = document.createElement("span");
    mark.className = "jyi-runhead__mark";
    const tick = document.createElement("span");
    tick.className = "jyi-runhead__rule";
    const wordmark = document.createElement("span");
    wordmark.className = "jyi-runhead__wordmark";
    wordmark.textContent = "THE JOURNAL OF YOUNG INNOVATORS";
    mark.append(tick, wordmark);
    const article = document.createElement("span");
    article.className = "jyi-runhead__article";
    article.textContent = runhead;
    head.append(mark, article);

    const folio = document.createElement("div");
    folio.className = "jyi-folio";
    const doiEl = document.createElement("span");
    doiEl.className = "jyi-folio__doi";
    doiEl.textContent = `doi ${doi.toLowerCase()}`;
    const num = document.createElement("span");
    num.className = "jyi-folio__page";
    num.textContent = String(index + firstPage);
    folio.append(doiEl, num);

    pageEl.append(head, folio);
  });

  // Anything sticking out of the 444pt-wide text column would be clipped by
  // the sheet, so report it rather than letting it print silently.
  const overflow = [];
  for (const pageEl of pages) {
    const content = pageEl.querySelector(".pagedjs_page_content");
    if (!content) continue;
    const box = content.getBoundingClientRect();
    for (const el of content.querySelectorAll("*")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (r.right > box.right + 1 || r.left < box.left - 1) {
        overflow.push(`${el.tagName.toLowerCase()} ${Math.round(r.width)}pxw`);
        break;
      }
    }
  }

  return { pages: pages.length, dropped, overflow: overflow.slice(0, 5) };
}

async function readPagecounts() {
  try {
    return JSON.parse(await fs.readFile(PAGECOUNTS, "utf8"));
  } catch {
    return {};
  }
}

async function main() {
  const requested = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  let slugs = requested;
  if (!slugs.length) {
    const files = await fs.readdir(DIRS.content).catch(() => []);
    slugs = files
      .filter((f) => f.endsWith(".html") && !f.startsWith("."))
      .map((f) => f.replace(/\.html$/, ""))
      .sort();
  }
  if (!slugs.length) {
    console.error("No content/<slug>.html fragments to typeset.");
    process.exitCode = 1;
    return;
  }

  await fs.mkdir(BUILD_DIR, { recursive: true });
  await fs.mkdir(DIRS.out, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: [
      "--allow-file-access-from-files",
      "--font-render-hinting=none",
      "--disable-lcd-text",
    ],
  });

  const counts = await readPagecounts();
  const results = [];

  try {
    for (const slug of slugs) {
      const article = getArticle(slug);
      const config = getTypesetConfig(slug);
      const fragment = await fs.readFile(
        path.join(DIRS.content, `${slug}.html`),
        "utf8",
      );

      const built = path.join(BUILD_DIR, `${slug}.html`);
      await fs.writeFile(built, buildDocument({ fragment, title: article.title }));

      const page = await browser.newPage();
      const problems = [];
      page.on("pageerror", (err) => problems.push(`js: ${err.message}`));
      page.on("requestfailed", (req) =>
        problems.push(`load failed: ${req.url().split("/").pop()}`),
      );

      await page.goto(pathToFileURL(built).href, {
        waitUntil: "networkidle0",
        timeout: 120000,
      });
      await page.waitForFunction("window.__pagedDone === true", {
        timeout: 180000,
      });

      const report = await page.evaluate(injectBands, {
        runhead: config.runhead,
        firstPage: config.firstPage,
        doi: article.doi,
      });

      const out = path.join(DIRS.out, `${slug}.pdf`);
      await page.pdf({
        path: out,
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      });
      await page.close();

      counts[slug] = report.pages;
      results.push({ slug, ...report, problems });

      const notes = [
        `folios ${config.firstPage}–${config.firstPage + report.pages - 1}`,
        report.dropped ? `dropped ${report.dropped} blank trailing page(s)` : null,
        report.overflow.length ? `OVERFLOW: ${report.overflow.join(", ")}` : null,
        problems.length ? `WARN: ${[...new Set(problems)].join("; ")}` : null,
      ].filter(Boolean);
      console.log(`${slug}: ${report.pages}pp  ${notes.join("  ")}`);
    }
  } finally {
    await browser.close();
  }

  const sorted = Object.fromEntries(
    Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)),
  );
  await fs.writeFile(PAGECOUNTS, `${JSON.stringify(sorted, null, 2)}\n`);

  if (results.some((r) => r.overflow.length || r.problems.length)) {
    process.exitCode = 2;
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await main();
}
