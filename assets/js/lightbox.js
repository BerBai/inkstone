// T10: Lightbox — click [data-lightbox] in figures to open full-screen overlay.
// Pure vanilla, no deps. Esc / click backdrop / × closes; ←/→ + prev/next paginate.
(() => {
  const triggers = Array.from(document.querySelectorAll('[data-lightbox]'));
  if (!triggers.length) return;

  let current = -1;
  let overlay, imgEl, captionEl, prevBtn, nextBtn, closeBtn;

  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = `
      <button class="lightbox-close" aria-label="关闭">×</button>
      <button class="lightbox-prev" aria-label="上一张">‹</button>
      <img class="lightbox-img" alt="">
      <button class="lightbox-next" aria-label="下一张">›</button>
      <p class="lightbox-caption"></p>
    `;
    document.body.appendChild(overlay);
    imgEl = overlay.querySelector('.lightbox-img');
    captionEl = overlay.querySelector('.lightbox-caption');
    prevBtn = overlay.querySelector('.lightbox-prev');
    nextBtn = overlay.querySelector('.lightbox-next');
    closeBtn = overlay.querySelector('.lightbox-close');

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', () => show(current - 1));
    nextBtn.addEventListener('click', () => show(current + 1));
  }

  function open(idx) {
    if (!overlay) buildOverlay();
    show(idx);
    overlay.classList.add('is-open');
    document.documentElement.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    document.documentElement.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    current = -1;
  }

  function show(idx) {
    if (idx < 0 || idx >= triggers.length) return;
    current = idx;
    const a = triggers[idx];
    imgEl.src = a.dataset.lightbox;
    imgEl.alt = a.dataset.alt || '';
    captionEl.textContent = a.dataset.alt || '';
    prevBtn.toggleAttribute('disabled', idx === 0);
    nextBtn.toggleAttribute('disabled', idx === triggers.length - 1);
  }

  function onKey(e) {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
  }

  triggers.forEach((a, i) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      open(i);
    });
  });
})();
