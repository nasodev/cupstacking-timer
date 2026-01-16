import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

const svgPath = join(publicDir, 'icon.svg');

const sizes = [
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'pwa-192x192.png', size: 192 },
  { name: 'pwa-512x512.png', size: 512 },
];

async function generateIcons() {
  for (const { name, size } of sizes) {
    await sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(join(publicDir, name));
    console.log(`✅ Generated ${name}`);
  }

  // Generate favicon.ico (use 32x32 png as ico)
  await sharp(svgPath)
    .resize(32, 32)
    .toFormat('png')
    .toFile(join(publicDir, 'favicon.ico'));
  console.log('✅ Generated favicon.ico');
}

generateIcons().catch(console.error);
