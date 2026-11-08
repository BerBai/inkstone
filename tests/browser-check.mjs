#!/usr/bin/env node

import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { statSync, createReadStream } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const dependencyRoot = process.argv[2];
const siteRoot = process.argv[3];
const basePath = process.argv[4] ?? '/blog/';
if (!dependencyRoot || !siteRoot) {
  console.error('usage: node browser-check.mjs <dependency-root> <site-root> [base-path]');
  process.exit(2);
}

const require = createRequire(`${dependencyRoot}/`);
const { chromium } = require('playwright-core');
const axeSource = await readFile(join(dependencyRoot, 'axe-core', 'axe.min.js'), 'utf8');
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
};

const server = createServer((request, response) => {
  try {
    let pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    if (basePath !== '/' && pathname.startsWith(basePath)) pathname = pathname.slice(basePath.length - 1);
    const safePath = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
    let filePath = join(siteRoot, safePath);
    if (statSync(filePath).isDirectory()) filePath = join(filePath, 'index.html');
    response.setHeader('Content-Type', mimeTypes[extname(filePath)] ?? 'application/octet-stream');
    createReadStream(filePath).pipe(response);
  } catch {
    response.statusCode = 404;
    response.end('not found');
  }
});

await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen));
const { port } = server.address();
const baseURL = `http://127.0.0.1:${port}${basePath}`;
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  channel: 'chrome',
});
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
const browserProblems = [];

page.on('pageerror', (error) => browserProblems.push(`pageerror: ${error.message}`));
page.on('console', (message) => {
  if (message.type() === 'error') browserProblems.push(`console: ${message.text()}`);
});

async function load(path) {
  await page.goto(new URL(path, baseURL).href, { waitUntil: 'networkidle' });
  await page.addScriptTag({ content: axeSource });
  const axeResult = await page.evaluate(() => window.axe.run(document, {
    resultTypes: ['violations'],
    withTags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
  }));
  for (const violation of axeResult.violations) {
    browserProblems.push(`axe ${path}: ${violation.id} (${violation.impact}) on ${violation.nodes.length} node(s)`);
  }
}

await load('');
await load('typography-prose/');
await load('zh-cn/');

await page.goto(baseURL, { waitUntil: 'networkidle' });

await page.keyboard.press('Tab');
const focusedText = await page.evaluate(() => document.activeElement?.textContent?.trim());
if (focusedText !== 'Skip to main content') browserProblems.push(`skip link not first focus: ${focusedText}`);

const initialTheme = await page.evaluate(() => document.documentElement.dataset.theme);
await page.locator('#theme-toggle').click({ force: true });
const changedTheme = await page.evaluate(() => document.documentElement.dataset.theme);
if (initialTheme === changedTheme) browserProblems.push(`dark mode toggle did not change theme: ${changedTheme}`);

const languageLink = page.locator('.language-switcher__link').first();
await languageLink.click({ force: true });
await page.waitForURL(/\/zh-cn\//);

await page.keyboard.press('ControlOrMeta+K');
await page.waitForSelector('#search-modal:not([hidden])');
const searchFocused = await page.evaluate(() => document.activeElement?.id);
if (searchFocused !== 'search-modal-title') browserProblems.push(`search input not focused: ${searchFocused}`);
for (let index = 0; index < 3; index += 1) await page.keyboard.press('Tab');
const focusInside = await page.evaluate(() => document.getElementById('search-modal').contains(document.activeElement));
if (!focusInside) browserProblems.push('search modal focus escaped');
await page.keyboard.press('Escape');
await page.waitForFunction(() => document.getElementById('search-modal').hidden === true);

await browser.close();
await new Promise((resolveClose) => server.close(resolveClose));

if (browserProblems.length) {
  console.error(`Browser validation failed (${browserProblems.length}):`);
  for (const problem of browserProblems) console.error(`- ${problem}`);
  process.exit(1);
}

console.log('Browser validation passed: axe, dark mode, language switch, search modal, focus trap');
