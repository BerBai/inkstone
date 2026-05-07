// 05-03-c2: TOC scrollspy.
//
// Toggles `.is-active` on the `.toc-link` whose target heading is
// currently in the upper third of the viewport. One active at a time.
// If no heading intersects (e.g. between sections, near top/bottom),
// keeps the last active so the user always sees a "you are here" mark.
//
// No work happens if the page has no `.toc` (non-post pages, posts with
// < 2 headings — partial bails out and emits no DOM). No build-time
// dependency on toc.html beyond the markup contract:
//
//   <nav class="toc">
//     <a class="toc-link" href="#anchor" data-depth="2|3|4">…</a>
//     …
//   </nav>
//
// Pattern follows assets/js/immersive.js — IIFE + DOMContentLoaded gate.
(() => {
  const init = () => {
    const toc = document.querySelector('.toc');
    if (!toc) return;

    const links = Array.from(toc.querySelectorAll('.toc-link[href^="#"]'));
    if (links.length === 0) return;

    // Pair each link with its target heading. Skip links whose anchor
    // doesn't resolve (defensive — Hugo should always emit matching IDs).
    const pairs = [];
    for (const link of links) {
      const id = decodeURIComponent(link.getAttribute('href').slice(1));
      const target = id ? document.getElementById(id) : null;
      if (target) pairs.push({ link, target });
    }
    if (pairs.length === 0) return;

    const setActive = (link) => {
      for (const { link: l } of pairs) l.classList.remove('is-active');
      if (link) link.classList.add('is-active');
    };

    // Track which targets are currently intersecting. The active one is
    // the topmost (smallest .top) among them. If none, hold the last
    // active link.
    const visible = new Set();
    let lastActive = null;

    const recompute = () => {
      if (visible.size === 0) {
        if (lastActive) setActive(lastActive);
        return;
      }
      let topmost = null;
      let topY = Infinity;
      for (const { link, target } of pairs) {
        if (!visible.has(target)) continue;
        const y = target.getBoundingClientRect().top;
        if (y < topY) {
          topY = y;
          topmost = link;
        }
      }
      if (topmost) {
        lastActive = topmost;
        setActive(topmost);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        recompute();
      },
      {
        // Activation zone: top 30% of viewport (above the fold). The
        // bottom 70% is "below the read line" so headings entering it
        // don't yet take the active state.
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0,
      }
    );

    for (const { target } of pairs) io.observe(target);

    // Initial paint: pick the heading closest to (but above) the
    // viewport top so the user lands on a sensible default before the
    // first IntersectionObserver tick fires.
    let bestLink = null;
    let bestY = -Infinity;
    for (const { link, target } of pairs) {
      const y = target.getBoundingClientRect().top;
      if (y < 100 && y > bestY) {
        bestY = y;
        bestLink = link;
      }
    }
    if (bestLink) {
      lastActive = bestLink;
      setActive(bestLink);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
