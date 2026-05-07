// 05-04-e9: code-copy — add a copy button to every <pre> inside .prose.
// Pure vanilla; runs once on DOMContentLoaded.
(() => {
  const init = () => {
    const pres = document.querySelectorAll('.prose pre');
    pres.forEach((pre) => {
      // Skip already-wrapped or non-textual pres (e.g. mermaid).
      if (pre.parentElement && pre.parentElement.classList.contains('code-block')) return;
      if (pre.classList.contains('mermaid')) return;

      // Wrap pre in .code-block so the absolutely-positioned button has a
      // positioning ancestor and the original prose layout is preserved.
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'code-copy';
      btn.setAttribute('aria-label', '复制代码');
      btn.title = '复制代码';
      btn.innerHTML =
        '<svg class="icon-copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>' +
        '<svg class="icon-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';
      btn.addEventListener('click', async () => {
        const code = pre.querySelector('code') || pre;
        const text = code.innerText;
        try {
          await navigator.clipboard.writeText(text);
          btn.classList.add('is-copied');
          btn.title = '已复制';
          setTimeout(() => {
            btn.classList.remove('is-copied');
            btn.title = '复制代码';
          }, 1500);
        } catch (e) {
          console.warn('[code-copy] clipboard failed', e);
        }
      });
      wrapper.appendChild(btn);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
