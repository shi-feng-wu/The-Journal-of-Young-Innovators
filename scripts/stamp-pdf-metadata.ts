#!/usr/bin/env tsx
import fs from "node:fs/promises";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import {
  PDFDocument,
  PDFFont,
  PDFImage,
  PDFName,
  PDFRef,
  PDFString,
  rgb,
  type RGB,
} from "pdf-lib";
import { SITE_ARTICLES } from "../app/lib/articles";

const JOURNAL_NAME = "The Journal of Young Innovators";
const JOURNAL_SHORT = "JYI";
const JOURNAL_ISSN = "3070-8885";
const SITE_URL = "https://young-innovator.org";
const LICENSE_URL = "https://creativecommons.org/licenses/by/4.0/";

// Bump the version suffix to re-generate covers on already-stamped files
// (the old cover is NOT removed automatically — regenerate from originals).
const COVER_MARKER = "JYI-Cover-v5";

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 68;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

// Site palette (app/globals.css): --primary, --highlight, --foreground
const NAVY = rgb(0 / 255, 45 / 255, 114 / 255); // #002d72
const INK = rgb(17 / 255, 17 / 255, 17 / 255); // #111111
const SLATE = rgb(82 / 255, 98 / 255, 122 / 255); // navy-tinted muted
const MIST = rgb(238 / 255, 242 / 255, 248 / 255); // citation panel tint
const RULE = rgb(204 / 255, 213 / 255, 227 / 255); // hairline, navy-tinted

const projectRoot = path.resolve(process.cwd());
const pdfDir = path.join(projectRoot, "public", "issues", "articles");
const fontDir = path.join(projectRoot, "scripts", "pdf-fonts");
const logoPath = path.join(projectRoot, "public", "logolight.png");
const typesetDir = path.join(projectRoot, "scripts", "typeset");
const keywordsPath = path.join(typesetDir, "keywords.json");
const previewDir = path.join(typesetDir, "out");

type Article = (typeof SITE_ARTICLES)[number];

// Optional author keywords, keyed by article slug (scripts/typeset/keywords.json).
// Missing file, missing entry, or an empty string ⇒ no KEYWORDS block is drawn.
let keywordsBySlug: Record<string, string> = {};

async function loadKeywords() {
  let raw: string;
  try {
    raw = await fs.readFile(keywordsPath, "utf8");
  } catch {
    keywordsBySlug = {};
    return;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.warn(`  ⚠ ${keywordsPath} is not valid JSON — ignoring keywords`);
    keywordsBySlug = {};
    return;
  }
  const next: Record<string, string> = {};
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    for (const [slug, value] of Object.entries(parsed)) {
      if (typeof value === "string" && value.trim()) next[slug] = value.trim();
    }
  }
  keywordsBySlug = next;
}

function buildKeywords(category: string, year: string, doi: string) {
  return [
    JOURNAL_NAME,
    JOURNAL_SHORT,
    `ISSN ${JOURNAL_ISSN}`,
    `doi:${doi}`,
    category,
    `Year ${year}`,
    "Open Access",
    "CC BY 4.0",
    COVER_MARKER,
  ].join("; ");
}

function publishYear(publishDate: string) {
  return publishDate.split("-")[0];
}

function formatLongDate(publishDate: string) {
  const [y, m, d] = publishDate.split("-").map(Number);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[m - 1]} ${d}, ${y}`;
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function trackedWidth(
  text: string,
  font: PDFFont,
  size: number,
  tracking: number,
) {
  return (
    font.widthOfTextAtSize(text, size) +
    tracking * Math.max(0, text.length - 1)
  );
}

function makeLinkAnnotation(
  doc: PDFDocument,
  rect: [number, number, number, number],
  url: string,
): PDFRef {
  const annotation = doc.context.obj({
    Type: "Annot",
    Subtype: "Link",
    Rect: rect,
    Border: [0, 0, 0],
    A: {
      Type: "Action",
      S: "URI",
      URI: PDFString.of(url),
    },
  });
  return doc.context.register(annotation);
}

interface Fonts {
  display: PDFFont; // DM Serif Display — site headings
  body: PDFFont; // Source Sans 3 — site body
  bodyItalic: PDFFont;
  bodySemibold: PDFFont;
  mono: PDFFont; // Roboto Mono — site labels/nav
  monoMedium: PDFFont;
}

interface Assets {
  fonts: Fonts;
  logo: PDFImage;
}

async function embedAssets(doc: PDFDocument): Promise<Assets> {
  doc.registerFontkit(fontkit);
  const load = (file: string) => fs.readFile(path.join(fontDir, file));
  const fonts: Fonts = {
    display: await doc.embedFont(await load("DMSerifDisplay-Regular.ttf"), {
      subset: true,
    }),
    body: await doc.embedFont(await load("SourceSans3-Regular.ttf"), {
      subset: true,
    }),
    bodyItalic: await doc.embedFont(await load("SourceSans3-It.ttf"), {
      subset: true,
    }),
    bodySemibold: await doc.embedFont(await load("SourceSans3-Semibold.ttf"), {
      subset: true,
    }),
    mono: await doc.embedFont(await load("RobotoMono-Regular.ttf"), {
      subset: true,
    }),
    monoMedium: await doc.embedFont(await load("RobotoMono-Medium.ttf"), {
      subset: true,
    }),
  };
  const logo = await doc.embedPng(await fs.readFile(logoPath));
  return { fonts, logo };
}

function drawCoverPage(doc: PDFDocument, assets: Assets, article: Article) {
  const page = doc.insertPage(0, [PAGE_WIDTH, PAGE_HEIGHT]);
  const { display, body, bodyItalic, bodySemibold, mono, monoMedium } =
    assets.fonts;
  const annots: PDFRef[] = [];

  // Letterspaced text (the site's tracking-[0.2em] mono label voice).
  const drawTracked = (
    text: string,
    x: number,
    y: number,
    font: PDFFont,
    size: number,
    tracking: number,
    color: RGB,
    opacity = 1,
  ) => {
    let cx = x;
    for (const ch of text) {
      page.drawText(ch, { x: cx, y, size, font, color, opacity });
      cx += font.widthOfTextAtSize(ch, size) + tracking;
    }
  };

  const drawWrapped = (
    text: string,
    y: number,
    font: PDFFont,
    size: number,
    leading: number,
    color: RGB,
    x = MARGIN,
    maxWidth = CONTENT_WIDTH,
  ) => {
    const lines = wrapText(text, font, size, maxWidth);
    for (const line of lines) {
      page.drawText(line, { x, y, size, font, color });
      y -= leading;
    }
    return y;
  };

  const year = publishYear(article.publishDate);
  const doiUrl = `https://doi.org/${article.doi}`;
  const articleUrl = `${SITE_URL}/issues/articles/${article.slug}`;
  const pageRange = `${article.firstPage}–${article.lastPage}`;

  // ── Masthead: full-bleed navy band with reversed logo + wordmark.
  const BAND_H = 96;
  const bandBottom = PAGE_HEIGHT - BAND_H;
  page.drawRectangle({
    x: 0,
    y: bandBottom,
    width: PAGE_WIDTH,
    height: BAND_H,
    color: NAVY,
  });

  // Logo spans the three-line text block: DOI baseline (+26) to wordmark
  // cap-top (≈ +68.3).
  const logoH = 42;
  const logoW = (assets.logo.width / assets.logo.height) * logoH;
  page.drawImage(assets.logo, {
    x: MARGIN,
    y: bandBottom + 26.3,
    width: logoW,
    height: logoH,
  });

  // Three baselines inside the 96pt band — wordmark cap-top (≈ +55 + 13.3) and
  // the DOI baseline (+26) straddle the band's midpoint (+48), so the stack
  // stays optically centred against the 34pt logo beside it.
  const wordmarkX = MARGIN + logoW + 16;
  page.drawText(JOURNAL_NAME, {
    x: wordmarkX,
    y: bandBottom + 55,
    size: 19,
    font: display,
    color: rgb(1, 1, 1),
  });
  drawTracked(
    `OPEN ACCESS · ISSN ${JOURNAL_ISSN} (ONLINE) · YOUNG-INNOVATOR.ORG`,
    wordmarkX + 1,
    bandBottom + 40,
    mono,
    6.5,
    0.9,
    rgb(1, 1, 1),
    0.75,
  );
  // DOI, BMC-style: the resolvable URL sits directly under the ISSN line, a
  // touch brighter, with near-zero tracking so the URL stays readable.
  const bandDoiX = wordmarkX + 1;
  const bandDoiY = bandBottom + 30;
  const bandDoiSize = 6.5;
  const bandDoiTracking = 0.3;
  drawTracked(
    doiUrl,
    bandDoiX,
    bandDoiY,
    mono,
    bandDoiSize,
    bandDoiTracking,
    rgb(1, 1, 1),
    0.9,
  );
  const bandDoiW = trackedWidth(doiUrl, mono, bandDoiSize, bandDoiTracking);
  annots.push(
    makeLinkAnnotation(
      doc,
      [
        bandDoiX,
        bandDoiY - 2.5,
        bandDoiX + bandDoiW,
        bandDoiY + bandDoiSize + 1,
      ],
      doiUrl,
    ),
  );

  // ── Eyebrow: issue metadata in tracked mono, publish date right-aligned.
  const eyebrowY = bandBottom - 36;
  const eyebrow = `${article.category} · VOLUME ${article.volume}, ISSUE ${article.issueNumber} · PP. ${pageRange}`.toUpperCase();
  drawTracked(eyebrow, MARGIN, eyebrowY, monoMedium, 7.5, 1.4, SLATE);
  const dateText = formatLongDate(article.publishDate).toUpperCase();
  const dateW = trackedWidth(dateText, mono, 7.5, 1.4);
  drawTracked(
    dateText,
    PAGE_WIDTH - MARGIN - dateW,
    eyebrowY,
    mono,
    7.5,
    1.4,
    SLATE,
  );

  // ── Fit ladder: measure the whole column before drawing anything and
  //    step the abstract (then the title) down until the citation panel
  //    clears the footer rule at y=106.
  const citation = `${article.author} (${year}). ${article.title}. ${JOURNAL_NAME}, ${article.volume}(${article.issueNumber}), pp. ${pageRange}.`;
  const PAD = 16;
  const panelTextW = CONTENT_WIDTH - PAD * 2;
  const citationLines = wrapText(citation, body, 10, panelTextW);
  const panelH = 12 + 15 + citationLines.length * 13.5 + 8 + 14 + 14 + 12;

  // ── Optional author keywords, drawn between the abstract and the panel.
  const KW_SIZE = 9.5;
  const KW_LEADING = 13;
  const KW_GAP_BEFORE = 12; // abstract block → KEYWORDS label baseline
  const KW_LABEL_TO_TEXT = 14; // 8pt label + a 6pt gap
  const keywords = keywordsBySlug[article.slug] ?? "";
  const keywordLines = keywords
    ? wrapText(keywords, body, KW_SIZE, CONTENT_WIDTH)
    : [];
  const keywordBlockH = keywordLines.length
    ? KW_GAP_BEFORE + KW_LABEL_TO_TEXT + keywordLines.length * KW_LEADING
    : 0;

  const bottomFor = (
    ts: number,
    tl: number,
    as_: number,
    al: number,
  ) =>
    eyebrowY -
    40 -
    wrapText(article.title, display, ts, CONTENT_WIDTH).length * tl -
    10 -
    wrapText(article.author, bodySemibold, 13.5, CONTENT_WIDTH).length * 19 -
    (article.school
      ? wrapText(article.school, bodyItalic, 11, CONTENT_WIDTH).length * 15
      : 0) -
    22 -
    17 -
    wrapText(article.abstract, body, as_, CONTENT_WIDTH).length * al -
    keywordBlockH -
    24 -
    panelH;

  const ladder: Array<[number, number, number, number]> = [
    [27, 34, 10.5, 15],
    [27, 34, 9.75, 13.5],
    [25, 31, 9.75, 13.5],
    [25, 31, 9, 12.5],
  ];
  let [titleSize, titleLeading, absSize, absLeading] =
    ladder[ladder.length - 1];
  for (const cand of ladder) {
    if (bottomFor(...cand) >= 118) {
      [titleSize, titleLeading, absSize, absLeading] = cand;
      break;
    }
  }
  if (bottomFor(titleSize, titleLeading, absSize, absLeading) < 118) {
    console.warn(
      `  ⚠ ${article.slug}: cover content runs long even at the smallest ladder step — check the layout`,
    );
  }

  // ── Title in the site's display serif, authors right below.
  let y = eyebrowY - 40;
  y = drawWrapped(article.title, y, display, titleSize, titleLeading, NAVY);

  y -= 10;
  y = drawWrapped(article.author, y, bodySemibold, 13.5, 19, INK);

  if (article.school) {
    y = drawWrapped(article.school, y, bodyItalic, 11, 15, SLATE);
  }

  y -= 22;
  drawTracked("ABSTRACT", MARGIN, y, monoMedium, 8, 1.6, SLATE);
  y -= 17;
  y = drawWrapped(article.abstract, y, body, absSize, absLeading, INK);

  if (keywordLines.length) {
    y -= KW_GAP_BEFORE;
    drawTracked("KEYWORDS", MARGIN, y, monoMedium, 8, 1.6, SLATE);
    y -= KW_LABEL_TO_TEXT;
    for (const line of keywordLines) {
      page.drawText(line, {
        x: MARGIN,
        y,
        size: KW_SIZE,
        font: body,
        color: INK,
      });
      y -= KW_LEADING;
    }
  }

  // ── Citation panel: mist tint, navy accent bar, links in mono navy.
  const panelTop = y - 24;
  page.drawRectangle({
    x: MARGIN,
    y: panelTop - panelH,
    width: CONTENT_WIDTH,
    height: panelH,
    color: MIST,
  });
  page.drawRectangle({
    x: MARGIN,
    y: panelTop - panelH,
    width: 3,
    height: panelH,
    color: NAVY,
  });

  let py = panelTop - 12 - 8;
  drawTracked(
    "HOW TO CITE THIS ARTICLE",
    MARGIN + PAD,
    py,
    monoMedium,
    7.5,
    1.6,
    NAVY,
  );
  py -= 15;
  py = drawWrapped(
    citation,
    py,
    body,
    10,
    13.5,
    INK,
    MARGIN + PAD,
    panelTextW,
  );
  py -= 8;

  const drawLinkLine = (
    label: string,
    linkText: string,
    ly: number,
    url: string,
    size = 8.5,
  ) => {
    const labelW = trackedWidth(label, monoMedium, size, 1);
    drawTracked(label, MARGIN + PAD, ly, monoMedium, size, 1, SLATE);
    const x = MARGIN + PAD + labelW + 8;
    page.drawText(linkText, { x, y: ly, size, font: mono, color: NAVY });
    const w = mono.widthOfTextAtSize(linkText, size);
    annots.push(makeLinkAnnotation(doc, [x, ly - 3, x + w, ly + size], url));
  };

  drawLinkLine("DOI", doiUrl, py, doiUrl);
  py -= 14;
  drawLinkLine("READ ONLINE", articleUrl, py, articleUrl);

  // ── Footer: license, quiet.
  page.drawLine({
    start: { x: MARGIN, y: 106 },
    end: { x: PAGE_WIDTH - MARGIN, y: 106 },
    thickness: 0.75,
    color: RULE,
  });
  const licenseText = `© ${year} The Author(s). Published by ${JOURNAL_NAME}. This is an open-access article distributed under the terms of the Creative Commons Attribution 4.0 International License (CC BY 4.0).`;
  drawWrapped(licenseText, 92, body, 8.5, 12, SLATE);
  const licLabelW = trackedWidth("LICENSE", monoMedium, 8, 1);
  drawTracked("LICENSE", MARGIN, 56, monoMedium, 8, 1, SLATE);
  const licX = MARGIN + licLabelW + 8;
  page.drawText(LICENSE_URL, {
    x: licX,
    y: 56,
    size: 8,
    font: mono,
    color: NAVY,
  });
  const licW = mono.widthOfTextAtSize(LICENSE_URL, 8);
  annots.push(makeLinkAnnotation(doc, [licX, 53, licX + licW, 64], LICENSE_URL));

  page.node.set(PDFName.of("Annots"), doc.context.obj(annots));
  return page;
}

async function stampOne(article: Article) {
  const filename = `${article.slug}.pdf`;
  const filePath = path.join(pdfDir, filename);

  let bytes: Buffer;
  try {
    bytes = await fs.readFile(filePath);
  } catch {
    console.warn(`  ⚠ skip: PDF not found at ${filePath}`);
    return;
  }

  const doc = await PDFDocument.load(bytes, { updateMetadata: false });
  const year = publishYear(article.publishDate);
  const authorWithSchool = article.school
    ? `${article.author} (${article.school})`
    : article.author;

  const desired = {
    title: article.title,
    author: authorWithSchool,
    subject: article.abstract,
    keywords: buildKeywords(article.category, year, article.doi),
    producer: JOURNAL_NAME,
    creator: `${JOURNAL_NAME} (Vol. ${article.volume}, Issue ${article.issueNumber})`,
  };

  const currentKeywords = doc.getKeywords() ?? "";
  const hasCover = currentKeywords.includes(COVER_MARKER);

  const unchanged =
    hasCover &&
    doc.getTitle() === desired.title &&
    doc.getAuthor() === desired.author &&
    doc.getSubject() === desired.subject &&
    currentKeywords === desired.keywords &&
    doc.getProducer() === desired.producer &&
    doc.getCreator() === desired.creator;

  if (unchanged) {
    console.log(`  · ${filename} (unchanged)`);
    return;
  }

  if (!hasCover) {
    if (/JYI-Cover-v\d+/.test(currentKeywords)) {
      console.warn(
        `  ⚠ skip: ${filename} carries an older cover (${currentKeywords.match(/JYI-Cover-v\d+/)?.[0]}). Restore the original PDF from git history before re-stamping.`,
      );
      return;
    }
    const assets = await embedAssets(doc);
    drawCoverPage(doc, assets, article);
  }

  doc.setTitle(desired.title);
  doc.setAuthor(desired.author);
  doc.setSubject(desired.subject);
  doc.setKeywords([desired.keywords]);
  doc.setProducer(desired.producer);
  doc.setCreator(desired.creator);
  doc.setCreationDate(new Date(article.publishDate));
  doc.setModificationDate(new Date());

  const out = await doc.save({ useObjectStreams: false });
  await fs.writeFile(filePath, out);

  console.log(
    `  ✓ ${filename}${hasCover ? " (metadata only)" : " (cover + metadata)"}`,
  );
}

/**
 * `--preview <slug>` — render just the cover page for one article to
 * scripts/typeset/out/cover-preview-<slug>.pdf. Uses the same articles.ts
 * metadata and the same drawCoverPage() the stamper uses, but never reads or
 * writes any article PDF, and does not require one to exist. (The only file it
 * touches outside scripts/ is the read-only masthead logo asset.)
 */
async function previewOne(slug: string) {
  const article = SITE_ARTICLES.find((a) => a.slug === slug);
  if (!article) {
    console.error(`Unknown article slug: ${slug}`);
    console.error("Known slugs:");
    for (const a of SITE_ARTICLES) console.error(`  ${a.slug}`);
    process.exit(1);
  }

  const doc = await PDFDocument.create();
  const assets = await embedAssets(doc);
  drawCoverPage(doc, assets, article);

  const year = publishYear(article.publishDate);
  doc.setTitle(`${article.title} — cover preview`);
  doc.setAuthor(
    article.school ? `${article.author} (${article.school})` : article.author,
  );
  doc.setSubject(article.abstract);
  doc.setKeywords([buildKeywords(article.category, year, article.doi)]);
  doc.setProducer(JOURNAL_NAME);
  doc.setCreator(`${JOURNAL_NAME} cover preview (${COVER_MARKER})`);

  await fs.mkdir(previewDir, { recursive: true });
  const outPath = path.join(previewDir, `cover-preview-${slug}.pdf`);
  await fs.writeFile(outPath, await doc.save({ useObjectStreams: false }));

  const kw = keywordsBySlug[slug];
  console.log(`Cover preview: ${outPath}`);
  console.log(`  doi   ${`https://doi.org/${article.doi}`}`);
  console.log(`  kw    ${kw ? kw : "(none)"}`);
}

async function main() {
  await loadKeywords();

  const argv = process.argv.slice(2);
  const previewIdx = argv.indexOf("--preview");
  if (previewIdx !== -1) {
    const slug = argv[previewIdx + 1];
    if (!slug || slug.startsWith("--")) {
      console.error("Usage: tsx scripts/stamp-pdf-metadata.ts --preview <slug>");
      process.exit(1);
    }
    await previewOne(slug);
    return;
  }

  console.log(`Stamping cover + metadata on ${SITE_ARTICLES.length} PDFs...`);
  console.log(`License URL embedded: ${LICENSE_URL}`);
  console.log("");
  for (const article of SITE_ARTICLES) {
    await stampOne(article);
  }
  console.log("");
  console.log("Done. Verify with: pdfinfo 'public/issues/articles/<slug>.pdf'");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
