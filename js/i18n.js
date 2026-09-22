/* Viberobo i18n — dual-language toggle (EN ⇄ 中文)
   Markup convention: pair every text with <span class="en-t"> / <span class="zh-t">
   (or .en-b / .zh-b for block-level). Default decided in the inline <head> script. */
(function () {
  const KEY = 'vb-lang';

  function current() {
    return document.documentElement.classList.contains('zh') ? 'zh' : 'en';
  }

  function apply(lang) {
    document.documentElement.classList.toggle('zh', lang === 'zh');
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
    localStorage.setItem(KEY, lang);
    document.querySelectorAll('.lang-sw').forEach(sw => {
      sw.querySelectorAll('span').forEach(s => {
        s.classList.toggle('on', s.dataset.lang === lang);
      });
    });
    document.dispatchEvent(new CustomEvent('vb:lang', { detail: { lang } }));
  }

  function toggle() { apply(current() === 'zh' ? 'en' : 'zh'); }

  document.addEventListener('click', e => {
    const sw = e.target.closest('.lang-sw');
    if (!sw) return;
    const picked = e.target.closest('span[data-lang]');
    if (picked) apply(picked.dataset.lang);
    else toggle();
  });

  document.addEventListener('DOMContentLoaded', () => apply(current()));
  window.vbLang = { current, apply, toggle };
})();
