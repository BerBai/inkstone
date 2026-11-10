#!/usr/bin/env node

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { extname, join, relative, resolve, dirname } from 'node:path';

const [rawRoot, rawBaseURL] = process.argv.slice(2);
if (!rawRoot || !rawBaseURL) {
  console.error('usage: node check-output.mjs <site-root> <base-url>');
  process.exit(2);
}

const root = resolve(rawRoot);
const baseURL = new URL(rawBaseURL);
const basePath = baseURL.pathname.endsWith('/')
  ? baseURL.pathname
  : `${baseURL.pathname}/`;
const problems = [];
const htmlFiles = [];

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.isFile() && extname(path) === '.html') htmlFiles.push(path);
  }
}
walk(root);

function localPathsFromHTML(html) {
  // Hugo --minify strips attribute quotes, so accept quoted AND unquoted values.
  const attributes = [...html.matchAll(/\b(?:href|src)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g)]
    .map((match) => match[1] ?? match[2] ?? match[3]);
  return attributes;
}

function checkLocalPath(path, source) {
  if (path.startsWith('/')) {
    // Percent-encoded non-ASCII paths (/tags/%E5%B7%A5%E5%85%B7/) map to UTF-8
    // directory names on disk; decode before the existence check.
    let withoutBase = decodeURIComponent(path.replace(/[?#].*$/, ''));
    if (basePath !== '/' && withoutBase.startsWith(basePath)) {
      withoutBase = withoutBase.slice(basePath.length - 1);
    }
    const candidates = withoutBase.endsWith('/')
      ? [join(root, withoutBase, 'index.html')]
      : [join(root, withoutBase), join(root, withoutBase, 'index.html')];
    if (!candidates.some((candidate) => existsSync(candidate))) {
      problems.push(`missing ${path} (referenced by ${source})`);
    }
    return;
  }

  const resolved = resolve(dirname(source), decodeURIComponent(path));
  if (!resolved.startsWith(root)) {
    problems.push(`escaping local path ${path} in ${source}`);
  } else if (!existsSync(resolved)) {
    problems.push(`missing ${path} (referenced by ${source})`);
  }
}

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const source = relative(root, file);

  if (!/^<!doctype html>/i.test(html)) problems.push(`${source}: missing doctype`);
  if (!/<html\b[^>]*?lang=/i.test(html)) problems.push(`${source}: missing html lang`);
  if (!/<title>[^<]+<\/title>/i.test(html)) problems.push(`${source}: missing title`);
  if (!/<link[^>]+rel=["']?canonical["']?/i.test(html)) problems.push(`${source}: missing canonical`);

  for (const rawPath of localPathsFromHTML(html)) {
    if (/^(?:https?:|mailto:|tel:|data:|#)/i.test(rawPath)) continue;
    checkLocalPath(rawPath, source);
  }

}

for (const file of htmlFiles) {
  const relativeFile = relative(root, file);
  if (!relativeFile.includes(`${basePath}sitemap.xml`) && relativeFile !== 'sitemap.xml') continue;
  const xml = readFileSync(file, 'utf8');
  if (!/<(?:sitemapindex|urlset)[\s>]/.test(xml)) problems.push(`${relativeFile}: malformed sitemap`);
}

const rssFiles = htmlFiles.filter((file) => file.endsWith('.xml'));
for (const file of rssFiles) {
  if (!file.endsWith('index.xml')) continue;
  const xml = readFileSync(file, 'utf8');
  if (!/<rss[^>]+version=["']2\.0["']/.test(xml)) problems.push(`${relative(root, file)}: not RSS 2.0`);
  if (!/<channel>/.test(xml)) problems.push(`${relative(root, file)}: missing channel`);
}

const cssFiles = [];
function walkCSS(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) walkCSS(path);
    else if (entry.isFile() && extname(path) === '.css') cssFiles.push(path);
  }
}
walkCSS(root);

for (const file of cssFiles) {
  const css = readFileSync(file, 'utf8');
  for (const match of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
    const url = match[1];
    if (/^(?:https?:|data:|#)/i.test(url)) continue;
    const resolved = resolve(dirname(file), decodeURIComponent(url.replace(/[?#].*$/, '')));
    if (!existsSync(resolved)) problems.push(`${relative(root, file)}: missing CSS asset ${url}`);
  }
}

if (problems.length) {
  console.error(`Output validation failed (${problems.length}):`);
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}

console.log(`Output validation passed: ${htmlFiles.length} HTML files, ${cssFiles.length} CSS files`);
