---
title: "Multilingual Content Authoring"
description: "How Inkstone handles bilingual content models."
date: 2026-04-20
tags: ["i18n", "tutorial"]
---

Inkstone uses Hugo's content language fallback model. The default site language lives at root URLs (`/posts/foo/`); secondary languages get a subdirectory (`/zh-cn/posts/foo/`).

## Filename convention

There are two ways to mark content language:

```text
content/posts/foo.md          # default language
content/posts/foo.zh-cn.md    # Chinese version
content/posts/foo.en.md       # explicit English (when default is zh-cn)
```

Or use directory layout:

```text
content/en/posts/foo.md
content/zh-cn/posts/foo.md
```

The theme works with either; pick the one that matches your editing flow.

## Language switcher

The header has a language toggle. It only appears for pages that have a translation. If a Chinese post has no English version, the toggle is hidden on the Chinese page — no broken links, no stub pages.

## i18n strings

UI strings live in `i18n/<lang>.toml`. The theme ships with `en.toml` and `zh-cn.toml`. To add a new language:

```bash
cp themes/inkstone/i18n/en.toml i18n/ja.toml
# Then translate the values inside
```

Add the language to your site config:

```toml
[languages.ja]
  label = "日本語"
  locale = "ja"
  weight = 3
  [languages.ja.params]
    description = "..."
```

## Reading time

Reading time is calculated per language using Hugo's `WordCount` and `ReadingTime`. With `hasCJKLanguage = true` set, CJK pages report 501 chars/minute; non-CJK pages report 213 words/minute. The theme reads the page's actual language and uses the right formula automatically.

{{< admonition type="warning" title="Don't override globally" >}}
Avoid setting `hasCJKLanguage` per-page or per-language — it's a site-wide flag. Setting it once at the top of `hugo.toml` is enough; Hugo handles the rest based on actual content.
{{< /admonition >}}

That's the multilingual model in a nutshell. For the underlying patterns, see Hugo's [language management docs](https://gohugo.io/content-management/multilingual/).
