// Create WebP versions of the site's design images (hero banners) for phones and desktops.
// Run after adding or replacing a banner (output is committed; the Docker build doesn't need sharp):
//   docker run --rm -v "$PWD":/app -w /app node:22 sh -c "npm i --no-save sharp && node scripts/optimize-images.mjs"
import { access, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const DIRS = ['public/images/hero', 'public/images/home'];
// 828: phones (412 px screens at 2x); keep in step with DESIGN_WIDTHS in src/lib/images.js
const WIDTHS = [828, 1280, 2048];
const QUALITY = 78;

let made = 0;
for (const dir of DIRS) {
  for (const file of await readdir(dir)) {
    if (!/\.jpe?g$/i.test(file)) continue;
    const src = path.join(dir, file);
    const base = src.replace(/\.jpe?g$/i, '');
    const { width } = await sharp(src).metadata();
    for (const w of WIDTHS) {
      const out = `${base}-${w}.webp`;
      if (await access(out).then(() => true, () => false)) continue; // already made
      // Never upscale: a 1600 px original gives a 1600 px "2048" file
      const info = await sharp(src).resize({ width: Math.min(w, width), withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(out);
      console.log(`${path.basename(out)}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
      made += 1;
    }
  }
}
console.log(`${made} WebP files written`);
