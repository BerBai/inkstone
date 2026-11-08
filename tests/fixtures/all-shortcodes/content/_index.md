---
title: All Shortcodes
description: Build-time smoke coverage for every built-in shortcode.
---

{{< callout type="note" title="Callout" >}}Callout body.{{< /callout >}}

{{< admonition type="tip" title="Admonition" foldable=true >}}Admonition body.{{< /admonition >}}

{{< flex justify-content="space-between" >}}
  {{< flex-item >}}Left.{{< /flex-item >}}
  {{< flex-item >}}Right.{{< /flex-item >}}
{{< /flex >}}

{{< tab >}}
  {{% tab-item label="One" %}}First tab.{{% /tab-item %}}
  {{% tab-item label="Two" %}}Second tab.{{% /tab-item %}}
{{< /tab >}}

{{< details summary="Details" >}}Hidden detail.{{< /details >}}

{{< highlight lang="python" title="example.py" >}}
print("hello")
{{< /highlight >}}

{{< include "snippets/hello.html" >}}
{{< include-code file="snippets/hello.py" language="python" >}}

Copy: {{< copy-to-clipboard text="Copy" >}}fixture@example.com{{< /copy-to-clipboard >}}

{{< pseudocode >}}
\begin{algorithm}
\caption{Fixture}
\begin{algorithmic}
\RETURN true
\end{algorithmic}
\end{algorithm}
{{< /pseudocode >}}

{{< button href="/hello/" >}}Button{{< /button >}}

{{< pullquote author="Fixture" >}}A minimal quote.{{< /pullquote >}}

{{< figure src="/img/fixture.svg" alt="Fixture image" caption="A figure." >}}

{{< image-compare image-before="/img/before.svg" image-after="/img/after.svg" alt="Before and after images" >}}

{{< gallery data="/data/gallery.json" >}}

{{< video mp4="/media/fixture.mp4" poster="/img/fixture.svg" controls=true >}}

{{< youtube id="dQw4w9WgXcQ" >}}

{{< bilibili bvid="BV1xx411c7mD" >}}

{{< song id="447925558" >}}

{{< swiper data="data/gallery.json" >}}

```mermaid
flowchart LR
  A[Build] --> B[Test]
```

```markmap
# Fixture
## Shortcodes
- all
```

{{< antv-g2 script="charts/sample.js" caption="Chart fixture" >}}

{{< iframe src="https://example.com/embed/" ratio=0.5 >}}

{{< douban-card type="book" id="1084336" title="Fixture" rating="4.5" tags="fixture" summary="A fixture card." image="/img/fixture.svg" >}}

{{< wechat-qr name="Fixture" image="/img/fixture.svg" >}}

Rating: {{< rating value="4.5" >}}
