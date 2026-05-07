---
title: "中英混排示例"
description: "演示 Inkstone 在中英混排场景下的排版细节。"
date: 2026-04-15
tags: ["cjk", "typography", "i18n"]
---

这是一篇用来演示 **中英混排** 排版细节的文章。Inkstone 主题对 CJK 内容做了几件事：

1. 自动开启 `hasCJKLanguage = true`，让 `.WordCount` 按字符数（而不是空白分隔的 token 数）计算
2. `.ReadingTime` 用 Hugo 的 CJK 常量 501 char/min（而不是 213 word/min）
3. 字体栈优先 `LXGW WenKai`，回落到 `Noto Serif SC` 与系统衬线字体
4. 行高为 1.7（而不是英文的 1.6），适配中文字符更高的 baseline

## 长段落示例

读到一篇好文章，往往是从某个准确的句子开始的。比如博尔赫斯写的「我的脚踩到了你正在踩着的影子」——这里包含了一种几乎没有重量的存在论。把这种存在论翻译成 English 是困难的，因为英语的语序天然倾向 SVO，而中文允许把「踩到了」这个动作压缩到主谓之间，让影子的"被踩"瞬间放大。

混排时常见的问题：英文单词与中文字符之间没有空格时，浏览器有时会粘连。Inkstone 在 prose 区域加了 `font-feature-settings: "palt"` 让标点收紧，并通过 `text-spacing-trim` 处理首尾空白。

## 引用

> 「书是人类进步的阶梯。」——高尔基

> "Reading furnishes the mind only with materials of knowledge; it is thinking that makes what we read ours." — John Locke

中英文引用混在同一篇文章里，typography 应该在两种风格之间无缝切换。

## 代码块

中文注释和英文代码混合：

```python
def calculate_reading_time(content: str, lang: str = "zh-cn") -> int:
    """
    根据语言计算阅读时间。
    Hugo 的 CJK 常量是 501 字符/分钟，英文是 213 词/分钟。
    """
    if lang.startswith("zh"):
        return max(1, len(content) // 501)
    else:
        return max(1, len(content.split()) // 213)
```

## 排版小细节

- **标点压缩**：句号、逗号、问号、感叹号在 CJK 区会自动收窄
- **数字与中文之间**：自动加 0.15em 间距（`Pangu` 风格，但只在 prose 区生效，不影响 UI）
- **首字下沉**：可选 `class="dropcap"` 给段落，但 demo 默认不开
- **斜体处理**：CJK 字体不支持斜体，主题在中文区域用 `font-style: normal` 回退，避免浏览器伪斜体

## 总结

如果你也写中英混排的长文，希望 Inkstone 的这些细节能让你少花一点心思在排版上，多花点在内容上。
