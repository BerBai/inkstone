#!/usr/bin/env node
/**
 * D2 — shrink the shipped CJK webfonts to the glyphs the built site actually uses,
 * and content-address the result so long-lived caches stay correct.
 *
 *   node scripts/subset-fonts.mjs <public-dir> [--no-hash]
 *
 * Runs on the *output* tree only; static/fonts/ keeps the full faces.
 *
 *   1. Collect every character the built pages can render (HTML/XML/JSON text,
 *      minus script/style) plus a safety set: printable ASCII, CJK punctuation,
 *      fullwidth forms, common typographic symbols.
 *   2. pyftsubset each woff2 in fonts/ to that character set; skip a face if it
 *      did not get smaller. Faces left with no glyphs are dropped together with
 *      their @font-face block (the site never renders those code points).
 *   3. Rename every woff2 to <name>.<sha256-8>.woff2 and rewrite the references
 *      (`../fonts/x.woff2` in CSS, `/fonts/x.woff2` in HTML).
 *   4. Re-fingerprint css/main.<sha256>.css to match its new bytes and repoint
 *      the HTML at it — otherwise the CSS URL would be stale while its contents
 *      changed, and an `immutable` cache would serve font URLs that no longer exist.
 *   5. Delete unreferenced woff2 files left behind by earlier builds.
 *   6. Verify every font and stylesheet URL in the output resolves; exit 1 if not.
 *
 * Needs Python + fontTools + brotli. Without them the step is skipped with a
 * warning and the build still succeeds (full-size fonts, stable filenames).
 */
import { readdirSync, readFileSync, writeFileSync, statSync, renameSync, unlinkSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';

const publicDir = process.argv[2];
const useHash = !process.argv.includes('--no-hash');
if (!publicDir) { console.error('usage: subset-fonts.mjs <public-dir> [--no-hash]'); process.exit(2); }
const fontDir = join(publicDir, 'fonts');
const TEXT_EXT = ['.css', '.html', '.js', '.xml', '.json'];

const hasFontTools = spawnSync('python3', ['-c', 'import fontTools, brotli'], { stdio: 'ignore' }).status === 0;
if (!hasFontTools) {
  console.warn('[subset-fonts] fontTools/brotli not found (pip install fonttools brotli) — skipping D2.');
  process.exit(0);
}

function* walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}
const textFiles = () => [...walk(publicDir)].filter(f => TEXT_EXT.includes(extname(f)));
const sha8 = buf => createHash('sha256').update(buf).digest('hex').slice(0, 8);

/* ---------- 1. what characters can the site render? ---------- */
function decode(s) {
  return s
    .replace(/&nbsp;/g, ' ').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…').replace(/&middot;/g, '·').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, '&').replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)));
}

const chars = new Set();
let scanned = 0;
for (const f of walk(publicDir)) {
  if (!['.html', '.xml', '.json', '.txt'].includes(extname(f))) continue;
  scanned++;
  let s = readFileSync(f, 'utf8');
  s = s.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');
  s = decode(s.replace(/<[^>]+>/g, ' '));
  for (const ch of s) if (ch.codePointAt(0) >= 0x20) chars.add(ch);
}
for (let c = 0x20; c <= 0x7e; c++) chars.add(String.fromCodePoint(c));    // ASCII
for (let c = 0x3000; c <= 0x303f; c++) chars.add(String.fromCodePoint(c)); // CJK punctuation
for (let c = 0xff00; c <= 0xffef; c++) chars.add(String.fromCodePoint(c)); // full/halfwidth
for (const ch of '“”‘’«»—–…·•→←↑↓↵⌘×÷°±≈≤≥≠「」『』【】《》〈〉') chars.add(ch);

const charsFile = join(tmpdir(), `inkstone-subset-${process.pid}.txt`);
writeFileSync(charsFile, [...chars].join(''), 'utf8');
console.log(`[subset-fonts] ${chars.size} distinct chars from ${scanned} text files under ${publicDir}`);

/* ---------- 2. subset ---------- */
const targets = [
  /^noto-serif-sc-\d+-(latin|cjk-common|cjk-ext)\.woff2$/,
  /^lxgw-wenkai-lite-(latin|cjk-common|cjk-ext)\.woff2$/,
];

const rows = [];
for (const name of readdirSync(fontDir).sort()) {
  if (!name.endsWith('.woff2') || !targets.some(re => re.test(name))) continue;
  const src = join(fontDir, name);
  const dst = join(tmpdir(), `inkstone-${process.pid}-${name}`);
  const r = spawnSync('python3', ['-m', 'fontTools.subset', src,
    `--text-file=${charsFile}`, '--flavor=woff2',
    // Keep all OpenType layout features (palt/vert/...) and keep hinting:
    // measured cost is ~52 B per face and dropping hinting changes rasterization
    // on Windows for no meaningful byte win.
    '--layout-features=*', `--output-file=${dst}`], { stdio: 'ignore' });
  const ok = r.status === 0 && statSync(dst).size > 0;
  const srcBytes = statSync(src).size;
  const dstBytes = ok ? statSync(dst).size : Infinity;
  if (ok && dstBytes < srcBytes) {
    renameSync(dst, src);
    rows.push([name, srcBytes, dstBytes]);
  } else {
    if (ok) { try { unlinkSync(dst); } catch {} }
    rows.push([name, srcBytes, srcBytes]);
  }
}
try { unlinkSync(charsFile); } catch {}

/* ---------- 2b. drop faces the site never needs ---------- */
const glyphCounts = JSON.parse(spawnSync('python3', ['-c', `
import glob, json, sys
from fontTools.ttLib import TTFont
out = {}
for f in sorted(glob.glob(sys.argv[1] + '/*.woff2')):
    t = TTFont(f)
    cm = t.getBestCmap() or {}
    out[f.rsplit('/', 1)[-1]] = len(cm)
print(json.dumps(out))
`, fontDir], { encoding: 'utf8' }).stdout);

const dropped = [];
for (const [name, n] of Object.entries(glyphCounts)) {
  if (!targets.some(re => re.test(name)) || n > 1) continue;
  unlinkSync(join(fontDir, name));
  for (const f of textFiles()) {
    if (extname(f) !== '.css') continue;
    const s = readFileSync(f, 'utf8');
    // Blocks carry no nested braces, so this is unambiguous. Hugo strips the
    // section comments before we see the CSS, hence no comment handling here.
    const next = s.replace(/@font-face\s*\{[^{}]*\}/g,
      block => (block.includes(name) ? '' : block)).replace(/\n{3,}/g, '\n\n');
    if (next !== s) writeFileSync(f, next);
  }
  dropped.push(name);
}

/* ---------- 3. content-addressed font filenames ---------- */
const renames = new Map();
for (const name of readdirSync(fontDir).filter(n => n.endsWith('.woff2')).sort()) {
  const already = /\.[0-9a-f]{8}\.woff2$/.test(name);
  const next = useHash && !already
    ? `${name.replace(/\.woff2$/, '')}.${sha8(readFileSync(join(fontDir, name)))}.woff2` : name;
  if (next !== name) renameSync(join(fontDir, name), join(fontDir, next));
  renames.set(name, next);
}

/* ---------- 4. rewrite references ---------- */
const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let fontRefEdits = 0;
for (const f of textFiles()) {
  if (f.startsWith(fontDir + '/')) continue;
  let s = readFileSync(f, 'utf8');
  const orig = s;
  for (const [from, to] of renames) {
    if (from === to) continue;
    // Whole-filename matches only, so `x.abc12345.woff2` is never half-rewritten.
    s = s.replace(new RegExp(escapeRe(from) + '(?![\\w.-])', 'g'), to);
  }
  if (s !== orig) { writeFileSync(f, s); fontRefEdits++; }
}

/* ---------- 4b. re-fingerprint the stylesheet ---------- */
const cssRenames = new Map();
for (const f of readdirSync(join(publicDir, 'css'), { withFileTypes: true })) {
  if (!f.isFile() || !/^main\.[0-9a-f]{64}\.css$/.test(f.name)) continue;
  const path = join(publicDir, 'css', f.name);
  const wanted = `main.${createHash('sha256').update(readFileSync(path)).digest('hex')}.css`;
  if (wanted !== f.name) {
    renameSync(path, join(publicDir, 'css', wanted));
    cssRenames.set(f.name, wanted);
  }
}
let cssRefEdits = 0;
if (cssRenames.size) {
  for (const f of textFiles()) {
    if (f.startsWith(join(publicDir, 'css') + '/')) continue;
    let s = readFileSync(f, 'utf8');
    const orig = s;
    for (const [from, to] of cssRenames) s = s.split(from).join(to);
    if (s !== orig) { writeFileSync(f, s); cssRefEdits++; }
  }
}

/* ---------- 5. prune stale fonts, then verify ---------- */
const referrers = new Map();
for (const f of textFiles()) {
  const s = readFileSync(f, 'utf8');
  for (const m of s.matchAll(/fonts\/([\w.-]+\.woff2)/g)) {
    if (!referrers.has(m[1])) referrers.set(m[1], f.slice(publicDir.length + 1));
  }
}
let pruned = 0;
for (const name of readdirSync(fontDir)) {
  if (!name.endsWith('.woff2') || referrers.has(name)) continue;
  unlinkSync(join(fontDir, name));
  pruned++;
}
const missingFonts = [...referrers].filter(([n]) => !statSync(join(fontDir, n), { throwIfNoEntry: false }));

const cssRefs = new Set();
for (const f of textFiles()) {
  if (extname(f) !== '.html') continue;
  for (const m of readFileSync(f, 'utf8').matchAll(/css\/(main\.[0-9a-f]{64}\.css)/g)) cssRefs.add(m[1]);
}
// Stale stylesheets from earlier builds: Hugo never cleans its destination, and
// an unreferenced main.<hash>.css is pure cruft (and immune to cache busting).
let prunedCss = 0;
for (const f of readdirSync(join(publicDir, 'css'), { withFileTypes: true })) {
  if (!f.isFile() || !/^main\.[0-9a-f]{64}\.css$/.test(f.name) || cssRefs.has(f.name)) continue;
  unlinkSync(join(publicDir, 'css', f.name));
  prunedCss++;
}
const missingCss = [...cssRefs].filter(n => !statSync(join(publicDir, 'css', n), { throwIfNoEntry: false }));

/* ---------- report ---------- */
for (const [oldName, [a, b]] of rows.map(r => [r[0], [r[1], r[2]]])) {
  if (dropped.includes(oldName)) { console.log(`  ${oldName.padEnd(46)} ${String(a).padStart(8)} -> dropped (no glyphs used)`); continue; }
  const pct = a ? Math.round((1 - b / a) * 100) : 0;
  console.log(`  ${(renames.get(oldName) ?? oldName).padEnd(52)} ${String(a).padStart(8)} -> ${String(b).padStart(7)}  (-${pct}%)`);
}
const kept = rows.filter(r => !dropped.includes(r[0]));
const keptBytes = kept.reduce((t, r) => t + r[2], 0);
const allBefore = rows.reduce((t, r) => t + r[1], 0);
const pctSaved = allBefore ? Math.round((1 - keptBytes / allBefore) * 100) : 0;
console.log(`[subset-fonts] kept faces ${kept.reduce((t, r) => t + r[1], 0)} -> ${keptBytes} bytes; ` +
  `whole fonts/ dir ${allBefore} -> ${keptBytes} bytes ` +
  `(-${pctSaved}%), dropped ${dropped.length} unused face(s), ` +
  `rewrote ${fontRefEdits} ref file(s) + ${cssRefEdits} css link(s), pruned ${pruned} stale font(s), ${prunedCss} stale stylesheet(s)`);

if (missingFonts.length || missingCss.length) {
  console.error('[subset-fonts] BROKEN references:');
  for (const [n, where] of missingFonts) console.error(`  /fonts/${n}  <- ${where}`);
  for (const n of missingCss) console.error(`  /css/${n}  <- html`);
  process.exit(1);
}
console.log(`[subset-fonts] verified ${referrers.size} font refs and ${cssRefs.size} stylesheet ref(s) resolve`);
