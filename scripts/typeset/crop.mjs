/**
 * Crops a rectangle out of a page render (pagesrc/<slug>/page-NN.png at 150dpi)
 * to make a figure asset for figures/<slug>/fig-NN.png.
 *
 *   node crop.mjs <png> <x> <y> <w> <h> <out.png>
 *
 * x/y/w/h are pixels in the source PNG. At 150dpi a US Letter page render is
 * 1275 x 1650 px, so a point coordinate p maps to pixel p * 150/72.
 */
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

export async function crop(src, { x, y, width, height }, dest) {
  const image = sharp(src);
  const meta = await image.metadata();

  const left = Math.max(0, Math.round(x));
  const top = Math.max(0, Math.round(y));
  const w = Math.min(Math.round(width), meta.width - left);
  const h = Math.min(Math.round(height), meta.height - top);
  if (w <= 0 || h <= 0) {
    throw new Error(
      `crop is outside the image (${meta.width}x${meta.height}): ${x},${y} ${width}x${height}`,
    );
  }

  await fs.mkdir(path.dirname(dest), { recursive: true });
  await image.extract({ left, top, width: w, height: h }).png().toFile(dest);
  return { source: `${meta.width}x${meta.height}`, out: `${w}x${h}`, left, top };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  if (args.length !== 6) {
    console.error("usage: node crop.mjs <png> <x> <y> <w> <h> <out.png>");
    process.exit(1);
  }
  const [src, x, y, w, h, dest] = args;
  const r = await crop(
    path.resolve(src),
    { x: Number(x), y: Number(y), width: Number(w), height: Number(h) },
    path.resolve(dest),
  );
  console.log(`${path.basename(src)} ${r.source} -> ${path.basename(dest)} ${r.out} @ ${r.left},${r.top}`);
}
