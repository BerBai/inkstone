---
title: "Typography & Prose"
description: "Reading-optimized typography for longreads."
date: 2026-04-10
tags: ["typography", "design"]
---

Inkstone is built for **longreads**. This post showcases the prose typography rules that the theme applies to every article body.

## Headings

Body text uses a serif face chosen for long reading, with Chinese and Latin kept at a similar weight. Headings share the same family and can be restyled site-wide through the design variables.

### Third-level heading

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

#### Fourth-level heading

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Paragraph spacing

Line spacing is generous and paragraphs are clearly separated, so a long read doesn't tire the eyes. The text column stays narrow enough that the eye doesn't have to travel far across each line; on mobile it collapses to a single column.

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
