---
title: "多语言写作"
description: "Inkstone 如何处理双语内容模型。"
date: 2026-04-20
tags: ["i18n", "tutorial"]
---

Inkstone 用的是 Hugo 的内容语言回落模型。默认语言走根 URL（`/posts/foo/`），其他语言走子目录（`/zh-cn/posts/foo/`）。

## 文件名约定

标记内容语言有两种方式：

```text
content/posts/foo.md          # 默认语言
content/posts/foo.zh-cn.md    # 中文版本
content/posts/foo.en.md       # 默认是 zh-cn 时显式标注英文
```

或者用目录划分：

```text
content/en/posts/foo.md
content/zh-cn/posts/foo.md
```

主题对两种都兼容，按你的写作流程选一个即可。

## 语言切换

页眉有一个语言切换按钮。当前页有翻译时，按钮指向对应语言的同一篇；没有翻译时回退到目标语言的首页——不会出现死链或占位页。

## i18n 字符串

UI 字符串放在 `i18n/<lang>.toml`。主题自带 `en.toml` 和 `zh-cn.toml`。要新增一种语言：

```bash
cp themes/inkstone/i18n/en.toml i18n/ja.toml
# 然后翻译里面的值
```

在站点配置里加上这一语言：

```toml
[languages.ja]
  label = "日本語"
  locale = "ja"
  weight = 3
  [languages.ja.params]
    description = "..."
```

## 阅读时间

阅读时间按页面的实际语言计算，用 Hugo 的 `WordCount` 与 `ReadingTime`。设了 `hasCJKLanguage = true` 之后，CJK 页面按 501 字符/分钟报，非 CJK 页面按 213 词/分钟报。主题读取页面真实语言并自动选公式。

{{< admonition type="warning" title="不要按页/按语言覆盖" >}}
不要在单篇或某语言下覆盖 `hasCJKLanguage`——它是站点级开关。`hugo.toml` 顶部设一次就够了，剩下的由 Hugo 按内容自动处理。
{{< /admonition >}}

这就是多语言模型的全部要点。底层模式见 Hugo 的 [language management 文档](https://gohugo.io/content-management/multilingual/)。
