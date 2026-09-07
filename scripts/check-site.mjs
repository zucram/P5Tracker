import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { shareImageMeta } from './share-cards.mjs';

const root = path.resolve('dist');
const base = new URL('https://zucram.github.io/P5Tracker/');
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const titles = new Set();
const descriptions = new Set();
const errors = [];
const requireCheck = (ok, message) => { if (!ok) errors.push(message); };
const pages = new Map();
const fileFor = url => {
  const relative = decodeURIComponent(url.pathname.slice(base.pathname.length));
  return path.join(root, relative, url.pathname.endsWith('/') ? 'index.html' : '');
};
for (const href of urls) {
  const url = new URL(href);
  requireCheck(url.origin === base.origin && url.pathname.startsWith(base.pathname), `Sitemap URL outside site: ${href}`);
  const html = await readFile(fileFor(url), 'utf8');
  pages.set(href, html);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  requireCheck(title && !titles.has(title), `Missing or duplicate title: ${href}`);
  requireCheck(description && !descriptions.has(description), `Missing or duplicate description: ${href}`);
  titles.add(title); descriptions.add(description);
  requireCheck(html.includes(`<link rel="canonical" href="${href}"`), `Canonical mismatch: ${href}`);
  requireCheck(html.includes(shareImageMeta(href)), `Missing or stale share preview metadata: ${href}`);
  for (const property of ['og:title', 'og:description', 'og:url', 'og:image']) {
    requireCheck((html.match(new RegExp(`property="${property}"`, 'g')) || []).length === 1, `Expected one ${property}: ${href}`);
  }
  requireCheck((html.match(/name="twitter:card"/g) || []).length === 1, `Expected one Twitter card: ${href}`);
  const preview = new URL(html.match(/property="og:image" content="([^"]+)"/)?.[1] || href);
  requireCheck(preview.origin === base.origin && preview.pathname.startsWith(`${base.pathname}social/`), `Preview must be a public site image: ${href}`);
  const bytes = await readFile(fileFor(preview));
  requireCheck(bytes.readUInt32BE(16) === 1200 && bytes.readUInt32BE(20) === 630, `Wrong preview dimensions: ${href}`);
  requireCheck((html.match(/<h1(?:\s|>)/g) || []).length === 1, `Expected one HTML H1: ${href}`);
  requireCheck(!/<meta name="robots" content="[^"]*noindex/.test(html), `Noindex on sitemap page: ${href}`);
  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(json); } catch { errors.push(`Invalid structured data: ${href}`); }
  }
}
const incoming = new Map(urls.map(url => [url, 0]));
let links = 0;
for (const [href, html] of pages) {
  for (const [, attribute, value] of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
    const url = new URL(value.replace(/&amp;/g, '&'), href);
    if (url.origin !== base.origin) continue;
    requireCheck(url.pathname.startsWith(base.pathname), `Link escapes Pages base: ${href} -> ${value}`);
    if (!url.pathname.startsWith(base.pathname)) continue;
    links++;
    try { requireCheck((await stat(fileFor(url))).isFile(), `Not a file: ${value}`); }
    catch { errors.push(`Missing internal resource: ${href} -> ${value}`); }
    const target = `${url.origin}${url.pathname}`;
    if (attribute === 'href' && target !== href && incoming.has(target)) incoming.set(target, incoming.get(target) + 1);
    if (url.hash && url.pathname.includes('/guides/')) {
      const targetHtml = pages.get(target) || await readFile(fileFor(url), 'utf8');
      const id = decodeURIComponent(url.hash.slice(1));
      requireCheck(targetHtml.includes(`id="${id}"`), `Missing guide fragment: ${href} -> ${value}`);
    }
  }
}
for (const [url, count] of incoming) requireCheck(count > 0, `Orphan sitemap page: ${url}`);
requireCheck(new Set(urls).size === urls.length, 'Duplicate sitemap URLs');
if (errors.length) throw new Error(errors.join('\n'));
console.log(`Site checks passed: ${urls.length} sitemap pages, ${links} internal links/assets, unique metadata, share images, canonicals, H1s, structured data and guide fragments.`);
