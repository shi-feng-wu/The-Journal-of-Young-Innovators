#!/usr/bin/env tsx
import fs from "node:fs/promises";
import path from "node:path";
import { SITE_ARTICLES, type SiteArticle } from "../app/lib/articles";

const SITE_URL = "https://young-innovator.org";
const JOURNAL_NAME = "The Journal of Young Innovators";
const JOURNAL_ISSN = "3070-8885";
const LICENSE_URL = "https://creativecommons.org/licenses/by/4.0/";
const DEPOSITOR_NAME = "The Journal of Young Innovators";
const DEPOSITOR_EMAIL = "shifeng@inceptionpad.com";
const REGISTRANT = "The Journal of Young Innovators";

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseDate(publishDate: string) {
  const d = new Date(publishDate);
  return {
    year: d.getUTCFullYear(),
    month: String(d.getUTCMonth() + 1).padStart(2, "0"),
    day: String(d.getUTCDate()).padStart(2, "0"),
  };
}

function publicationDateXml(publishDate: string, indent: string) {
  const { year, month, day } = parseDate(publishDate);
  return [
    `${indent}<publication_date media_type="online">`,
    `${indent}  <month>${month}</month>`,
    `${indent}  <day>${day}</day>`,
    `${indent}  <year>${year}</year>`,
    `${indent}</publication_date>`,
  ].join("\n");
}

function contributorsXml(article: SiteArticle) {
  const names = article.author
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  const people = names.map((name, index) => {
    const parts = name.split(/\s+/);
    const surname = parts[parts.length - 1];
    const givenName = parts.slice(0, -1).join(" ");
    const sequence = index === 0 ? "first" : "additional";
    const lines = [
      `        <person_name sequence="${sequence}" contributor_role="author">`,
    ];
    if (givenName) {
      lines.push(`          <given_name>${esc(givenName)}</given_name>`);
    }
    lines.push(`          <surname>${esc(surname)}</surname>`);
    if (article.school) {
      lines.push(
        `          <affiliations>`,
        `            <institution>`,
        `              <institution_name>${esc(article.school)}</institution_name>`,
        `            </institution>`,
        `          </affiliations>`,
      );
    }
    lines.push(`        </person_name>`);
    return lines.join("\n");
  });

  return [`      <contributors>`, ...people, `      </contributors>`].join(
    "\n",
  );
}

function articleXml(article: SiteArticle) {
  const canonical = `${SITE_URL}/issues/articles/${article.slug}`;
  const pdfUrl = `${SITE_URL}/articles/${encodeURIComponent(article.pdfBasename)}.pdf`;

  return [
    `      <journal_article publication_type="full_text">`,
    `      <titles>`,
    `        <title>${esc(article.title)}</title>`,
    `      </titles>`,
    contributorsXml(article),
    `      <jats:abstract xmlns:jats="http://www.ncbi.nlm.nih.gov/JATS1">`,
    `        <jats:p>${esc(article.abstract)}</jats:p>`,
    `      </jats:abstract>`,
    publicationDateXml(article.publishDate, "      "),
    `      <ai:program xmlns:ai="http://www.crossref.org/AccessIndicators.xsd" name="AccessIndicators">`,
    `        <ai:free_to_read/>`,
    `        <ai:license_ref applies_to="vor">${LICENSE_URL}</ai:license_ref>`,
    `      </ai:program>`,
    `      <doi_data>`,
    `        <doi>${article.doi}</doi>`,
    `        <resource>${esc(canonical)}</resource>`,
    `        <collection property="crawler-based">`,
    `          <item crawler="google">`,
    `            <resource>${esc(pdfUrl)}</resource>`,
    `          </item>`,
    `        </collection>`,
    `        <collection property="text-mining">`,
    `          <item>`,
    `            <resource mime_type="application/pdf">${esc(pdfUrl)}</resource>`,
    `          </item>`,
    `        </collection>`,
    `      </doi_data>`,
    `      </journal_article>`,
  ].join("\n");
}

function issueKey(article: SiteArticle) {
  return `${article.volume}.${article.issueNumber}`;
}

async function main() {
  const issues = new Map<string, SiteArticle[]>();
  for (const article of SITE_ARTICLES) {
    const key = issueKey(article);
    issues.set(key, [...(issues.get(key) ?? []), article]);
  }

  const journalBlocks = [...issues.entries()]
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([, articles], blockIndex) => {
      const sorted = [...articles].sort(
        (a, b) =>
          new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime(),
      );
      const first = sorted[0];
      // The journal title-level DOI may only appear once per batch.
      const journalDoi =
        blockIndex === 0
          ? [
              `      <doi_data>`,
              `        <doi>10.67419/jyi</doi>`,
              `        <resource>${SITE_URL}</resource>`,
              `      </doi_data>`,
            ]
          : [];
      return [
        `  <journal>`,
        `    <journal_metadata language="en">`,
        `      <full_title>${JOURNAL_NAME}</full_title>`,
        `      <abbrev_title>JYI</abbrev_title>`,
        `      <issn media_type="electronic">${JOURNAL_ISSN}</issn>`,
        ...journalDoi,
        `    </journal_metadata>`,
        `    <journal_issue>`,
        publicationDateXml(first.publishDate, "      "),
        `      <journal_volume>`,
        `        <volume>${first.volume}</volume>`,
        `      </journal_volume>`,
        `      <issue>${first.issueNumber}</issue>`,
        `    </journal_issue>`,
        ...sorted.map(articleXml),
        `  </journal>`,
      ].join("\n");
    });

  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<doi_batch xmlns="http://www.crossref.org/schema/5.3.1"`,
    `           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"`,
    `           xsi:schemaLocation="http://www.crossref.org/schema/5.3.1 http://www.crossref.org/schemas/crossref5.3.1.xsd"`,
    `           version="5.3.1">`,
    `  <head>`,
    `    <doi_batch_id>jyi-${timestamp}</doi_batch_id>`,
    `    <timestamp>${timestamp}</timestamp>`,
    `    <depositor>`,
    `      <depositor_name>${DEPOSITOR_NAME}</depositor_name>`,
    `      <email_address>${DEPOSITOR_EMAIL}</email_address>`,
    `    </depositor>`,
    `    <registrant>${REGISTRANT}</registrant>`,
    `  </head>`,
    `  <body>`,
    ...journalBlocks,
    `  </body>`,
    `</doi_batch>`,
    ``,
  ].join("\n");

  const outPath = path.join(process.cwd(), "crossref-deposit.xml");
  await fs.writeFile(outPath, xml, "utf8");
  console.log(
    `Wrote ${outPath} (${SITE_ARTICLES.length} articles, ${issues.size} issues)`,
  );
}

main();
