import {
  getSiteArticleFromPdfPath,
  getSiteArticleFromSlug,
  SITE_ARTICLES,
} from "@/lib/articles";

export function toArticleViewerHref(pdfPath: string) {
  const article = getSiteArticleFromPdfPath(pdfPath);
  if (!article) return pdfPath;

  return `/issues/articles/${article.slug}`;
}

export function toArticleViewerHrefWithSource(
  pdfPath: string,
  from: "home" | "issues",
) {
  const article = getSiteArticleFromPdfPath(pdfPath);
  if (!article) return pdfPath;

  return `/issues/articles/${article.slug}?from=${from}`;
}

export function getArticleDisplayNameFromSlug(slug: string) {
  return getSiteArticleFromSlug(slug)?.title ?? null;
}

export function getPdfPathFromArticleSlug(slug: string) {
  return getSiteArticleFromSlug(slug)?.pdfPath ?? null;
}

export function getArticleViewerStaticParams() {
  return SITE_ARTICLES.map((article) => ({ article: article.slug }));
}

export function getArticleFromSlug(slug: string) {
  return getSiteArticleFromSlug(slug);
}
