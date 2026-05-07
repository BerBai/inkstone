// 05-04-e11 (revised post-bug-fix + e13 default-off): reader-exit +
// immersive-page mode.
//
// Replaces the legacy T10 reading-mode system (`:root.reading-mode` +
// localStorage), which collided with the original e11 implementation —
// both classes were being applied on refresh because reading-mode.js
// restored its persisted state on top of the SSR-set
// `body.immersive-page`, layering two style sets.
//
// Single source of truth now:
//   - SSR default: posts/single.html sets `body.article-page` (NOT
//     immersive-page — opt-in by design, e13). Users land on a regular
//     article view; entering reading mode is a deliberate action.
//   - Sidebar button [data-action="reading-mode"]  → enter immersive
//     (only effective on article pages; CSS hides the button elsewhere
//     via shell.css to prevent a UX dead-end with no exit affordance)
//   - In-page #reader-exit button                  → exit immersive
//   - ESC                                          → exit immersive
//     (skip when a lightbox owns the key — checks .lightbox-overlay.is-open)
//
// No persistence — entering and exiting are both user-initiated. Refresh
// returns to the default non-immersive state, which matches the e13
// "default off" intent.
(() => {
  const init = () => {
    const body = document.body;
    const exitBtn = document.getElementById('reader-exit');
    const enterBtn = document.querySelector('[data-action="reading-mode"]');

    // No affordances on this page → nothing to wire.
    if (!exitBtn && !enterBtn) return;

    const isImmersive = () => body.classList.contains('immersive-page');
    const isArticle = () => body.classList.contains('article-page');

    const sync = () => {
      const on = isImmersive();
      if (exitBtn) {
        exitBtn.setAttribute('aria-hidden', on ? 'false' : 'true');
        exitBtn.tabIndex = on ? 0 : -1;
      }
      if (enterBtn) {
        enterBtn.setAttribute('aria-pressed', String(on));
      }
    };

    sync();

    if (exitBtn) {
      exitBtn.addEventListener('click', () => {
        body.classList.remove('immersive-page');
        sync();
      });
    }

    if (enterBtn) {
      enterBtn.addEventListener('click', () => {
        // Article-only: non-article pages have no #reader-exit, so
        // entering immersive there would trap the user. CSS hides the
        // button on those pages too, but we double-check here.
        if (!isArticle()) return;
        body.classList.add('immersive-page');
        sync();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (!isImmersive()) return;
      if (document.querySelector('.lightbox-overlay.is-open')) return;
      body.classList.remove('immersive-page');
      sync();
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
