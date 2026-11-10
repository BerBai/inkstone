#!/usr/bin/env bash

set -euo pipefail

THEME_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK="$THEME_ROOT/tests/.work"
NODE_DIR="$WORK/validation-node"
CACHE_DIR="$WORK/cache"
HUGO_BIN="${HUGO_BIN:-hugo}"
HUGO_0_128_BIN="${HUGO_0_128_BIN:-$WORK/hugo-0.128/hugo}"
export HUGO_CACHEDIR="$CACHE_DIR"
export PATH="$THEME_ROOT/node_modules/.bin:$PATH"

mkdir -p "$WORK" "$CACHE_DIR"

if [[ ! -x "$HUGO_0_128_BIN" ]]; then
  echo "==> Downloading Hugo 0.128 for minimum-version validation"
  mkdir -p "$(dirname "$HUGO_0_128_BIN")"
  case "$(uname -s)-$(uname -m)" in
    Darwin-arm64) hugo_archive="hugo_extended_0.128.0_darwin-universal.tar.gz" ;;
    Darwin-x86_64) hugo_archive="hugo_extended_0.128.0_darwin-amd64.tar.gz" ;;
    Linux-x86_64) hugo_archive="hugo_extended_0.128.0_linux-amd64.tar.gz" ;;
    Linux-aarch64|Linux-arm64) hugo_archive="hugo_extended_0.128.0_linux-arm64.tar.gz" ;;
    *) echo "unsupported platform for automatic Hugo 0.128 download: $(uname -s)-$(uname -m)"; exit 1 ;;
  esac
  curl -fsSL --retry 2 \
    "https://github.com/gohugoio/hugo/releases/download/v0.128.0/$hugo_archive" \
    -o "$WORK/hugo-0.128.tar.gz"
  tar -xzf "$WORK/hugo-0.128.tar.gz" -C "$(dirname "$HUGO_0_128_BIN")" hugo
fi

if [[ ! -d "$NODE_DIR/node_modules" ]]; then
  echo "==> Installing temporary validation dependencies (not theme runtime deps)"
  mkdir -p "$NODE_DIR"
  npm_config_cache="${TMPDIR:-/tmp}/inkstone-npm-cache" \
    npm install --prefix "$NODE_DIR" --no-audit --no-fund \
    playwright-core@latest axe-core@latest html-validate@latest
fi

clean_build() {
  local source="$1"
  local destination="$2"
  local binary="$3"
  local base="$4"
  rm -rf "$destination"
  "$binary" --gc --minify -s "$source" --themesDir ../.. --baseURL "$base" --destination "$destination" --logLevel warn
}

fixture_build() {
  local fixture="$1"
  local destination="$2"
  local binary="$3"
  local config
  config="$(sed -n 's/^baseURL = "\(.*\)"$/\1/p' "$THEME_ROOT/tests/fixtures/$fixture/hugo.toml")"
  rm -rf "$destination"
  "$binary" --gc --minify -s "$THEME_ROOT/tests/fixtures/$fixture" \
    --themesDir "$THEME_ROOT/.." --theme inkstone \
    --baseURL "$config" --destination "$destination" --logLevel warn
}

echo "==> Building exampleSite on current Hugo ($("$HUGO_BIN" version | awk '{print $2}'))"
clean_build "$THEME_ROOT/exampleSite" "$WORK/example-current" "$HUGO_BIN" "https://example.com/blog/"

echo "==> Building exampleSite on minimum Hugo"
clean_build "$THEME_ROOT/exampleSite" "$WORK/example-min" "$HUGO_0_128_BIN" "https://example.com/blog/"

echo "==> Building key fixtures on both Hugo versions"
for fixture in en-only zh-only bilingual-subpath all-shortcodes; do
  fixture_build "$fixture" "$WORK/$fixture-current" "$HUGO_BIN"
  fixture_build "$fixture" "$WORK/$fixture-min" "$HUGO_0_128_BIN"
done

echo "==> Verifying generated HTML, links, CSS assets, RSS, and sitemaps"
node "$THEME_ROOT/tests/check-output.mjs" "$WORK/example-current" "https://example.com/blog/"
node "$THEME_ROOT/tests/check-output.mjs" "$WORK/example-min" "https://example.com/blog/"
for fixture in en-only zh-only bilingual-subpath all-shortcodes; do
  base="$(sed -n 's/^baseURL = "\(.*\)"$/\1/p' "$THEME_ROOT/tests/fixtures/$fixture/hugo.toml")"
  node "$THEME_ROOT/tests/check-output.mjs" "$WORK/$fixture-current" "$base"
  node "$THEME_ROOT/tests/check-output.mjs" "$WORK/$fixture-min" "$base"
done

echo "==> Validating HTML with html-validate"
node "$THEME_ROOT/tests/html-validate.mjs" "$NODE_DIR/node_modules" "$WORK/example-current"

echo "==> Asserting multilingual and subpath contracts"
EN_HOME="$WORK/bilingual-subpath-current/en/index.html"
ZH_HOME="$WORK/bilingual-subpath-current/zh-cn/index.html"
ONLY_EN="$WORK/bilingual-subpath-current/en/only-english/index.html"
ONLY_ZH="$WORK/bilingual-subpath-current/zh-cn/only-zh/index.html"
grep -q 'hreflang=.*en' "$EN_HOME"
grep -q 'hreflang=.*zh-cn' "$EN_HOME"
grep -q 'hreflang=.*x-default' "$EN_HOME"
grep -q 'href=.*/blog/zh-cn/' "$EN_HOME"
! grep -q 'hreflang=.*zh-cn' "$ONLY_EN"
grep -q 'hreflang=.*en' "$ONLY_EN"
grep -q 'href=.*/blog/zh-cn/only-zh/' "$ONLY_ZH"
grep -q '<html lang=zh-cn>' "$WORK/zh-only-current/index.html"
! grep -q 'language-switcher' "$WORK/en-only-current/index.html"

echo "==> Asserting all 27 shortcode contracts"
ALL_PAGE="$WORK/all-shortcodes-current/index.html"
for marker in \
  callout shortcode-admonition shortcode-flex shortcode-tab '<details' \
  highlight-wrapper shortcode-copy-to-clipboard shortcode-pseudocode shortcode-button \
  pullquote shortcode-figure shortcode-image-compare shortcode-gallery \
  video-js youtube.com/embed player.bilibili.com meting-js swiper mermaid \
  markmap antv-g2-container shortcode-douban-card wechat-qr shortcode-rating iframe; do
  grep -q "$marker" "$ALL_PAGE" || { echo "missing shortcode marker: $marker"; exit 1; }
done
grep -q 'HTML include fixture' "$ALL_PAGE"
grep -q 'Python include fixture' "$ALL_PAGE"

echo "==> Verifying malformed shortcode builds fail"
set +e
fixture_build malformed "$WORK/malformed-current" "$HUGO_BIN" >"$WORK/malformed.log" 2>&1
malformed_status=$?
set -e
if [[ "$malformed_status" -eq 0 ]]; then
  echo "malformed fixture unexpectedly passed"
  exit 1
fi
grep -q 'ERROR' "$WORK/malformed.log"

echo "==> Generating Pagefind index and running browser checks"
pagefind --site "$WORK/example-current"
node "$THEME_ROOT/tests/browser-check.mjs" "$NODE_DIR/node_modules" "$WORK/example-current" "/blog/"

echo "==> Checking first-load performance budget"
main_css="$(find "$WORK/example-current/css" -maxdepth 1 -name 'main.*.css' | head -1)"
core_js_bytes=0
for script in font-gate lightbox theme code-copy immersive toc search; do
  file="$(find "$WORK/example-current/js" -maxdepth 1 -name "$script.*.js" | head -1)"
  bytes="$(wc -c < "$file" | tr -d '[:space:]')"
  core_js_bytes=$((core_js_bytes + bytes))
done
font_bytes=0
for file in \
  "$WORK/example-current/fonts/noto-serif-sc-400-latin.woff2" \
  "$WORK/example-current/fonts/noto-serif-sc-400-cjk-common.woff2" \
  "$WORK/example-current/fonts/noto-serif-sc-600-latin.woff2" \
  "$WORK/example-current/fonts/noto-serif-sc-600-cjk-common.woff2"; do
  bytes="$(wc -c < "$file" | tr -d '[:space:]')"
  font_bytes=$((font_bytes + bytes))
done
html_bytes="$(wc -c < "$WORK/example-current/en/index.html" | tr -d '[:space:]')"
css_bytes="$(wc -c < "$main_css" | tr -d '[:space:]')"
[[ "$html_bytes" -le 100000 ]] || { echo "home HTML exceeds 100000 bytes: $html_bytes"; exit 1; }
[[ "$css_bytes" -le 100000 ]] || { echo "CSS exceeds 100000 bytes: $css_bytes"; exit 1; }
[[ "$core_js_bytes" -le 80000 ]] || { echo "core JS exceeds 80000 bytes: $core_js_bytes"; exit 1; }
[[ "$font_bytes" -le 1410000 ]] || { echo "preloaded fonts exceed 1410000 bytes: $font_bytes"; exit 1; }
echo "Performance budget passed: HTML=$html_bytes CSS=$css_bytes core JS=$core_js_bytes preloaded fonts=$font_bytes"

echo "==> Checking D2 font subsetting (needs python3 + fontTools + brotli)"
sum_fonts() { local t=0 f; for f in "$WORK/example-current/fonts/"*.woff2; do t=$((t + $(wc -c < "$f"))); done; echo "$t"; }
fonts_before="$(sum_fonts)"
node "$THEME_ROOT/scripts/subset-fonts.mjs" "$WORK/example-current"
fonts_after="$(sum_fonts)"
echo "fonts/ total: $fonts_before -> $fonts_after bytes"
if python3 -c 'import fontTools, brotli' 2>/dev/null; then
  [[ "$fonts_after" -lt "$fonts_before" ]] || { echo "subset step did not shrink fonts/ ($fonts_before -> $fonts_after)"; exit 1; }
  # every reference must still resolve
  missing="$(grep -rhoE 'fonts/[a-z0-9.-]+\.woff2' "$WORK/example-current" \
    --include='*.html' --include='*.css' --include='*.js' | sort -u \
    | while read -r ref; do [[ -f "$WORK/example-current/$ref" ]] || echo "$ref"; done)"
  [[ -z "$missing" ]] || { echo "dangling font refs: $missing"; exit 1; }
else
  echo "fontTools unavailable — subset step skipped (expected on machines without Python)"
fi

echo "ALL VALIDATION PASSED"
