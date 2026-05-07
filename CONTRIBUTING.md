# Contributing

> [中文](./CONTRIBUTING.md) · [English](./CONTRIBUTING.en.md)

欢迎 issue / PR。Inkstone 是个小项目，流程从简。

## 提 Issue

提 issue 前先搜索 [现有 issue](https://github.com/BerBai/inkstone/issues)，避免重复。

### Bug 报告

请包含：

- Hugo 版本（`hugo version`，确认是 extended）
- Inkstone 版本（tag / commit hash）
- Tailwind 安装路径（npm / standalone CLI）
- 复现步骤（最小 `hugo.toml` + 触发问题的内容片段）
- 期望行为 vs 实际行为
- 浏览器 + 版本（如果是前端渲染问题）

### Feature Request

请说明：

- 使用场景：你在写什么样的内容时需要这个？
- 替代方案：能否用现有 shortcode / CSS override 实现？为什么不够？
- API 草案：如果是新 shortcode，参数怎么传？

## 提 PR

### 前置

1. Fork → 在自己 fork 的 `main` 拉一个 feature 分支：`git checkout -b feat/short-description`
2. 改动尽量小、聚焦单一 topic；大重构请先开 issue 讨论
3. 保持双语同步：改动涉及 README / i18n / 文档时，CN + EN 一起改

### 本地验证

```bash
# 在 inkstone repo 根目录
hugo server -s exampleSite --themesDir ../..
# 浏览器开 http://localhost:1313
```

逐项确认：

- [ ] exampleSite 首页 + about + posts 列表正常渲染
- [ ] `/shortcodes-demo/` 页面所有 shortcode 渲染无报错
- [ ] 中英文切换 + 菜单链接正常
- [ ] 深色模式切换 + persistence 正常
- [ ] `⌘K` 搜索 modal 打开（搜索结果需要先 `npm run build` 跑 Pagefind）
- [ ] 浏览器 console 无 error

### Commit 规范

用 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/v1.0.0/)：

- `feat(shortcode): add image-compare slider variant`
- `fix(search): debounce input to avoid index thrash`
- `docs(readme): add Tailwind v4 standalone install path`
- `refactor(css): extract callout tokens to variable.css`
- `chore(deps): bump tailwindcss to 4.1.x`

主题相关 scope 建议：`shortcode` / `layout` / `css` / `i18n` / `search` / `build` / `docs` / `deps`。

### PR 描述

至少包含：

- **What**：改了什么
- **Why**：为什么改（关联 issue 编号）
- **Screenshot / GIF**：UI 变更必附（移动 + 桌面双 viewport）
- **Test plan**：上面的本地验证清单复制过来勾掉

### Review 节奏

- Maintainer 通常 3 天内回复
- 如果讨论后决定不合并，会说明原因
- 长期 stale 的 PR（30 天无作者回应）会被关闭，欢迎重新打开

## 本地开发环境

```bash
git clone https://github.com/BerBai/inkstone
cd inkstone

# 装 Tailwind（任选一种，详见 README.md「Tailwind v4 Setup」）
npm install -D tailwindcss @tailwindcss/cli
# 或下载 standalone CLI

# 跑 demo 站
hugo server -s exampleSite --themesDir ../..
```

## 代码风格

- HTML / Hugo 模板：2 空格缩进，`{{ }}` 内首尾各一空格
- CSS：Tailwind utility 优先；无法 utility 时写到 `assets/css/components/<name>.css` 并用 `@layer components`
- JS：原生 ES module，无打包；浏览器 baseline 见 README
- 文件命名：kebab-case，shortcode `assets/snippets/<name>.html` 与 `layouts/shortcodes/<name>.html` 同名

## 许可

提交 PR 即视为同意你的改动以 [MIT License](./LICENSE) 发布。
