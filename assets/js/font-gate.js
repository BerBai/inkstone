(() => {
  const html = document.documentElement;
  if (!html.classList.contains('fonts-pending')) return;

  const reveal = () => {
    if (window.__inkstoneFontGateTimer) {
      window.clearTimeout(window.__inkstoneFontGateTimer);
      window.__inkstoneFontGateTimer = null;
    }
    html.classList.remove('fonts-pending');
    html.classList.add('fonts-ready');
  };

  if (!document.fonts || typeof document.fonts.load !== 'function') {
    reveal();
    return;
  }

  const criticalFonts = Promise.all([
    document.fonts.load('400 1rem "Noto Serif SC"', '汉字'),
    document.fonts.load('600 1rem "Noto Serif SC"', '汉字'),
    document.fonts.load('400 1rem "Noto Serif SC"', 'Inkstone'),
    document.fonts.load('600 1rem "Noto Serif SC"', 'Inkstone'),
  ]);
  const timeout = new Promise((resolve) => window.setTimeout(resolve, 1400));

  Promise.race([criticalFonts, timeout]).then(reveal, reveal);
})();
