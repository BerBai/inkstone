# Inkstone

> A minimal bilingual Hugo theme for longreads. Tailwind v4, CJK-native, 25+ content shortcodes.
> [中文](./README.md) · [English](./README.en.md)

![Inkstone screenshot](https://raw.githubusercontent.com/BerBai/inkstone/main/images/screenshot.png)

**Inkstone** is a minimal Hugo theme built for **longreads** — articles that reward slow reading. It ships with bilingual i18n, 25+ content shortcodes, and careful CJK typography out of the box.

- 🌐 **Bilingual i18n** — English / 中文 UI strings shipped; extensible to any language
- 📐 **CJK typography** — Auto-detects Chinese, character-based reading time, line-height tuned for mixed scripts
- 🧩 **25+ shortcodes** — admonition, callout, gallery, video, tab, mermaid, markmap, math, more
- 🎨 **Tailwind v4** — Uses Hugo 0.128+ built-in `css.TailwindCSS`, no separate build step needed
- 🔍 **Pagefind search** — Built-in `⌘K` modal; index opt-in via your build pipeline
- 🌓 **Dark mode** — Respects `prefers-color-scheme`, toggle persists to `localStorage`

## Quick Start

### Option 1: git submodule (recommended)

```bash
hugo new site mysite
cd mysite
git init
git submodule add https://github.com/BerBai/inkstone themes/inkstone
echo 'theme = "inkstone"' >> hugo.toml
hugo server
```

### Option 2: Hugo Modules

```bash
hugo new site mysite
cd mysite
hugo mod init github.com/<you>/mysite
```

In `hugo.toml` add:

```toml
[module]
  [[module.imports]]
    path = "github.com/BerBai/inkstone"
```

Then:

```bash
hugo mod get github.com/BerBai/inkstone@latest
hugo server
```

### Option 3: direct clone (not recommended for production)

```bash
git clone https://github.com/BerBai/inkstone themes/inkstone
echo 'theme = "inkstone"' >> hugo.toml
hugo server
```

## Requirements

- **Hugo extended ≥ 0.128** (for `css.TailwindCSS`)
- **Tailwind v4 CLI** (pick one):
  - `npm install -D tailwindcss @tailwindcss/cli`, Hugo invokes from `node_modules/.bin/tailwindcss`
  - Or install [tailwindlabs/tailwindcss standalone CLI](https://github.com/tailwindlabs/tailwindcss/releases) and put it on `PATH`
- **Node.js** (only if installing Tailwind via npm; standalone CLI needs no Node)
- **Pagefind** (optional, only for search): `npm install -D pagefind`, then `pagefind --site public` after `hugo`

## Configuration

Minimal `hugo.toml`:

```toml
baseURL = "https://example.com/"
title = "My Site"
theme = "inkstone"
defaultContentLanguage = "en"
defaultContentLanguageInSubdir = false
hasCJKLanguage = true   # only if your content contains CJK

[languages.en]
  weight = 1
  [languages.en.params]
    description = "Site description"
    tagline = "Site tagline"

[taxonomies]
  tag = "tags"

[params]
  author = "Your Name"
  jsdelivrMirror = "https://cdn.jsdmirror.com"   # CDN prefix (cn-friendly)
```

Full example: [`exampleSite/hugo.toml`](./exampleSite/hugo.toml).

### Multilingual

```toml
[languages.en]
  label = "English"
  locale = "en"
  weight = 1
[languages.zh-cn]
  label = "中文"
  locale = "zh-cn"
  weight = 2
```

UI strings live in `themes/inkstone/i18n/en.toml` and `zh-cn.toml`. To add a language, copy a file and translate the values.

### Shortcode CDN versions

Library versions used by integration shortcodes are configured under `[params]`:

```toml
[params]
  jsdelivrMirror   = "https://cdn.jsdmirror.com"
  g2Version        = "5.4.8"
  mathjaxVersion   = "4"
  mermaidVersion   = "11.14.0"
  markmapVersion   = "0.18.12"
  videojsVersion   = "8.10.0"
  swiperVersion    = "11.1.4"
  # Full list: see exampleSite/hugo.toml
```

## Shortcodes

The theme ships with 25+ content shortcodes. Full demo and parameter reference: [`exampleSite/content/shortcodes-demo.md`](./exampleSite/content/shortcodes-demo.md) (after starting the demo, visit `/shortcodes-demo/`).

By category:

- **Callouts**: `callout`, `admonition`
- **Layout**: `flex`, `flex-item`, `tab`, `tab-item`, `details`
- **Code & Text**: `highlight`, `include`, `include-code`, `copy-to-clipboard`, `pseudocode`, `button`, `pullquote`
- **Media**: `figure`, `image-compare`, `gallery`, `video`, `youtube`, `bilibili`, `song`, `swiper`
- **Diagrams**: `antv-g2` (mermaid / markmap auto-detected from fenced codeblocks)
- **External**: `iframe` (with theme bridge), `douban-card`, `wechat-qr`

## Customization

### Design tokens

Colors, spacing, font sizes, font stacks are declared in `assets/css/variable.css` using Tailwind v4's `@theme` block. To override, in your site's `assets/css/main.css`:

```css
@theme {
  --color-accent: #your-color;
  --font-family-prose: "Your Serif", "LXGW WenKai", serif;
}
```

### Override partials / shortcodes

Hugo's theme inheritance: drop a file with the same name into your site's `layouts/partials/` or `layouts/shortcodes/` to override the theme's version. Example custom footer:

```html
<!-- layouts/partials/footer.html -->
<footer class="footer">
  <p>© {{ now.Format "2006" }} {{ .Site.Params.author }}. Custom footer here.</p>
</footer>
```

## Enabling Pagefind search

The theme bundles the `⌘K` modal UI. The search index is generated by Pagefind after Hugo builds:

```bash
npm install -D pagefind
# package.json scripts:
#   "build": "hugo --gc --minify && pagefind --site public"
```

`assets/js/search.js` automatically loads from `public/pagefind/`.

## Browser support

Tailwind v4 baseline:

- Chrome/Edge ≥ 120
- Safari ≥ 16.4
- Firefox ≥ 121

No IE 11 / legacy Android Browser support.

## License

MIT — see [LICENSE](./LICENSE).

## Credits

- [LXGW WenKai](https://github.com/lxgw/LxgwWenKai) — © Lin Xiang Wei, OFL 1.1
- [Noto Serif SC](https://github.com/notofonts/noto-cjk) — © Google, OFL 1.1
- [Heroicons](https://heroicons.com/) / [Phosphor](https://phosphoricons.com/) — MIT

## Issues / Contributions

Issues or PRs welcome at [github.com/BerBai/inkstone](https://github.com/BerBai/inkstone).

## Author

[Jason](https://github.com/BerBai)
