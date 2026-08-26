/**
 * Reads article metadata straight out of app/lib/articles.ts so the typesetting
 * pipeline can never drift from the site.
 *
 * app/lib/articles.ts is TypeScript, but SITE_ARTICLE_SOURCE is a plain array
 * literal with no expressions in it, so we slice that literal out of the file
 * and evaluate it, then re-apply the same slug / doi / page-range derivation
 * the site module does.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const TYPESET_DIR = path.dirname(fileURLToPath(import.meta.url));
export const PROJECT_ROOT = path.resolve(TYPESET_DIR, "..", "..");
const ARTICLES_TS = path.join(PROJECT_ROOT, "app", "lib", "articles.ts");

/** Articles that are NOT being re-typeset. */
export const EXCLUDED_SLUGS = new Set(["arenas-of-competition"]);

function toArticleSlug(title) {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readSourceEntries() {
  const src = fs.readFileSync(ARTICLES_TS, "utf8");

  const prefixMatch = src.match(/export const DOI_PREFIX\s*=\s*"([^"]+)"/);
  if (!prefixMatch) throw new Error("DOI_PREFIX not found in articles.ts");

  const startMarker = "const SITE_ARTICLE_SOURCE";
  const startIdx = src.indexOf(startMarker);
  if (startIdx === -1) {
    throw new Error("SITE_ARTICLE_SOURCE not found in articles.ts");
  }
  const openIdx = src.indexOf("[", startIdx);
  const closeIdx = src.indexOf("\n];", openIdx);
  if (openIdx === -1 || closeIdx === -1) {
    throw new Error("Could not delimit the SITE_ARTICLE_SOURCE array literal");
  }
  const literal = src.slice(openIdx, closeIdx + 2);

  // eslint-disable-next-line no-new-func
  const entries = new Function(`return (${literal});`)();
  return { entries, doiPrefix: prefixMatch[1] };
}

const { entries, doiPrefix } = readSourceEntries();

/** Every article on the site, shaped like SiteArticle from app/lib/articles.ts. */
export const SITE_ARTICLES = entries.map((article) => {
  const slug = toArticleSlug(article.pdfBasename);
  return {
    ...article,
    slug,
    doi: `${doiPrefix}/jyi.v${article.volume}i${article.issueNumber}.${article.id}`,
    firstPage: article.firstPage ?? 1,
    lastPage: article.lastPage ?? article.pageCount,
    pdfPath: `/issues/articles/${slug}.pdf`,
    legacyPdfPath: `/articles/${article.pdfBasename}.pdf`,
  };
});

/** The 16 articles in scope for re-typesetting. */
export const TYPESET_ARTICLES = SITE_ARTICLES.filter(
  (a) => !EXCLUDED_SLUGS.has(a.slug),
);

export const BY_SLUG = new Map(SITE_ARTICLES.map((a) => [a.slug, a]));

export function getArticle(slug) {
  const article = BY_SLUG.get(slug);
  if (!article) throw new Error(`Unknown article slug: ${slug}`);
  return article;
}

export const DIRS = {
  originals: path.join(TYPESET_DIR, "originals"),
  pagesrc: path.join(TYPESET_DIR, "pagesrc"),
  content: path.join(TYPESET_DIR, "content"),
  figures: path.join(TYPESET_DIR, "figures"),
  out: path.join(TYPESET_DIR, "out"),
  fonts: path.join(PROJECT_ROOT, "scripts", "pdf-fonts"),
  published: path.join(PROJECT_ROOT, "public", "issues", "articles"),
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  console.log(
    JSON.stringify(
      TYPESET_ARTICLES.map(
        ({ slug, pdfBasename, pageCount, firstPage, lastPage, doi }) => ({
          slug,
          pdfBasename,
          pageCount,
          firstPage,
          lastPage,
          doi,
        }),
      ),
      null,
      2,
    ),
  );
}
