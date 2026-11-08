# Inkstone stable contract

This document describes the interfaces site authors can rely on across patch and
minor releases. Anything not listed here is an implementation detail.

## Required configuration

- Hugo extended 0.128.0 or newer.
- A Tailwind CSS v4 CLI reachable by Hugo (normally installed in the site's
  `node_modules/.bin`).
- `baseURL` and site `title`.
- At least one language block. The language `description` is used by metadata and
  RSS; `tagline` is used in the sidebar/home page.
- `taxonomies.tag = "tags"` if tag UI is wanted.

The theme supplies build-time defaults for CDN-related `params`; a minimal site
does not need to duplicate them.

## Stable params

Site params:

- `author` — optional metadata and footer.
- `jsdelivrMirror` — optional CDN base.
- Version params listed in [`hugo.toml`](./hugo.toml): `g2Version`,
  `mathjaxVersion`, `mermaidVersion`, `markmapVersion`, `pseudocodeVersion`,
  `videojsVersion`, `swiperVersion`, `imageCompareViewerVersion`,
  `jQueryVersion`, `justifiedgalleryVersion`, `lightgalleryVersion`,
  `APlayerVersion`, `metingjsVersion`, `metingApi`, `clipboardjsVersion`,
  `tippyVersion`, and `popperVersion`.

Language params:

- `description` — recommended for metadata and RSS.
- `tagline` — optional sidebar/home description.
- `label` — optional language-switcher text; Hugo language name or code is used
  when absent.
- `ogLocale` — optional Open Graph locale; Hugo language code is the fallback.

## Stable layouts

Top-level page layouts are override points:

- `home.html`
- `404.html`
- `posts/single.html`
- `posts/list.html`
- `_default/single.html`
- `_default/list.html`
- `_default/archive.html`
- `_default/taxonomy.html`
- `_default/rss.xml`
- `tags/term.html`

The base template is `layouts/_default/baseof.html`. This is the Hugo-standard
location since 0.146. To upgrade from an old site that copied Inkstone's former
`layouts/baseof.html`, move that override to
`layouts/_default/baseof.html`.

## Stable partial override points

These partials may be replaced by a same-named file in the site:

- `partials/head.html`
- `partials/sidebar.html`
- `partials/footer.html`
- `partials/scripts.html`

An override replaces the whole file; it is not an append hook. If you replace
`head.html` or `scripts.html`, you must preserve the theme calls your layout
needs (CSS asset, favicon, metadata, dark-mode bootstrap, search, and shortcode
loading). Partial files not listed here may change without a major release.

## Stable shortcodes

The shortcode names below are stable:

`admonition`, `antv-g2`, `bilibili`, `button`, `callout`, `copy-to-clipboard`,
`details`, `douban-card`, `figure`, `flex`, `flex-item`, `gallery`, `highlight`,
`iframe`, `image-compare`, `include`, `include-code`, `pseudocode`, `pullquote`,
`rating`, `song`, `swiper`, `tab`, `tab-item`, `video`, `wechat-qr`, and
`youtube`.

Malformed inputs fail the build where unsafe output would otherwise be silent:

- `iframe` requires `src` and only accepts an `http(s)` URL.
- `antv-g2` requires `script`, and that file must exist.
- `image-compare` requires alternative text for each compared image.

These are build-time checks. They do not sanitize or guarantee the availability,
privacy policy, or CSP behavior of third-party resources.

## Stable CSS and behavior

Site authors may rely on:

- `.prose` for article typography.
- `shortcode-*` wrapper classes emitted by built-in shortcodes.
- `search-*`, `toc-*`, `language-switcher*`, and `theme-icon*` for built-in UI.
- `data-theme="light|dark"` on `<html>`.
- The `themechange` custom event with `detail.theme = "light|dark"`.
- The theme `localStorage` key `theme` (`light` or `dark`).

Internal class names, DOM nesting, asset fingerprints, and JS module APIs may
change. Do not target them from new code.

## Assets and i18n

- `assets/css/main.css` is the main theme entry. A site override replaces it;
  copy the theme file first if you only want to add tokens or rules.
- `static/favicon.svg`, `favicon-32.png`, `favicon-180.png`, and `fonts/` are
  public static assets.
- `i18n/en.toml` and `i18n/zh-cn.toml` are stable string catalogs. Keys are kept
  in lockstep. Missing translations in a new language fall back through Hugo's
  normal i18n behavior.
- `data/` files and files under `partials/shortcode_*.html` are internal.

## Upgrade notes

- Use `_default/baseof.html`, not `baseof.html`.
- Use relative URL configuration or any subpath baseURL; theme assets and links
  now use Hugo's `relURL`/`relLangURL` behavior.
- Minimum Hugo remains 0.128.0. Hugo 0.156+ uses `hugo.Sites`/`hugo.Data`; the
  theme branches for 0.128 compatibility.
- Run `npm test` before upgrading. The browser portion requires Chrome; set
  `CHROME_PATH` in CI if Chrome is not at the default location.
