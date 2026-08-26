/**
 * Dumps per-page styled text runs out of originals/<slug>.pdf so a later
 * content-extraction pass can tell headings from body and italic from roman
 * without guessing from a flattened text dump.
 *
 *   node extract-text.mjs [slug ...]        # default: every article in scope
 *
 * Writes pagesrc/<slug>.styled.json:
 *   {
 *     slug, file, pageCount,
 *     pages: [ { page, width, height, items: [ {str,font,size,italic,bold,x,y} ] } ]
 *   }
 *
 * x/y are PDF user-space coordinates (origin bottom-left) taken from the text
 * item's transform; `width`/`height` on each page are the same space, so
 * top-of-page distance is (height - y).
 *
 * Font names come from page.commonObjs, which is only populated once the page's
 * operator list has been built — so we build it before reading text content.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { DIRS, PROJECT_ROOT, TYPESET_ARTICLES, getArticle } from "./articles-meta.mjs";

const PDFJS_DIR = path.join(PROJECT_ROOT, "node_modules", "pdfjs-dist", "legacy", "build");
const pdfjs = await import(pathToFileURL(path.join(PDFJS_DIR, "pdf.mjs")).href);
pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(
  path.join(PDFJS_DIR, "pdf.worker.mjs"),
).href;

const ITALIC_RE = /italic|oblique|-it\b|it$/i;
const BOLD_RE = /bold|black|heavy|semib|demi/i;

/**
 * Resolves a text item's fontName (e.g. "g_d0_f3") to the real font.
 * Returns { name, italic, bold } — flags come from the font object when pdf.js
 * exposes them and fall back to name sniffing otherwise.
 */
function resolveFont(commonObjs, fontName, cache) {
  if (cache.has(fontName)) return cache.get(fontName);

  let resolved = { name: fontName, italic: false, bold: false, resolved: false };
  try {
    if (commonObjs.has(fontName)) {
      const font = commonObjs.get(fontName);
      const name = font?.name || font?.loadedName || fontName;
      resolved = {
        name,
        italic: Boolean(font?.italic) || ITALIC_RE.test(name),
        bold: Boolean(font?.bold) || Boolean(font?.black) || BOLD_RE.test(name),
        resolved: true,
      };
    }
  } catch {
    // commonObjs.get throws when the font never finished resolving; fall back
    // to the raw pdf.js handle, which carries no style information.
  }
  cache.set(fontName, resolved);
  return resolved;
}

async function extract(article) {
  const file = path.join(DIRS.originals, `${article.slug}.pdf`);
  const data = new Uint8Array(await fs.readFile(file));
  const doc = await pdfjs.getDocument({
    data,
    useSystemFonts: false,
    isEvalSupported: false,
  }).promise;

  const pages = [];
  let resolvedFonts = 0;
  let totalRuns = 0;

  for (let n = 1; n <= doc.numPages; n += 1) {
    const page = await doc.getPage(n);
    const viewport = page.getViewport({ scale: 1 });
    // Populates page.commonObjs with the real font objects.
    await page.getOperatorList();
    const content = await page.getTextContent();

    const cache = new Map();
    const items = [];
    for (const item of content.items) {
      if (typeof item.str !== "string") continue; // marked-content markers
      if (!item.str) continue;
      const t = item.transform;
      const font = resolveFont(page.commonObjs, item.fontName, cache);
      totalRuns += 1;
      if (font.resolved) resolvedFonts += 1;
      items.push({
        str: item.str,
        font: font.name,
        size: Math.round(Math.hypot(t[2], t[3]) * 100) / 100,
        italic: font.italic,
        bold: font.bold,
        x: Math.round(t[4] * 10) / 10,
        y: Math.round(t[5] * 10) / 10,
        ...(item.hasEOL ? { eol: true } : {}),
      });
    }

    pages.push({
      page: n,
      width: Math.round(viewport.width * 10) / 10,
      height: Math.round(viewport.height * 10) / 10,
      items,
    });
    page.cleanup();
  }

  await doc.destroy();

  const out = path.join(DIRS.pagesrc, `${article.slug}.styled.json`);
  await fs.mkdir(DIRS.pagesrc, { recursive: true });
  await fs.writeFile(
    out,
    `${JSON.stringify({ slug: article.slug, file, pageCount: pages.length, pages }, null, 1)}\n`,
  );

  const fontNames = new Set();
  for (const p of pages) for (const i of p.items) fontNames.add(i.font);
  return {
    pages: pages.length,
    runs: totalRuns,
    resolvedPct: totalRuns ? Math.round((resolvedFonts / totalRuns) * 100) : 0,
    fonts: [...fontNames].sort(),
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const requested = process.argv.slice(2);
  const articles = requested.length ? requested.map(getArticle) : TYPESET_ARTICLES;
  for (const article of articles) {
    const r = await extract(article);
    console.log(
      `${article.slug}: ${r.pages}p ${r.runs} runs, fonts resolved ${r.resolvedPct}% — ${r.fonts.join(", ")}`,
    );
  }
}

export { extract };
