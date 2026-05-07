---
title: "欢迎使用 Inkstone"
description: "主题能力的快速一览。"
date: 2026-04-01
tags: ["intro", "tour"]
---

这是 Inkstone demo 站的第一篇文章，目的是展示主题的正文排版、Callout，以及一些常用 shortcode。

## 为什么是 Inkstone？

Inkstone 围绕三条信念构建：

1. **阅读是首要场景。** 每一个布局决策都为读者服务，不是作者的自我表达。
2. **双语是默认而非附加。** 中英混排的内容会得到合适的行高、按字符数计算的阅读时间，以及不会用 CJK 字体渲染拉丁字符的字体回落链。
3. **渐进增强是底线。** 搜索、灯箱、主题切换在禁用 JS 的环境下都能优雅降级。

{{< callout type="note" title="安装小贴士" >}}
主题用 `hugo server` 即可开箱跑起来。Tailwind v4 走 Hugo 内建的 `css.TailwindCSS`——开发期间不需要单独跑 npm watch。
{{< /callout >}}

## 内置 shortcodes

Inkstone 自带 25+ 内容 shortcodes，最常用的有：

- **Callout 与 Admonition** —— 五个严重程度（note、tip、warning、danger、success），标签会自动按 i18n 切换
- **画廊** —— 等高网格 + 灯箱，由 JSON 数据驱动
- **代码块** —— 用 Chroma 高亮，可选复制按钮和行号
- **图表** —— Mermaid、Markmap，按需通过 CDN 客户端渲染
- **数学公式** —— MathJax v4，只在用到的页面才加载

完整的 shortcode 参考与实时示例见 [Shortcodes demo 页面](/zh-cn/shortcodes-demo/)。

{{< admonition type="tip" title="Pagefind 搜索" >}}
按 <kbd>⌘K</kbd>（非 macOS 系统是 <kbd>Ctrl-K</kbd>）打开搜索 modal。主题提供 UI，你在自己的构建流水线里串上 Pagefind（`hugo` 之后跑 `pagefind --site public`）即可。
{{< /admonition >}}

## 接下来

去 [文章](/zh-cn/posts/) 区看更多示例，或直接跳到 [Shortcodes demo](/zh-cn/shortcodes-demo/) 查阅完整参考。
