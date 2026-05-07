// 05-06-s2 + s3: ⌘K search modal — Pagefind-powered with history.
//
// Pagefind serves a per-language index (auto-detected from <html lang>)
// at /pagefind/. The script imports it lazily on first open so cold
// page loads pay zero cost. Sidebar trigger renders as <a href="/posts/">
// in HTML so JS-disabled visitors still reach the post list.
//
// History uses localStorage["inkstone:search:recent"], FIFO with cap 5,
// dedupe-on-insert. Falls back to in-memory if storage is unavailable
// (private browsing, quota exceeded) — survives within the page session.

(() => {
  const modal = document.getElementById('search-modal');
  if (!modal) return;

  const input = modal.querySelector('.search-input');
  const resultsEl = modal.querySelector('.search-results');
  const closeBtn = modal.querySelector('.search-close');

  const I18N = {
    recentTitle: modal.dataset.i18nRecentTitle || 'Recent',
    recentEmpty: modal.dataset.i18nRecentEmpty || 'Start typing.',
    recentClear: modal.dataset.i18nRecentClear || 'Clear',
    noResultsTitle: modal.dataset.i18nNoResultsTitle || 'No matches',
    noResultsHint: modal.dataset.i18nNoResultsHint || 'Try a broader keyword.',
  };

  const HISTORY_KEY = 'inkstone:search:recent';
  const HISTORY_CAP = 5;

  let pagefind = null;
  let pagefindLoading = null;
  let lastFocus = null;
  let debounceTimer = 0;
  let activeIdx = -1;
  let memoryHistory = [];

  function readHistory() {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.filter((s) => typeof s === 'string') : [];
    } catch (_) {
      return memoryHistory.slice();
    }
  }

  function writeHistory(list) {
    const trimmed = list.slice(0, HISTORY_CAP);
    memoryHistory = trimmed;
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
    } catch (_) { /* private mode / quota — memory fallback already updated */ }
  }

  function pushHistory(query) {
    const q = query.trim();
    if (!q) return;
    const current = readHistory();
    const without = current.filter((s) => s !== q);
    writeHistory([q, ...without]);
  }

  function clearHistory() {
    memoryHistory = [];
    try { localStorage.removeItem(HISTORY_KEY); } catch (_) {}
  }

  function loadPagefind() {
    if (pagefind) return Promise.resolve(pagefind);
    if (pagefindLoading) return pagefindLoading;
    pagefindLoading = import('/pagefind/pagefind.js')
      .then((mod) => {
        pagefind = mod;
        return mod;
      })
      .catch((err) => {
        console.warn('[search] pagefind load failed', err);
        pagefindLoading = null;
        return null;
      });
    return pagefindLoading;
  }

  function open() {
    if (!modal.hasAttribute('hidden')) return;
    lastFocus = document.activeElement;
    modal.removeAttribute('hidden');
    modal.classList.add('is-open');
    document.documentElement.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    requestAnimationFrame(() => input.focus());
    renderEmptyState();
    loadPagefind();
  }

  function close() {
    if (modal.hasAttribute('hidden')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('hidden', '');
    document.documentElement.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    input.value = '';
    resultsEl.innerHTML = '';
    activeIdx = -1;
    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    }
  }

  function onKey(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveSelection(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveSelection(-1);
    } else if (e.key === 'Enter') {
      const items = resultsEl.querySelectorAll('.search-result');
      if (activeIdx >= 0 && items[activeIdx]) {
        e.preventDefault();
        const url = items[activeIdx].getAttribute('href');
        if (url) {
          pushHistory(input.value);
          location.href = url;
        }
      }
    }
  }

  function moveSelection(delta) {
    const items = resultsEl.querySelectorAll('.search-result');
    if (!items.length) return;
    activeIdx = (activeIdx + delta + items.length) % items.length;
    items.forEach((el, i) => el.classList.toggle('is-active', i === activeIdx));
    items[activeIdx].scrollIntoView({ block: 'nearest' });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function renderEmptyState() {
    activeIdx = -1;
    const history = readHistory();
    if (!history.length) {
      resultsEl.innerHTML = `<div class="search-empty">
        <div class="search-empty__hint">${escapeHtml(I18N.recentEmpty)}</div>
      </div>`;
      return;
    }
    const items = history
      .map((q) => `<button type="button" class="search-recent__item" data-query="${escapeHtml(q)}">
        <span class="search-recent__icon" aria-hidden="true">↺</span>
        <span class="search-recent__text">${escapeHtml(q)}</span>
      </button>`)
      .join('');
    resultsEl.innerHTML = `<div class="search-recent">
      <div class="search-recent__head">
        <span class="search-recent__title">${escapeHtml(I18N.recentTitle)}</span>
        <button type="button" class="search-recent__clear">${escapeHtml(I18N.recentClear)}</button>
      </div>
      <div class="search-recent__list">${items}</div>
    </div>`;
  }

  function renderNoResults() {
    activeIdx = -1;
    resultsEl.innerHTML = `<div class="search-empty">
      <div class="search-empty__title">${escapeHtml(I18N.noResultsTitle)}</div>
      <div class="search-empty__hint">${escapeHtml(I18N.noResultsHint)}</div>
    </div>`;
  }

  async function runSearch(query) {
    activeIdx = -1;
    const trimmed = query.trim();
    if (!trimmed) {
      renderEmptyState();
      return;
    }
    const pf = await loadPagefind();
    if (!pf) {
      renderNoResults();
      return;
    }
    const search = await pf.search(trimmed);
    const top = search.results.slice(0, 10);
    if (!top.length) {
      renderNoResults();
      return;
    }
    const rendered = await Promise.all(top.map((r) => r.data()));
    resultsEl.innerHTML = rendered
      .map((r) => {
        const title = (r.meta && r.meta.title) ? r.meta.title : r.url;
        return `<a class="search-result" href="${r.url}" role="option">
          <div class="search-result__title">${escapeHtml(title)}</div>
          <div class="search-result__excerpt">${r.excerpt}</div>
        </a>`;
      })
      .join('');
  }

  // Global ⌘K / Ctrl+K
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (modal.hasAttribute('hidden')) open();
      else close();
    }
  });

  // Replace sidebar <a href="/posts/"> behavior with modal open.
  document.querySelectorAll('[data-action="search"]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      open();
    });
  });

  closeBtn?.addEventListener('click', close);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  // Delegate clicks inside the results region: history items refill the
  // input; clear wipes history; result clicks commit the current query
  // to history before the browser follows the href.
  resultsEl.addEventListener('click', (e) => {
    const recentItem = e.target.closest('.search-recent__item');
    if (recentItem) {
      e.preventDefault();
      const q = recentItem.dataset.query || '';
      input.value = q;
      pushHistory(q);
      runSearch(q);
      input.focus();
      return;
    }
    if (e.target.closest('.search-recent__clear')) {
      e.preventDefault();
      clearHistory();
      renderEmptyState();
      return;
    }
    if (e.target.closest('.search-result')) {
      pushHistory(input.value);
      return;
    }
  });

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const v = input.value;
    debounceTimer = setTimeout(() => runSearch(v), 150);
  });
})();
