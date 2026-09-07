import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { SHARE_CARDS } from './share-cards.mjs';

const digest = data => createHash('sha256').update(data).digest('hex');
const renderer = new URL('./render-share-cards.py', import.meta.url);
const recipe = digest(JSON.stringify(SHARE_CARDS) + await readFile(renderer, 'utf8'));
const manifestUrl = new URL('../public/social/manifest.json', import.meta.url);
if (!process.argv.includes('--check')) {
  const result = spawnSync('python3', [renderer.pathname], { input: JSON.stringify(SHARE_CARDS), encoding: 'utf8' });
  if (result.error || result.status !== 0) throw new Error(result.error?.message || result.stderr);
}
const images = {};
for (const card of SHARE_CARDS) {
  const bytes = await readFile(new URL(`../public/social/${card.key}.png`, import.meta.url));
  if (bytes.readUInt32BE(16) !== 1200 || bytes.readUInt32BE(20) !== 630) throw new Error(`Wrong share card dimensions: ${card.key}`);
  images[card.key] = digest(bytes);
}
const manifest = JSON.stringify({ recipe, images }, null, 2) + '\n';
if (process.argv.includes('--check')) {
  if (await readFile(manifestUrl, 'utf8') !== manifest) throw new Error('Share cards are stale. Run npm run build:share-cards.');
} else await writeFile(manifestUrl, manifest);
console.log(`Share cards: ${SHARE_CARDS.length} images, 1200 × 630, source and image hashes checked.`);
