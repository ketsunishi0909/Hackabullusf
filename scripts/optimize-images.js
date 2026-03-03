/*
  Usage:
    node scripts/optimize-images.js

  Notes:
    - Requires: npm i -D sharp
    - Reads images from ./images
    - Writes optimized variants to ./images/optimized
*/

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const INPUT_DIR = path.join(__dirname, '..', 'images');
const OUTPUT_DIR = path.join(INPUT_DIR, 'optimized');

const SIZES = [320, 480, 768, 1024, 1440, 1920];
const FORMAT_MAP = {
  jpg: [
    { ext: 'avif', options: { quality: 50 } },
    { ext: 'jpg', options: { quality: 80, mozjpeg: true } },
  ],
  jpeg: [
    { ext: 'avif', options: { quality: 50 } },
    { ext: 'jpg', options: { quality: 80, mozjpeg: true } },
  ],
  png: [
    { ext: 'avif', options: { quality: 50 } },
    { ext: 'jpg', options: { quality: 80, mozjpeg: true } },
  ],
};

const isImage = (file) => /\.(jpe?g|png)$/i.test(file);

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const getOutputName = (name, width, ext) => {
  const base = name.replace(/\.[^.]+$/, '');
  return `${base}-${width}.${ext}`;
};

const run = async () => {
  ensureDir(OUTPUT_DIR);

  const files = fs.readdirSync(INPUT_DIR).filter(isImage);
  if (!files.length) {
    console.log('No .jpg/.jpeg/.png files found in images/.');
    return;
  }

  for (const file of files) {
    const inputPath = path.join(INPUT_DIR, file);
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const maxWidth = metadata.width || 0;

    const ext = (path.extname(file).slice(1) || 'jpg').toLowerCase();
    const formats = FORMAT_MAP[ext] || FORMAT_MAP.jpg;

    for (const width of SIZES) {
      if (width > maxWidth) continue;
      for (const format of formats) {
        const outputName = getOutputName(file, width, format.ext);
        const outputPath = path.join(OUTPUT_DIR, outputName);

        await sharp(inputPath)
          .resize({ width, withoutEnlargement: true })
          .toFormat(format.ext, format.options)
          .toFile(outputPath);
      }
    }
  }

  console.log('Image optimization complete.');
  console.log('Outputs in images/optimized');
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
