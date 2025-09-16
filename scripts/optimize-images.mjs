#!/usr/bin/env node
import path from 'node:path';
import fs from 'fs-extra';
import sharp from 'sharp';

/*
  Image Optimization Script
  -------------------------
  Source folder (original large images): public/images/original
  Output folder (optimized): public/images/optimized

  For every image (jpg|jpeg|png) found recursively in source:
    - Generate resized widths: 400, 800, 1600
    - For each width create WebP (quality 68) and AVIF (quality 45)
    - Skip generation if target file already exists and is newer than source

  Usage:
    pnpm optimize-images

  After running, you can choose one of these integration approaches:
    1. Direct file reference: /images/optimized/<basename>-800.webp
    2. Responsive background via image-set in CSS.

  Safe to re-run; only regenerates if source is newer.
*/

const projectRoot = path.resolve(process.cwd());
const srcDir = path.join(projectRoot, 'public', 'images', 'original');
const outDir = path.join(projectRoot, 'public', 'images', 'optimized');

const widths = [400, 800, 1600];

async function collectImages(dir) {
  if (!await fs.pathExists(dir)) return [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (ent) => {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) return collectImages(full);
    if (/\.(jpe?g|png)$/i.test(ent.name)) return [full];
    return [];
  }));
  return files.flat();
}

function targetNames(srcPath, width) {
  const base = path.basename(srcPath).replace(/\.(jpe?g|png)$/i, '');
  return {
    webp: path.join(outDir, `${base}-${width}.webp`),
    avif: path.join(outDir, `${base}-${width}.avif`)
  };
}

async function ensureDirStructure() {
  await fs.ensureDir(outDir);
}

async function optimizeOne(srcPath) {
  const srcStat = await fs.stat(srcPath);
  for (const width of widths) {
    const { webp, avif } = targetNames(srcPath, width);
    // Skip if both exist and are newer than source
    const webpFresh = await isFresh(webp, srcStat);
    const avifFresh = await isFresh(avif, srcStat);
    if (webpFresh && avifFresh) {
      console.log(`[skip] ${path.basename(srcPath)} @${width}`);
      continue;
    }

    const pipeline = sharp(srcPath).resize({ width, withoutEnlargement: true });

    if (!webpFresh) {
      await pipeline.clone().webp({ quality: 68 }).toFile(webp);
      console.log(`[webp] ${path.basename(srcPath)} -> ${path.basename(webp)}`);
    }
    if (!avifFresh) {
      await pipeline.clone().avif({ quality: 45 }).toFile(avif);
      console.log(`[avif] ${path.basename(srcPath)} -> ${path.basename(avif)}`);
    }
  }
}

async function isFresh(filePath, srcStat) {
  if (!await fs.pathExists(filePath)) return false;
  const stat = await fs.stat(filePath);
  return stat.mtimeMs >= srcStat.mtimeMs;
}

async function run() {
  console.log('> Image optimization starting');
  if (!await fs.pathExists(srcDir)) {
    console.error(`Source directory not found: ${srcDir}`);
    console.error('Create it and place original full-resolution images inside.');
    process.exit(1);
  }
  await ensureDirStructure();
  const images = await collectImages(srcDir);
  if (!images.length) {
    console.log('No source images found. Place JPG/PNG files in public/images/original');
    return;
  }
  for (const img of images) {
    try {
      await optimizeOne(img);
    } catch (e) {
      console.error(`[error] Failed processing ${img}:`, e.message);
    }
  }
  console.log('> Done.');
  console.log(`Optimized outputs in: ${outDir}`);
  console.log('Suggested usage (background-image example):');
  console.log('background-image: image-set( \\n    url(/images/optimized/your-file-400.webp) 1x, \\n    url(/images/optimized/your-file-800.webp) 2x );');
}

run().catch(e => { console.error(e); process.exit(1); });
