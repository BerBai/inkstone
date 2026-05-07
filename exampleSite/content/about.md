---
title: "About"
description: "About the Inkstone theme."
date: 2026-05-06
---

## What is Inkstone?

Inkstone is a minimal Hugo theme built for **longreads** — articles that reward slow reading. It is opinionated about CJK typography and ships with 25+ content shortcodes for embedding rich media.

## Design principles

1. **Content first** — Every visual decision serves reading. No animation theatrics, no autoplay, no popups.
2. **CJK-native** — Mixed Chinese/English text gets proper line-height, character-based reading time, and font fallback chains tuned for mainland readers.
3. **Bilingual by default** — `defaultContentLanguageInSubdir = false` keeps the primary language at root URLs; secondary languages get `/en/` (or vice versa). Translation is built into the data model, not bolted on.
4. **Progressive enhancement** — JS is optional. Pagefind search, lightbox, theme toggle all degrade gracefully.

## Tech stack

- Hugo extended ≥ 0.128 (uses built-in `css.TailwindCSS`)
- Tailwind v4 with `@import "tailwindcss"` and `@theme` design tokens
- 25+ content shortcodes covering admonitions, galleries, video, audio, code blocks, math, diagrams
- Optional Pagefind for client-side search (theme provides ⌘K modal; you wire up `pagefind --site public` in your build)

## Quick start

```bash
hugo new site mysite
cd mysite
git submodule add https://github.com/BerBai/inkstone themes/inkstone
echo 'theme = "inkstone"' >> hugo.toml
hugo server
```

For full setup including i18n, taxonomies, and shortcode usage, see the [README](https://github.com/BerBai/inkstone/blob/main/README.md).

## Credits

- **LXGW WenKai** webfont — © Lin Xiang Wei, OFL license
- **Noto Serif SC** webfont — © Google, OFL license
- Heroicons / Phosphor icons — MIT license
