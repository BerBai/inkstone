---
title: "Typography & Prose"
description: "Reading-optimized typography for longreads."
date: 2026-04-10
tags: ["typography", "design"]
---

Inkstone is built for **longreads**. This post showcases the prose typography rules that the theme applies to every article body.

## Headings

The theme uses `LXGW WenKai` for body text in CJK contexts and falls back to `Noto Serif SC` and system serif fonts. Headings inherit the same family by default but can be re-styled per project via `assets/css/variable.css` design tokens.

### Third-level heading

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

#### Fourth-level heading

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Paragraph spacing

The default rhythm is 1.6× line-height with a comfortable max-width that keeps line length around 65–75 characters. This is tuned for desktop reading; on mobile the layout collapses to a single column with adjusted spacing.

For mixed CJK/Latin text, the theme bumps line-height slightly to accommodate the taller character box of Chinese glyphs without making English paragraphs feel airy.

## Lists

Unordered:

- First item with a meaningful sentence about something
- Second item that demonstrates how the bullet styling looks
- Third item just for completeness
  - Nested item one
  - Nested item two

Ordered:

1. Numbered items use a slightly different rhythm
2. The numbers themselves are styled to match the prose color
3. Nested ordered lists work too:
   1. Indented one
   2. Indented two

## Inline elements

Here's a sentence with `inline code`, **bold text**, *italic text*, and a [link to the source](https://github.com/BerBai/inkstone). The link gets an external-link mark automatically when it points off-domain.

## Blockquotes

> Reading is to the mind what exercise is to the body.
>
> — Joseph Addison

## Code blocks

```python
def fibonacci(n: int) -> int:
    """Classic recursive fib — please don't use this in production."""
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)


if __name__ == "__main__":
    print([fibonacci(i) for i in range(10)])
```

```javascript
const debounce = (fn, ms = 250) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};
```

## Tables

| Feature | Inkstone | PaperMod | Hugo Default |
|---|---|---|---|
| Bilingual i18n | ✅ | ✅ | ❌ |
| CJK reading time | ✅ | ❌ | ❌ |
| Built-in ⌘K search | ✅ | ❌ | ❌ |
| Tailwind v4 | ✅ | ❌ | ❌ |
| 25+ shortcodes | ✅ | ❌ | ❌ |

## Pullquote

{{< pullquote author="Italo Calvino" >}}
A classic is a book that has never finished saying what it has to say.
{{< /pullquote >}}

That's the gist. For a complete shortcode catalog, see the [Shortcodes demo](/shortcodes-demo/).
