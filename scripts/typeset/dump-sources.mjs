/**
 * Builds the extraction inputs for one or more articles:
 *   pagesrc/<slug>.txt            pdftotext -layout
 *   pagesrc/<slug>/page-NN.png     pdftoppm -r 150 -png
 *   pagesrc/<slug>.styled.json     extract-text.mjs (styled runs)
 *
 *   node dump-sources.mjs [slug ...]       # default: every article in scope
 *   node dump-sources.mjs --skip-styled ...
 */
import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { DIRS, TYPESET_ARTICLES, getArticle } from "./articles-meta.mjs";
import { extract } from "./extract-text.mjs";

const exec = promisify(execFile);
const PDFTOTEXT = "/opt/homebrew/bin/pdftotext";
const PDFTOPPM = "/opt/homebrew/bin/pdftoppm";

const args = process.argv.slice(2);
const skipStyled = args.includes("--skip-styled");
const slugs = args.filter((a) => !a.startsWith("--"));
const articles = slugs.length ? slugs.map(getArticle) : TYPESET_ARTICLES;

for (const article of articles) {
  const src = path.join(DIRS.originals, `${article.slug}.pdf`);
  const txt = path.join(DIRS.pagesrc, `${article.slug}.txt`);
  const pngDir = path.join(DIRS.pagesrc, article.slug);

  await fs.mkdir(pngDir, { recursive: true });
  // Re-runs are idempotent: pdftoppm overwrites page-NN.png in place, but a
  // shrinking page count would leave strays behind, so clear first.
  for (const f of await fs.readdir(pngDir)) {
    if (f.startsWith("page-")) await fs.rm(path.join(pngDir, f));
  }

  await exec(PDFTOTEXT, ["-layout", src, txt]);
  await exec(PDFTOPPM, ["-r", "150", "-png", src, path.join(pngDir, "page")]);

  // pdftoppm zero-pads to the width of the page count (page-1 / page-01 / ...);
  // normalize to a fixed 2-digit page-NN so downstream globs are stable.
  for (const f of await fs.readdir(pngDir)) {
    const m = f.match(/^page-(\d+)\.png$/);
    if (!m) continue;
    const want = `page-${m[1].padStart(2, "0")}.png`;
    if (want !== f) await fs.rename(path.join(pngDir, f), path.join(pngDir, want));
  }

  const pngs = (await fs.readdir(pngDir)).filter((f) => f.endsWith(".png")).length;
  let styled = "skipped";
  if (!skipStyled) {
    const r = await extract(article);
    styled = `${r.runs} runs, fonts ${r.resolvedPct}%`;
  }
  console.log(`${article.slug}: ${pngs} png, text ok, styled ${styled}`);
}
