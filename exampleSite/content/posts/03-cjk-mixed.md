---
title: "Mixing CJK and Latin Text"
description: "How Inkstone handles typography when Chinese, Japanese, or Korean text mixes with Latin scripts."
date: 2026-04-15
tags: ["cjk", "typography", "i18n"]
---

This post is the English companion to a real CJK demo. Inkstone is opinionated about mixed-script typography — here's what the theme does for you when an article mixes 中文 with English.

## What Inkstone does for CJK

1. **Word counting respects characters, not whitespace tokens.** With `hasCJKLanguage = true` set site-wide, Hugo's `.WordCount` counts CJK characters individually instead of trying (and failing) to whitespace-tokenize them.
2. **Reading time uses 501 chars/min on CJK pages**, the constant Hugo derives from CJK reading speed studies. Latin pages stay on the 213 word/min default.
3. **Font stack prefers `LXGW WenKai`**, falling back through `Noto Serif SC` to system serif — chosen to keep CJK and Latin glyphs at compatible weights.
4. **Line-height bumps to 1.7** on CJK pages (vs. 1.6 for pure Latin) to compensate for taller character bodies.

## Why this matters in practice

Mixed-script paragraphs are where naive themes break. A sentence like "我读了 Borges 的 *Ficciones*" has three writing systems and an italic stretch — and most themes either let the browser produce a fake oblique on CJK glyphs (ugly) or force a single font for everything (worse).

Inkstone scopes `font-style: normal` to the CJK-detected ranges in prose, so the Latin italics still render properly while the CJK characters stay upright in their natural form.

## Punctuation and spacing

The `.prose` region opts into:

- `font-feature-settings: "palt"` for proportional alternates on CJK punctuation — `，` `。` `？` `！` collapse the half-em "air" they ship with by default.
- `text-spacing-trim` to handle leading/trailing punctuation at line breaks.
- A 0.15em soft gap between CJK characters and adjacent Latin/numeric runs (Pangu-style), scoped to prose only — UI chrome is left alone.

## Try it on a real Chinese post

The translation of this post — `03-cjk-mixed.zh-cn.md` — is where you can actually see the typography work. Switch the language toggle to view it.

```text
content/posts/03-cjk-mixed.md         # this English post
content/posts/03-cjk-mixed.zh-cn.md   # the Chinese demo post
```

## Summary

If you write a lot of bilingual prose, Inkstone aims to remove the typography distractions so you can focus on what the words are doing. Most of these decisions are scoped to `.prose` and won't bleed into UI chrome, so they're safe to compose with other themes' design tokens if you fork.
