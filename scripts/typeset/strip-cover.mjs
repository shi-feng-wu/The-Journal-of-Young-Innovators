/**
 * Removes the generated navy cover page (page 1) from a stamped article PDF,
 * leaving the author's original manuscript.
 *
 *   node strip-cover.mjs <in.pdf> <out.pdf> [pagesToStrip=1]
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument } from "pdf-lib";

/** Copies every page except the first `strip` pages into a fresh document. */
export async function stripCover(inPath, outPath, strip = 1) {
  const bytes = await fs.readFile(inPath);
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const total = src.getPageCount();
  if (total <= strip) {
    throw new Error(
      `${path.basename(inPath)} has only ${total} page(s); cannot strip ${strip}`,
    );
  }

  const out = await PDFDocument.create();
  const indices = Array.from({ length: total - strip }, (_, i) => i + strip);
  const pages = await out.copyPages(src, indices);
  for (const page of pages) out.addPage(page);

  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, await out.save());
  return { inputPages: total, outputPages: indices.length };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [inPath, outPath, stripArg] = process.argv.slice(2);
  if (!inPath || !outPath) {
    console.error("usage: node strip-cover.mjs <in.pdf> <out.pdf> [pagesToStrip]");
    process.exit(1);
  }
  const result = await stripCover(
    path.resolve(inPath),
    path.resolve(outPath),
    stripArg ? Number(stripArg) : 1,
  );
  console.log(
    `${path.basename(inPath)}: ${result.inputPages} -> ${result.outputPages} pages`,
  );
}
