# Contributing

> [中文](./CONTRIBUTING.md) · [English](./CONTRIBUTING.en.md)

Issues and PRs welcome. Inkstone is a small project — the flow stays simple.

## Filing Issues

Search [existing issues](https://github.com/BerBai/inkstone/issues) first to avoid duplicates.

### Bug Reports

Please include:

- Hugo version (`hugo version` — confirm it's the **extended** build)
- Inkstone version (tag or commit hash)
- Tailwind install path (npm / standalone CLI)
- Reproduction steps (a minimal `hugo.toml` plus the content snippet that triggers the issue)
- Expected vs actual behavior
- Browser + version (if it's a frontend rendering issue)

### Feature Requests

Please describe:

- Use case: what kind of content are you writing where you need this?
- Alternatives: can it be done with an existing shortcode / CSS override? Why isn't that enough?
- API sketch: if it's a new shortcode, what parameters does it take?

## Submitting PRs

### Setup

1. Fork → from your fork's `main`, create a feature branch: `git checkout -b feat/short-description`
2. Keep changes small and focused on a single topic; for large refactors, open an issue to discuss first
3. Keep both languages in sync: when changing README / i18n / docs, update CN + EN together

### Local Verification

```bash
# In the inkstone repo root
hugo server -s exampleSite --themesDir ../..
# Open http://localhost:1313
```

Walk through:

- [ ] exampleSite homepage + about + posts list render correctly
- [ ] `/shortcodes-demo/` renders every shortcode without errors
- [ ] Language switching + menu links work
- [ ] Dark mode toggle + persistence work
- [ ] `⌘K` search modal opens (search results require running Pagefind via `npm run build` first)
- [ ] No errors in browser console

### Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat(shortcode): add image-compare slider variant`
- `fix(search): debounce input to avoid index thrash`
- `docs(readme): add Tailwind v4 standalone install path`
- `refactor(css): extract callout tokens to variable.css`
- `chore(deps): bump tailwindcss to 4.1.x`

Suggested theme scopes: `shortcode` / `layout` / `css` / `i18n` / `search` / `build` / `docs` / `deps`.

### PR Description

At minimum:

- **What**: what changed
- **Why**: why it changed (link the related issue)
- **Screenshot / GIF**: required for any UI change (mobile + desktop viewports)
- **Test plan**: copy the local verification checklist above and tick off the boxes

### Review Cadence

- Maintainer typically responds within 3 days
- If after discussion a PR won't be merged, the reasoning will be stated
- Stale PRs (30 days without author response) are closed; reopening them is welcome

## Local Dev Environment

```bash
git clone https://github.com/BerBai/inkstone
cd inkstone

# Install Tailwind (pick one path — see README.md "Tailwind v4 Setup")
npm install -D tailwindcss @tailwindcss/cli
# or download the standalone CLI

# Boot the demo site
hugo server -s exampleSite --themesDir ../..
```

## Code Style

- HTML / Hugo templates: 2-space indent; one space inside `{{ }}` braces
- CSS: prefer Tailwind utilities; when utilities aren't enough, write to `assets/css/components/<name>.css` under `@layer components`
- JS: native ES modules, no bundler; browser baseline per README
- File naming: kebab-case; shortcode `assets/snippets/<name>.html` and `layouts/shortcodes/<name>.html` share the same name

## License

Submitting a PR means you agree your changes are released under the [MIT License](./LICENSE).
