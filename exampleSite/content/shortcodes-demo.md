---
title: "Shortcodes Reference"
description: "Live demo of every content shortcode shipped with Inkstone."
date: 2026-05-01
tags: ["reference", "shortcodes"]
toc: true
---

This page demonstrates every content shortcode that ships with Inkstone. Each section shows the source markdown and the rendered result. Use it as both a smoke test and a copy-paste reference.

For shortcodes that depend on external CDN libraries (mermaid, markmap, antv-g2, etc.), the loaders only inject when the page actually uses them — pages without the shortcode pay zero JS cost.

---

## Callouts & Admonitions

### `callout` — short colored note

Five severity levels with i18n-aware default titles.

```markdown
{{</* callout type="note" title="Heads up" */>}}
This is a note callout. Use it for tangential context.
{{</* /callout */>}}
```

{{< callout type="note" title="Heads up" >}}
This is a note callout. Use it for tangential context.
{{< /callout >}}

{{< callout type="tip" >}}
Tip callout (no explicit title — uses i18n default).
{{< /callout >}}

{{< callout type="warning" title="Backup first" >}}
Always run `git stash` before destructive operations.
{{< /callout >}}

### `admonition` — foldable longer block

Same severities as `callout` but with optional fold/unfold and an icon.

```markdown
{{</* admonition type="tip" title="Pro tip" foldable=true */>}}
Long-form callout content goes here. Useful when the
note itself contains multiple paragraphs or code blocks.
{{</* /admonition */>}}
```

{{< admonition type="tip" title="Pro tip" foldable=true >}}
Long-form callout content goes here. Useful when the note itself contains multiple paragraphs or code blocks. The `foldable=true` lets readers collapse it after reading.
{{< /admonition >}}

{{< admonition type="warning" title="Migration note" >}}
Inkstone 0.x → 1.x will be a breaking change for the design token API. Pin to `~0` until you've reviewed the migration guide.
{{< /admonition >}}

---

## Layout & Composition

### `flex` + `flex-item` — flexbox layout helper

Wrap children in a flex container with control over direction, gap, and alignment.

```markdown
{{</* flex justify-content="space-between" column-gap="24px" */>}}
  {{</* flex-item */>}}**Left** column content.{{</* /flex-item */>}}
  {{</* flex-item */>}}**Right** column content.{{</* /flex-item */>}}
{{</* /flex */>}}
```

{{< flex justify-content="space-between" column-gap="24px" >}}
  {{< flex-item >}}**Left** column content. Useful for side-by-side comparisons or "before/after" prose.{{< /flex-item >}}
  {{< flex-item >}}**Right** column content. The wrapper accepts standard flex properties.{{< /flex-item >}}
{{< /flex >}}

### `tab` + `tab-item` — tabbed content

```markdown
{{</* tab */>}}
  {{</* tab-item header="Python" */>}}
```python
print("hello")
```
  {{</* /tab-item */>}}
  {{</* tab-item header="JavaScript" */>}}
```javascript
console.log("hello");
```
  {{</* /tab-item */>}}
{{</* /tab */>}}
```

### `details` — collapsible disclosure

```markdown
{{</* details summary="Click to expand" */>}}
Hidden content goes here.
{{</* /details */>}}
```

{{< details summary="Click to expand" >}}
Hidden content goes here. Use it for long appendices, derivations, or "if you really want to know" sidebars.
{{< /details >}}

---

## Code & Text

### `highlight` — syntax-highlighted block with title

A wrapper around Chroma that adds an optional title bar.

```markdown
{{</* highlight lang="python" title="fibonacci.py" */>}}
def fib(n):
    return n if n < 2 else fib(n-1) + fib(n-2)
{{</* /highlight */>}}
```

### `include` — inline another file (raw HTML)

```markdown
{{</* include "snippets/hello.html" */>}}
```

{{< include "snippets/hello.html" >}}

### `include-code` — inline another file as a code block

```markdown
{{</* include-code file="snippets/hello.py" language="python" */>}}
```

{{< include-code file="snippets/hello.py" language="python" >}}

### `copy-to-clipboard` — inline copy button

```markdown
{{</* copy-to-clipboard text="user@example.com" */>}}
```

Email: {{< copy-to-clipboard text="user@example.com" />}}

### `pseudocode` — academic pseudocode rendering

Renders LaTeX-style algorithm pseudocode. Lazy-loads the renderer only on pages that use it.

```markdown
{{</* pseudocode */>}}
\begin{algorithm}
\caption{Binary Search}
\begin{algorithmic}
\REQUIRE sorted array $A$, target $t$
\STATE $\ell \gets 0$, $r \gets |A| - 1$
\WHILE{$\ell \leq r$}
  \STATE $m \gets \lfloor (\ell + r) / 2 \rfloor$
  \IF{$A[m] = t$} \RETURN $m$ \ENDIF
  \IF{$A[m] < t$} \STATE $\ell \gets m + 1$
  \ELSE \STATE $r \gets m - 1$
  \ENDIF
\ENDWHILE
\RETURN $-1$
\end{algorithmic}
\end{algorithm}
{{</* /pseudocode */>}}
```

### `button` — styled link as button

```markdown
{{</* button href="https://github.com/BerBai/inkstone" target="_blank" */>}}View on GitHub{{</* /button */>}}
```

{{< button href="https://github.com/BerBai/inkstone" target="_blank" >}}View on GitHub{{< /button >}}

### `pullquote` — large emphasized quote

```markdown
{{</* pullquote author="Italo Calvino" */>}}
A classic is a book that has never finished saying what it has to say.
{{</* /pullquote */>}}
```

{{< pullquote author="Italo Calvino" >}}
A classic is a book that has never finished saying what it has to say.
{{< /pullquote >}}

---

## Media

### `figure` — captioned image

```markdown
{{</* figure src="https://placehold.co/1200x600/orange/white?text=Inkstone" alt="Demo image" caption="A captioned figure with alt text." */>}}
```

{{< figure src="https://placehold.co/1200x600/orange/white?text=Inkstone" alt="Demo image" caption="A captioned figure with alt text." >}}

### `image-compare` — before/after slider

```markdown
{{</* image-compare before="/test/before.jpg" after="/test/after.jpg" */>}}
```

{{< image-compare before="/test/before.jpg" after="/test/after.jpg" >}}

### `gallery` — justified grid + lightbox

Driven by a JSON data file. The fixture below lives at `static/data/smoke/gallery.json`.

```markdown
{{</* gallery data="data/smoke/gallery.json" */>}}
```

{{< gallery data="data/smoke/gallery.json" >}}

### `video` — self-hosted MP4/WebM

```markdown
{{</* video mp4="https://example.com/demo.mp4" controls=true */>}}
```

> Skipped here because `exampleSite/` ships with no MP4 fixture. See the source code at `layouts/shortcodes/video.html` for the full parameter list.

### `youtube` — YouTube embed

```markdown
{{</* youtube id="dQw4w9WgXcQ" */>}}
```

{{< youtube id="dQw4w9WgXcQ" >}}

### `bilibili` — Bilibili embed

```markdown
{{</* bilibili bvid="BV1xx411c7mD" */>}}
```

> Live render skipped to avoid loading external iframes during the demo build. The shortcode accepts `bvid` (preferred) or `aid`.

### `song` — NetEase Music single-track player

```markdown
{{</* song id="447925558" */>}}
```

> Live render skipped (CDN dependency). The shortcode accepts NetEase track IDs via `id`.

### `swiper` — JSON-driven carousel

```markdown
{{</* swiper data="data/smoke/swiper.json" */>}}
```

> No fixture shipped in `exampleSite/`. See `layouts/shortcodes/swiper.html` for the schema.

---

## Diagrams & Math

### Mermaid diagrams (via fenced codeblock)

````markdown
```mermaid
flowchart LR
  A[hugo build] --> B{has tag?}
  B -->|yes| C[use latest tag]
  B -->|no| D[use latest commit]
  C --> E[deploy preview]
  D --> E
```
````

```mermaid
flowchart LR
  A[hugo build] --> B{has tag?}
  B -->|yes| C[use latest tag]
  B -->|no| D[use latest commit]
  C --> E[deploy preview]
  D --> E
```

### Markmap mind maps (via fenced codeblock)

````markdown
```markmap
# Inkstone
## Layouts
- baseof
- single
- list
## Shortcodes
- callout
- admonition
- gallery
```
````

```markmap
# Inkstone
## Layouts
- baseof
- single
- list
## Shortcodes
- callout
- admonition
- gallery
```

### `antv-g2` — declarative chart

```markdown
{{</* antv-g2 script="data/charts/sample.js" caption="A sample chart" */>}}
```

> No script fixture shipped. The shortcode loads `@antv/g2` from CDN and runs your chart spec from the given resource path. See `static/data/smoke/` patterns to provide your own.

### Math (MathJax v4)

Inline: $E = mc^2$.

Block:

$$
\frac{\partial}{\partial t} \rho + \nabla \cdot (\rho \mathbf{v}) = 0
$$

The MathJax CDN is only injected on pages that contain math delimiters — pages without math pay zero cost.

---

## External & Embeds

### `iframe` — embed external content with theme bridge

The theme passes a `theme=light|dark` query param to known hosts (codepen.io, codesandbox.io, stackblitz.com, replit.com), so embedded content matches the site's current theme.

```markdown
{{</* iframe src="https://codepen.io/team/codepen/embed/PNaGbb" ratio=0.6 */>}}
```

> Live render skipped to keep this demo offline-friendly. The bridge whitelist lives at `data/iframe_theme_hosts.toml`.

### `douban-card` — Douban book/movie card

```markdown
{{</* douban-card type="book" id="1084336" */>}}
```

> Requires Douban API access. The shortcode renders a card linking back to Douban.

### `wechat-qr` — WeChat OA QR popover

```markdown
{{</* wechat-qr name="My OA" image="/img/wechat-qr.png" */>}}
```

Hover or focus this element to see a QR code popover: {{< wechat-qr name="Demo OA" image="/img/wechat-qr.png" >}}

---

## Summary

That's the full shortcode catalog as of the current release. For production usage:

- **Always pass `alt`** on `figure`, `image-compare`, and `gallery` for a11y
- **Don't autoplay video** unless you're embedding a silent looping clip — Inkstone defaults `autoplay=false`
- **Lazy-loaded shortcodes** (mermaid, markmap, antv-g2, mathjax, pseudocode, swiper, song) only fetch their CDN libs when the shortcode is actually present on the page

Issues or feature requests: [github.com/BerBai/inkstone/issues](https://github.com/BerBai/inkstone/issues).
