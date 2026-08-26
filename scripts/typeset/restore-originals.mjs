/**
 * Rebuilds originals/<slug>.pdf — the author manuscript with no generated
 * cover page — for every article in scope.
 *
 * Preferred source: the pre-cover PDF as committed at PRE_COVER_COMMIT.
 * Fallback: strip page 1 off the published public/issues/articles/<slug>.pdf.
 *
 * Verifies each result against the article's pageCount in app/lib/articles.ts.
 *
 *   node restore-originals.mjs [slug ...]
 */
import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { PDFDocument } from "pdf-lib";
import { DIRS, PROJECT_ROOT, TYPESET_ARTICLES, getArticle } from "./articles-meta.mjs";
import { stripCover } from "./strip-cover.mjs";

const exec = promisify(execFile);

/** Last commit where the raw, un-stamped manuscripts lived at public/articles/. */
const PRE_COVER_COMMIT = "6c0695d";

async function gitShow(gitPath) {
  try {
    const { stdout } = await exec(
      "git",
      ["show", `${PRE_COVER_COMMIT}:${gitPath}`],
      { cwd: PROJECT_ROOT, encoding: "buffer", maxBuffer: 512 * 1024 * 1024 },
    );
    return stdout;
  } catch {
    return null;
  }
}

async function pageCountOf(file) {
  const doc = await PDFDocument.load(await fs.readFile(file), {
    ignoreEncryption: true,
  });
  return doc.getPageCount();
}

async function main() {
  const requested = process.argv.slice(2);
  const articles = requested.length
    ? requested.map(getArticle)
    : TYPESET_ARTICLES;

  await fs.mkdir(DIRS.originals, { recursive: true });

  const rows = [];
  for (const article of articles) {
    const dest = path.join(DIRS.originals, `${article.slug}.pdf`);
    let source;

    const bytes = await gitShow(`public/articles/${article.pdfBasename}.pdf`);
    if (bytes) {
      await fs.writeFile(dest, bytes);
      source = `git ${PRE_COVER_COMMIT}`;
    } else {
      const published = path.join(DIRS.published, `${article.slug}.pdf`);
      await stripCover(published, dest);
      source = "cover-strip";
    }

    const pages = await pageCountOf(dest);
    rows.push({
      slug: article.slug,
      source,
      pages,
      expected: article.pageCount,
      ok: pages === article.pageCount,
    });
  }

  const pad = Math.max(...rows.map((r) => r.slug.length));
  for (const r of rows) {
    console.log(
      `${r.slug.padEnd(pad)}  ${r.source.padEnd(12)}  ${String(r.pages).padStart(3)}p` +
        (r.ok ? "  ok" : `  MISMATCH (articles.ts says ${r.expected})`),
    );
  }

  const bad = rows.filter((r) => !r.ok);
  if (bad.length) {
    console.error(`\n${bad.length} page-count mismatch(es) — see above.`);
    process.exitCode = 2;
  }
}

await main();
