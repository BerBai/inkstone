# Releasing

> [中文](./RELEASING.md) · [English](./RELEASING.en.md)

发版流程。Inkstone 走 [SemVer](https://semver.org/lang/zh-CN/)，标签前缀 `v`（如 `v0.1.0`）。

## 版本号约定

- **MAJOR**（`v1.0.0` → `v2.0.0`）：破坏性变更。partial / shortcode 接口删除或不向后兼容、`hugo.toml` 必填配置项变化、CSS 变量删除。
- **MINOR**（`v0.1.0` → `v0.2.0`）：向后兼容的新增。新 shortcode、新 i18n 字符串、新 `[params]` 选项、新 layout block。
- **PATCH**（`v0.1.0` → `v0.1.1`）：bug 修复、文档更新、依赖升级（不改公共接口）。

`0.x` 阶段允许在 MINOR 内做小破坏（Hugo 主题生态惯例），但需在 release note 顶部用 ⚠️ 醒目标注。

## 发版前检查清单

- [ ] `exampleSite/` 在 basic Hugo（无 npm/Pagefind）下 `hugo server -s exampleSite --themesDir ../..` 能起，shortcode-demo 页所有 shortcode 渲染正常
- [ ] `theme.toml` 的 `min_version` 与 `hugo.toml` 的 `[module.hugoVersion].min` 一致
- [ ] `images/screenshot.png`（≥1500×1000，3:2）+ `images/tn.png`（≥900×600，3:2）尺寸校验通过
- [ ] README.md / README.en.md 双语同步、所有图片用 `https://raw.githubusercontent.com/BerBai/inkstone/main/...` 绝对路径
- [ ] 破坏性变更已在 release note 顶部 ⚠️ 标注 + 提供 migration 步骤
- [ ] 本地 `git status` 干净，所有改动已合并到 `main`

## 打 tag + 发 Release

```bash
# 1. 确认 main 在期望 commit
git checkout main
git pull --ff-only

# 2. 打带签名的 annotated tag
git tag -a v0.2.0 -m "Inkstone v0.2.0"

# 3. 推送 tag
git push origin v0.2.0
```

GitHub Release 通过 `gh` CLI 创建（或在 web UI 手动建）：

```bash
gh release create v0.2.0 \
  --title "v0.2.0" \
  --notes-file CHANGELOG-draft.md \
  --verify-tag
```

## Release Note 模板

```markdown
## Highlights

- 一句话 headline 改动

## ⚠️ Breaking Changes

- 列出所有破坏点 + migration 步骤；无破坏时整段删除

## Added

- 新 shortcode / 新 partial / 新 i18n 字符串 / 新 `[params]` 选项

## Changed

- 现有功能行为调整（非破坏）

## Fixed

- bug 修复

## Hugo / Tailwind 兼容性

- Hugo extended ≥ 0.128
- Tailwind v4

## 升级方式

git submodule:

\`\`\`bash
cd themes/inkstone && git fetch --tags && git checkout v0.2.0
cd ../.. && git add themes/inkstone && git commit -m "chore: bump inkstone to v0.2.0"
\`\`\`

Hugo Modules:

\`\`\`bash
hugo mod get github.com/BerBai/inkstone@v0.2.0
\`\`\`
```

## hugoThemesSiteBuilder 同步

themes.gohugo.io 每天 UTC 00:00 重新构建一次，自动拉 inkstone 最新 release。新版上线后第二天即可在主题站看到更新。**无需**重新提 PR 到 hugoThemesSiteBuilder。

如果 release note 引入了新 screenshot，确认 `images/screenshot.png` 与 `images/tn.png` 都已更新到 `main`，再打 tag —— 构建器从 release-tagged commit 拉文件。

## 失活预警

themes.gohugo.io 18 个月无更新会自动下架。每个自然年至少发一次 PATCH release（哪怕只是依赖升级）以保活。
