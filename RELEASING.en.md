# Releasing

> [中文](./RELEASING.md) · [English](./RELEASING.en.md)

Release process. Inkstone follows [SemVer](https://semver.org/), tag prefix `v` (e.g. `v0.1.0`).

## Versioning

- **MAJOR** (`v1.0.0` → `v2.0.0`): breaking changes — partial / shortcode interface removed or no longer backward-compatible, required `hugo.toml` keys change, CSS variables removed.
- **MINOR** (`v0.1.0` → `v0.2.0`): backward-compatible additions — new shortcodes, new i18n strings, new `[params]` options, new layout blocks.
- **PATCH** (`v0.1.0` → `v0.1.1`): bug fixes, doc updates, dependency bumps (no public-interface change).

During the `0.x` phase, small breakages are allowed within MINOR (Hugo theme convention), but must be ⚠️-flagged at the top of the release note.

## Pre-release Checklist

- [ ] `exampleSite/` boots under basic Hugo (no npm / no Pagefind): `hugo server -s exampleSite --themesDir ../..` runs, the shortcodes-demo page renders every shortcode without errors
- [ ] `theme.toml`'s `min_version` matches `hugo.toml`'s `[module.hugoVersion].min`
- [ ] `images/screenshot.png` (≥1500×1000, 3:2) and `images/tn.png` (≥900×600, 3:2) dimension checks pass
- [ ] README.md / README.en.md kept in sync; all images use absolute `https://raw.githubusercontent.com/BerBai/inkstone/main/...` URLs
- [ ] Breaking changes ⚠️-flagged at the top of the release note with migration steps
- [ ] Local `git status` clean, all changes merged into `main`

## Tag and Release

```bash
# 1. Make sure main is at the intended commit
git checkout main
git pull --ff-only

# 2. Create an annotated tag
git tag -a v0.2.0 -m "Inkstone v0.2.0"

# 3. Push the tag
git push origin v0.2.0
```

Create the GitHub Release via the `gh` CLI (or manually in the web UI):

```bash
gh release create v0.2.0 \
  --title "v0.2.0" \
  --notes-file CHANGELOG-draft.md \
  --verify-tag
```

## Release Note Template

```markdown
## Highlights

- One-line headline change

## ⚠️ Breaking Changes

- List every breakage + migration steps; remove the section when there are none

## Added

- New shortcodes / partials / i18n strings / `[params]` options

## Changed

- Behavior tweaks to existing features (non-breaking)

## Fixed

- Bug fixes

## Hugo / Tailwind compatibility

- Hugo extended ≥ 0.128
- Tailwind v4

## Upgrade

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

## hugoThemesSiteBuilder Sync

themes.gohugo.io rebuilds daily at UTC 00:00 and pulls the latest inkstone release automatically. New versions show up on the gallery the next day. **No** new PR to hugoThemesSiteBuilder is needed.

If a release ships a new screenshot, make sure both `images/screenshot.png` and `images/tn.png` are updated on `main` before tagging — the builder pulls files from the release-tagged commit.

## Inactivity Watch

themes.gohugo.io de-lists themes that go 18 months without an update. Ship at least one PATCH release per calendar year (even if it's just a dependency bump) to stay listed.
