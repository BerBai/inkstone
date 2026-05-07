---
title: "关于"
description: "关于 Inkstone 主题。"
date: 2026-05-06
---

## Inkstone 是什么

Inkstone 是一款为**长读**设计的极简 Hugo 主题——为那些值得慢慢读的文章而生。它对中英排版有自己的主张，自带 25+ 内容 shortcodes，覆盖图文、视频、图表、数学公式等富媒体场景。

## 设计原则

1. **内容优先** —— 每一个视觉决策都为阅读服务。没有过度动效、没有自动播放、没有弹窗。
2. **CJK 友好** —— 中英混排的文本会用合适的行高、按字符数计算阅读时间，字体回落链路也专门为大陆读者调过。
3. **双语开箱即用** —— `defaultContentLanguageInSubdir = false` 让默认语言落在根 URL，次语言走 `/zh-cn/`（或反过来）。翻译是数据模型的一部分，不是事后拼接。
4. **渐进增强** —— JS 是可选的。Pagefind 搜索、灯箱、主题切换都能在没有 JS 时优雅降级。

## 技术栈

- Hugo extended ≥ 0.128（用内建 `css.TailwindCSS`）
- Tailwind v4，使用 `@import "tailwindcss"` 与 `@theme` 设计 token
- 25+ 内容 shortcodes：admonition、画廊、视频、音频、代码块、数学公式、图表
- 可选 Pagefind 客户端搜索（主题提供 ⌘K modal，构建流水线里跑 `pagefind --site public` 即可）

## 快速开始

```bash
hugo new site mysite
cd mysite
git submodule add https://github.com/BerBai/inkstone themes/inkstone
echo 'theme = "inkstone"' >> hugo.toml
hugo server
```

完整安装步骤（含 i18n、taxonomy、shortcode 用法）见 [README](https://github.com/BerBai/inkstone/blob/main/README.md)。

## 致谢

- **霞鹜文楷（LXGW WenKai）** webfont —— © 林祥焜，OFL 协议
- **Noto Serif SC** webfont —— © Google，OFL 协议
- Heroicons / Phosphor 图标 —— MIT 协议
