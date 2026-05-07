# Contributing to Inkstone

Thanks for considering a contribution! Inkstone is a small, opinionated theme — the bar for new features is intentionally high, but bug fixes and docs are always welcome.

## Reporting issues

Open an issue at [github.com/BerBai/inkstone/issues](https://github.com/BerBai/inkstone/issues).

Please include:

- **Hugo version**: `hugo version` (must be ≥ 0.128 extended)
- **Theme version**: tag or commit SHA
- **Tailwind setup**: npm `@tailwindcss/cli` / standalone CLI / other
- **Reproduction**: minimal `hugo new site` + steps to trigger
- **Expected vs actual**: what you expected, what you saw

For visual bugs, attach a screenshot.

## Asking questions

Issues are for actionable problems. For "how do I configure X" questions, check:

1. [README](./README.md) — main docs
2. [exampleSite](./exampleSite/) — working examples of every shortcode and layout
3. Hugo's official [docs](https://gohugo.io/documentation/)

If those don't answer it, open an issue tagged `question`.

## Pull requests

Before opening a PR for a new feature, **open an issue first** to discuss scope. PRs that add features without prior discussion may be closed.

PRs that fix bugs or improve docs can go straight to PR — no pre-discussion needed.

### PR checklist

- [ ] Branch off `main`
- [ ] Commit message follows [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat: add X shortcode`
  - `fix: correct CJK reading time on en pages`
  - `docs: clarify Tailwind setup`
  - `chore: bump Hugo min version`
- [ ] If adding a shortcode: ship the layout in `layouts/shortcodes/<name>.html` AND a demo entry in `exampleSite/content/shortcodes-demo.md`
- [ ] If adding CSS: scope it under a clear class (avoid global selectors); use Tailwind utilities first, escape to `assets/css/<area>.css` only when utilities can't express the rule
- [ ] If changing layouts: build `exampleSite` locally and verify nothing visually regresses
- [ ] If adding i18n strings: add to BOTH `i18n/en.toml` and `i18n/zh-cn.toml`. Other languages are best-effort.

### Local development

```bash
git clone https://github.com/<your-fork>/inkstone
cd inkstone
npm install   # tailwindcss + @tailwindcss/cli
cd exampleSite
hugo server --themesDir ../.. -D
```

The `exampleSite/` is the canonical test bed. If your change requires editing `exampleSite/content/`, do it.

### Testing

There's no formal test suite. Manual verification:

1. `cd exampleSite && hugo --themesDir ../..` exits 0
2. Visit `/`, `/posts/`, `/about/`, `/shortcodes-demo/`, `/tags/` — none should 404
3. Toggle dark mode (sidebar button) — should persist on reload
4. Trigger `⌘K` — search modal should open

If your change adds a shortcode, ensure it appears in `/shortcodes-demo/` with a working example.

## Code style

### Hugo templates

- 4-space indent inside `{{ }}` blocks
- Use `partial` for anything reused 3+ times
- Page Store pattern for one-time CDN loaders: `{{ if not ($.Page.Store.Get "shortcode-foo") }}<script>...</script>{{ $.Page.Store.Set "shortcode-foo" true }}{{ end }}`
- `i18n` for any user-facing string: `{{ i18n "post_reading_time" }}`

### CSS

- Tailwind v4 utilities for layout/spacing/color
- `@theme` design tokens for site-wide values (in `assets/css/variable.css`)
- Component CSS only when utilities don't express the rule (e.g., `.prose`, animation keyframes)
- No CSS-in-JS, no styled-components, no runtime CSS theming

### JavaScript

- ES modules in `assets/js/`
- No bundler; Hugo serves them as `<script type="module">` directly
- No external runtime dependencies (CDN libs are loaded by individual shortcodes, scoped per-page)
- Progressive enhancement: feature detect, fail silently if unsupported

## Forks vs PRs

Inkstone is intentionally minimal. If you want a feature that doesn't fit the philosophy ("opinionated about CJK longreads"), forking is the right move. Forks must:

- Keep the MIT license (per [original LICENSE](./LICENSE))
- Acknowledge upstream in your README
- Use a different theme `name` in `theme.toml` to avoid confusion in themes.gohugo.io

## License

By contributing, you agree your contributions are licensed under the [MIT license](./LICENSE).

## Code of conduct

Be kind. Disagree about code, not people.

Issues with personal attacks, harassment, or hostile language will be closed without further engagement.
