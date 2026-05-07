// S2: Theme toggle — switches [data-theme] on <html> and persists the
// choice to localStorage. The earlier inline bootstrap in head.html
// hydrates `data-theme` from localStorage before first paint to avoid
// FOUC; this script only handles the click-to-toggle interaction.
//
// 05-04-theme-persist: reverses the e14 "deliberately not persisted"
// design — users repeatedly hit "switch to dark, refresh, back to
// light" because the choice didn't survive reloads. Now: once the user
// picks a theme, it sticks across reloads and tabs until they pick the
// other one. System preference is consulted only on the very first
// visit (no localStorage value yet).
//
// 05-04-theme-broadcast: after each toggle we dispatch a `themechange`
// CustomEvent on `document` so theme-sensitive components (antv-g2 /
// mermaid charts that snapshotted theme at init time) can re-render.
// Contract: event.detail.theme is the canonical string "dark" | "light".
// See .trellis/spec/frontend/themed-components.md for the integration recipe.
(() => {
  const btn = document.querySelector('[data-action="theme"]');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const html = document.documentElement;
    const sysDark = matchMedia('(prefers-color-scheme: dark)').matches;
    const current = html.dataset.theme || (sysDark ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    html.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch (_) { /* private mode / storage disabled — session-only fallback */ }
    document.dispatchEvent(new CustomEvent('themechange', {
      bubbles: true,
      detail: { theme: next },
    }));
  });
})();
