#!/usr/bin/env tsx
import fs from "node:fs/promises";
import path from "node:path";
import {
  PDFDocument,
  PDFFont,
  PDFName,
  PDFPage,
  PDFRef,
  PDFString,
  StandardFonts,
  rgb,
} from "pdf-lib";
import { SITE_ARTICLES } from "../app/lib/articles";

const JOURNAL_NAME = "The Journal of Young Innovators";
const JOURNAL_SHORT = "JYI";
const JOURNAL_ISSN = "3070-8885";
const SITE_URL = "https://young-innovator.org";
const LICENSE_URL = "https://creativecommons.org/licenses/by/4.0/";

// Bump the version suffix to re-generate covers on already-stamped files
// (the old cover is NOT removed automatically — regenerate from originals).
const COVER_MARKER = "JYI-Cover-v1";

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 72;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const INK = rgb(0.07, 0.09, 0.11);
const MUTED = rgb(0.38, 0.41, 0.45);
const LINK_BLUE = rgb(0.05, 0.25, 0.6);
const RULE = rgb(0.75, 0.78, 0.8);

const projectRoot = path.resolve(process.cwd());
const pdfDir = path.join(projectRoot, "public", "issues", "articles");

type Article = (typeof SITE_ARTICLES)[number];

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
  timesBold: PDFFont;
  times: PDFFont;
  timesItalic: PDFFont;
  helvetica: PDFFont;
  helveticaBold: PDFFont;
}

function drawCoverPage(doc: PDFDocument, fonts: Fonts, article: Article) {
  const page = doc.insertPage(0, [PAGE_WIDTH, PAGE_HEIGHT]);
  const { timesBold, times, timesItalic, helvetica, helveticaBold } = fonts;
  const annots: PDFRef[] = [];

  const drawCentered = (
    text: string,
    y: number,
    font: PDFFont,
    size: number,
    color = INK,
  ) => {
    const w = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: (PAGE_WIDTH - w) / 2, y, size, font, color });
  };

  const drawWrapped = (
    text: string,
    y: number,
    font: PDFFont,
    size: number,
    leading: number,
    color = INK,
  ) => {
    const lines = wrapText(text, font, size, CONTENT_WIDTH);
    for (const line of lines) {
      page.drawText(line, { x: MARGIN, y, size, font, color });
      y -= leading;
    }
    return y;
  };

  const rule = (y: number) => {
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_WIDTH - MARGIN, y },
      thickness: 0.75,
      color: RULE,
    });
  };

  // A plain-text line that is also a clickable link.
  const drawLinkLine = (
    label: string,
    linkText: string,
    y: number,
    url: string,
    size = 10,
  ) => {
    const labelWidth = label
      ? helveticaBold.widthOfTextAtSize(label, size)
      : 0;
    if (label) {
      page.drawText(label, {
        x: MARGIN,
        y,
        size,
        font: helveticaBold,
        color: INK,
      });
    }
    const x = MARGIN + labelWidth + (label ? 4 : 0);
    const w = helvetica.widthOfTextAtSize(linkText, size);
    page.drawText(linkText, { x, y, size, font: helvetica, color: LINK_BLUE });
    annots.push(makeLinkAnnotation(doc, [x, y - 3, x + w, y + size], url));
  };

  const year = publishYear(article.publishDate);
  const authors = article.author;
  const doiUrl = `https://doi.org/${article.doi}`;
  const articleUrl = `${SITE_URL}/issues/articles/${article.slug}`;
  const pageRange = `${article.firstPage}–${article.lastPage}`;

  // Masthead
  drawCentered(JOURNAL_NAME.toUpperCase(), 726, helveticaBold, 13);
  drawCentered(
    `young-innovator.org  ·  ISSN ${JOURNAL_ISSN} (Online)  ·  Open Access`,
    710,
    helvetica,
    8.5,
    MUTED,
  );
  rule(698);

  // Issue metadata
  page.drawText(
    `${article.category}  ·  Volume ${article.volume}, Issue ${article.issueNumber}  ·  pp. ${pageRange}  ·  Published ${formatLongDate(article.publishDate)}`,
    { x: MARGIN, y: 676, size: 9, font: helvetica, color: MUTED },
  );

  // Title — large, top of page (Google Scholar reads this)
  let y = 640;
  y = drawWrapped(article.title, y, timesBold, 25, 31);

  // Authors directly below the title
  y -= 8;
  y = drawWrapped(authors, y, times, 15, 20);

  if (article.school) {
    y -= 2;
    y = drawWrapped(article.school, y, timesItalic, 12, 16, MUTED);
  }

  // Abstract
  y -= 18;
  page.drawText("ABSTRACT", {
    x: MARGIN,
    y,
    size: 9,
    font: helveticaBold,
    color: MUTED,
  });
  y -= 16;
  y = drawWrapped(article.abstract, y, times, 11, 15.5);

  // Citation + links
  y -= 20;
  rule(y);
  y -= 20;
  page.drawText("How to cite this article:", {
    x: MARGIN,
    y,
    size: 9,
    font: helveticaBold,
    color: INK,
  });
  y -= 14;
  const citation = `${authors} (${year}). ${article.title}. ${JOURNAL_NAME}, ${article.volume}(${article.issueNumber}), pp. ${pageRange}. https://doi.org/${article.doi}`;
  y = drawWrapped(citation, y, times, 10, 14);

  y -= 10;
  drawLinkLine("DOI:", doiUrl, y, doiUrl);
  y -= 16;
  drawLinkLine("This article is available at:", articleUrl, y, articleUrl);

  // Footer — license
  rule(120);
  const licenseText = `© ${year} The Author(s). Published by ${JOURNAL_NAME}. This is an open-access article distributed under the terms of the Creative Commons Attribution 4.0 International License (CC BY 4.0).`;
  drawWrapped(licenseText, 104, times, 9, 12.5, MUTED);
  drawLinkLine("License:", LICENSE_URL, 66, LICENSE_URL, 9);

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
    const fonts: Fonts = {
      timesBold: await doc.embedFont(StandardFonts.TimesRomanBold),
      times: await doc.embedFont(StandardFonts.TimesRoman),
      timesItalic: await doc.embedFont(StandardFonts.TimesRomanItalic),
      helvetica: await doc.embedFont(StandardFonts.Helvetica),
      helveticaBold: await doc.embedFont(StandardFonts.HelveticaBold),
    };
    drawCoverPage(doc, fonts, article);
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

async function main() {
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
