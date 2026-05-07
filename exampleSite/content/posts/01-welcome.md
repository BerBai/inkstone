---
title: "Welcome to Inkstone"
description: "A quick tour of what the theme can do."
date: 2026-04-01
tags: ["intro", "tour"]
---

This is the first post in the Inkstone demo site. It exists to show off the theme's prose typography, callouts, and a handful of inline shortcodes.

## Why Inkstone?

Inkstone is built around three convictions:

1. **Reading is the primary mode.** Every layout decision serves the reader, not the author's ego.
2. **Bilingual is the default.** Mixed Chinese/English content gets proper line-height, character-counted reading time, and a font fallback chain that doesn't render Latin glyphs in a CJK font.
3. **Progressive enhancement is non-negotiable.** Search, lightbox, theme toggle all degrade gracefully when JS is disabled.

{{< callout type="note" title="Setup tip" >}}
The theme works out of the box with `hugo server`. Tailwind v4 is processed through Hugo's built-in `css.TailwindCSS` function — no separate npm watch step needed during development.
{{< /callout >}}

## Built-in shortcodes

Inkstone ships with 25+ content shortcodes. The most common ones:

- **Callouts and admonitions** — Five severity levels (note, tip, warning, danger, success) with i18n-aware labels
- **Galleries** — Justified grid + lightbox, configured via JSON data
- **Code blocks** — Highlighted with Chroma, with optional copy button and line numbers
- **Diagrams** — Mermaid and Markmap rendered client-side via CDN
- **Math** — MathJax v4, only loaded on pages that actually use math

For the full reference with live examples, see the [Shortcodes demo page](/shortcodes-demo/).

{{< admonition type="tip" title="Pagefind search" >}}
Press <kbd>⌘K</kbd> (or <kbd>Ctrl-K</kbd> on non-Mac) to open the search modal. The theme provides the UI; you wire up Pagefind in your build pipeline (`pagefind --site public` after `hugo`).
{{< /admonition >}}

## What's next

Browse the [Posts](/posts/) section for more samples, or jump directly to the [Shortcodes demo](/shortcodes-demo/) for the full reference.
