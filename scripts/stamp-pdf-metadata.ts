#!/usr/bin/env tsx
import fs from "node:fs/promises";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import { SITE_ARTICLES } from "../app/lib/articles";

const JOURNAL_NAME = "The Journal of Young Innovators";
const JOURNAL_SHORT = "JYI";
const JOURNAL_ISSN = "3070-8885";
const LICENSE_URL = "https://creativecommons.org/licenses/by/4.0/";

const projectRoot = path.resolve(process.cwd());
const pdfDir = path.join(projectRoot, "public", "articles");

function buildKeywords(category: string, year: string) {
  return [
    JOURNAL_NAME,
    JOURNAL_SHORT,
    `ISSN ${JOURNAL_ISSN}`,
    category,
    `Year ${year}`,
    "Open Access",
    "CC BY 4.0",
  ].join("; ");
}

async function stampOne(article: (typeof SITE_ARTICLES)[number]) {
  const filename = `${article.pdfBasename}.pdf`;
  const filePath = path.join(pdfDir, filename);

  let bytes: Buffer;
  try {
    bytes = await fs.readFile(filePath);
  } catch {
    console.warn(`  ⚠ skip: PDF not found at ${filePath}`);
    return;
  }

  const doc = await PDFDocument.load(bytes, { updateMetadata: false });
  const year = new Date(article.publishDate).getUTCFullYear().toString();
  const authorWithSchool = article.school
    ? `${article.author} (${article.school})`
    : article.author;

  const desired = {
    title: article.title,
    author: authorWithSchool,
    subject: article.abstract,
    keywords: buildKeywords(article.category, year),
    producer: JOURNAL_NAME,
    creator: `${JOURNAL_NAME} (Vol. ${article.volume}, Issue ${article.issueNumber})`,
    creationDate: new Date(article.publishDate).getTime(),
  };

  const current = {
    title: doc.getTitle(),
    author: doc.getAuthor(),
    subject: doc.getSubject(),
    keywords: doc.getKeywords(),
    producer: doc.getProducer(),
    creator: doc.getCreator(),
    creationDate: doc.getCreationDate()?.getTime(),
  };

  const unchanged =
    current.title === desired.title &&
    current.author === desired.author &&
    current.subject === desired.subject &&
    current.keywords === desired.keywords &&
    current.producer === desired.producer &&
    current.creator === desired.creator &&
    current.creationDate === desired.creationDate;

  if (unchanged) {
    console.log(`  · ${filename} (unchanged)`);
    return;
  }

  doc.setTitle(desired.title);
  doc.setAuthor(desired.author);
  doc.setSubject(desired.subject);
  doc.setKeywords([desired.keywords]);
  doc.setProducer(desired.producer);
  doc.setCreator(desired.creator);
  doc.setCreationDate(new Date(desired.creationDate));
  doc.setModificationDate(new Date());

  const out = await doc.save({ useObjectStreams: false });
  await fs.writeFile(filePath, out);

  console.log(`  ✓ ${filename}`);
}

async function main() {
  console.log(`Stamping metadata on ${SITE_ARTICLES.length} PDFs...`);
  console.log(`License URL embedded: ${LICENSE_URL}`);
  console.log("");
  for (const article of SITE_ARTICLES) {
    await stampOne(article);
  }
  console.log("");
  console.log("Done. Verify with: pdfinfo 'public/articles/<file>.pdf'");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
