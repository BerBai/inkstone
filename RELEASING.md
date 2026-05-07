# Releasing Inkstone

> Maintainer-facing checklist for cutting a new release.
> Public users: see [README](./README.md) for installation.

## Versioning

Inkstone follows [Semantic Versioning](https://semver.org/):

- **MAJOR** (e.g., 1.0.0): incompatible changes — removed shortcodes, changed config keys, layout slot renames that break user overrides
- **MINOR** (e.g., 0.2.0): new shortcodes, new layout features, new i18n strings — backwards compatible
- **PATCH** (e.g., 0.1.1): bug fixes, doc updates, dependency bumps — no behavior changes

While at `0.x`, breaking changes can land in MINOR bumps; document them clearly in the release notes.

## Pre-release checklist

Before tagging:

- [ ] All planned changes merged into `main`
- [ ] `theme.toml` `description` / `tags` / `features` still accurate
- [ ] `hugo.toml` `[module.hugoVersion].min` reflects actual minimum (don't bump unless a new feature requires it)
- [ ] `images/screenshot.png` reshot if visual layout has changed
- [ ] `exampleSite/` builds: `cd exampleSite && hugo --themesDir ../..` exits 0
- [ ] `exampleSite/content/shortcodes-demo.md` still renders all shortcodes
- [ ] README cross-links still valid (no 404 on internal anchors)
- [ ] CHANGELOG entries written for every notable change since last release

## Cutting the release

```bash
# 1. Determine next version
git tag --list 'v*' --sort=-v:refname | head -3
NEXT=v0.1.1   # or v0.2.0 / v1.0.0 per semver

# 2. Update version-stamped files (if any)
# (none currently — package.json version is decoupled from theme tag)

# 3. Tag
git tag -a "$NEXT" -m "Inkstone $NEXT — <one-line summary>"

# 4. Push tag
git push origin "$NEXT"

# 5. Create GitHub Release (use gh CLI)
gh release create "$NEXT" \
  -R BerBai/inkstone \
  -t "$NEXT — <title>" \
  --notes-file ./.github/release-notes/$NEXT.md
```

## Release notes template

```markdown
## $VERSION

### Added
- New shortcode `<name>` for <use case>

### Changed
- `<file>`: <what changed>

### Fixed
- `<bug>`: <fix description>

### Compatibility
- Hugo extended ≥ X.Y.Z
- Tailwind v4 (no change since v0.1.0)

### Breaking
- (none)
```

Save under `.github/release-notes/v0.X.Y.md`. Reuse for the GitHub Release body.

## After release

- [ ] Verify `https://github.com/BerBai/inkstone/releases/tag/$NEXT` displays correctly
- [ ] Verify Hugo Modules can pull the new tag: `go mod download github.com/BerBai/inkstone@$NEXT`
- [ ] [Optional] Tweet / post about the release with screenshot link
- [ ] Bump submodule pin in any consuming sites (e.g., personal lifelog uses this theme)

## Demosite update (when relevant)

The `exampleSite/` is currently statically deployed via [GitHub Pages](https://berbai.github.io/inkstone/) (configured in `.github/workflows/deploy-demo.yml` if present; otherwise this is a TODO).

After a release that changes visual output:

```bash
git checkout "$NEXT"
cd exampleSite
hugo --themesDir ../.. --baseURL https://berbai.github.io/inkstone/ --gc --minify
# Push to gh-pages branch via the deploy workflow or manual gh-pages push
```

## Yanking a release

If a release ships with a critical bug:

1. **Do not delete the tag** — Hugo Modules clients have it cached; pulling a deleted tag can corrupt their checksums
2. Cut a patch release immediately (`v0.X.Y+1`)
3. Mark the broken release as a pre-release on GitHub: `gh release edit "$BAD" -R BerBai/inkstone --prerelease`
4. Edit the broken release's body to point at the patch: "**Yanked. Use vX.Y.Z+1 instead.**"

## Compatibility windows

- Default: support the latest Hugo extended version + the previous two minor versions
- If a new feature requires a Hugo bump, document it in the release notes and bump `[module.hugoVersion].min` in `hugo.toml`
- Tailwind v4 is the floor; Tailwind v3 is not supported (different `@theme`/`@utility` syntax)

## hugoThemesSiteBuilder rebuild

The themes.gohugo.io site rebuilds daily at UTC 00:00. New releases appear on the next rebuild cycle. The build picks the latest tag within the current major version, so:

- v0.1.x → v0.1.x (highest patch)
- v0.2.0 released → switches to v0.2.x
- v1.0.0 released → switches to v1.x.x (major bump signals breaking change to users)
