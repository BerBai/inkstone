---
title: "排版与正文"
description: "为长读优化的正文排版。"
date: 2026-04-10
tags: ["typography", "design"]
---

Inkstone 是为**长读**做的主题。这篇文章展示主题应用到每一篇文章正文上的排版规则。

## 标题

CJK 场景下，正文用 `LXGW WenKai`，回落到 `Noto Serif SC` 与系统衬线字体。标题默认继承同一字族，但可以通过 `assets/css/variable.css` 里的设计 token 按项目重新调整。

### 三级标题

读到一篇好文章，往往是从准确的句子开始的。一段克制而精确的描述比花哨的修辞更接近写作的核心，长文的节奏也由这些细小的判断累积而成。

#### 四级标题

排版的目标不是让页面好看，而是让阅读不需要解释——读者翻开后立刻进入内容，意识不到字体、行高、间距的存在。

## 段间距

默认节奏是 1.6 倍行高，配合让一行 65–75 个字符的最大宽度。这是为桌面阅读调的；移动端会折叠为单列并调整间距。

中英混排的文本，主题会在原本基础上把行高再略微抬高，照顾中文字符更高的字身，同时不至于让纯英文段落显得过于稀松。

## 列表

无序列表：

- 第一项写一句有意义的话
- 第二项展示项目符号的视觉效果
- 第三项凑数
  - 嵌套项一
  - 嵌套项二

有序列表：

1. 数字列表用了略不同的节奏
2. 数字本身的颜色与正文风格一致
3. 嵌套有序列表也能正常工作：
   1. 缩进项一
   2. 缩进项二

## 行内元素

这一句里有 `行内代码`、**粗体**、*斜体*，以及一个 [指向源码的链接](https://github.com/BerBai/inkstone)。指向站外的链接会自动加上外链标记。

## 引用块

> 阅读对于头脑而言，正如锻炼之于身体。
>
> ——约瑟夫·艾迪生

## 代码块

```python
def fibonacci(n: int) -> int:
    """经典的递归 fib——请不要在生产环境这样写。"""
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

## 表格

| 特性 | Inkstone | PaperMod | Hugo 默认 |
|---|---|---|---|
| 双语 i18n | ✅ | ✅ | ❌ |
| CJK 阅读时间 | ✅ | ❌ | ❌ |
| 内置 ⌘K 搜索 | ✅ | ❌ | ❌ |
| Tailwind v4 | ✅ | ❌ | ❌ |
| 25+ shortcodes | ✅ | ❌ | ❌ |

## 引言（pullquote）

{{< pullquote author="伊塔洛·卡尔维诺" >}}
经典是这样一种作品——它永远没有把要说的话说完。
{{< /pullquote >}}

差不多就是这些。完整的 shortcode 目录见 [Shortcodes demo](/zh-cn/shortcodes-demo/)。
