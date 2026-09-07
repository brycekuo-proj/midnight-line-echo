/* Presentation-only localization. No branch, progress, timing, or asset changes. */
(function () {
  'use strict';
  const storageKey = 'echo_language';
  let language = 'zh-TW';
  try { if (localStorage.getItem(storageKey) === 'en') language = 'en'; } catch (_) {}
  const catalog = window.ECHO_EN || {};
  const missing = new Set();
  const hasCJK = /[\u3400-\u9fff]/;

  function segment(source) {
    const key = source.trim();
    if (!hasCJK.test(key)) return source;
    if (Object.prototype.hasOwnProperty.call(catalog, key)) {
      return source.slice(0, source.length - source.trimStart().length) + catalog[key] +
        source.slice(source.trimEnd().length);
    }
    if (!missing.has(key)) {
      missing.add(key);
      console.warn('[ECHO i18n] Missing English translation:', key);
    }
    return source;
  }

  function t(source) {
    if (language !== 'en' || typeof source !== 'string') return source;
    // Translate complete text segments, preserving markup, IDs, and inline styles.
    return source.split(/(<[^>]*>)/g).map((part) => part.startsWith('<')
      ? part.replace(/((?:alt|title|aria-label|placeholder)=["'])(.*?)(["'])/g,
          (_, before, value, after) => before + segment(value) + after)
      : segment(part)).join('');
  }

  function localizeEntry() {
    if (language !== 'en') return;
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.parentElement.closest('script, style, [data-language-choice]')) nodes.push(node);
    }
    nodes.forEach((node) => {
      // HTML entities have already been decoded by the browser.
      const original = node.nodeValue;
      const encoded = original.replace(/\u00a0/g, '&nbsp;');
      node.nodeValue = t(encoded).replace(/&nbsp;/g, '\u00a0');
    });
    document.querySelectorAll('[alt], [title], [aria-label], [placeholder]').forEach((el) => {
      if (el.closest('[data-language-choice]')) return;
      ['alt', 'title', 'aria-label', 'placeholder'].forEach((attr) => {
        if (el.hasAttribute(attr)) el.setAttribute(attr, t(el.getAttribute(attr)));
      });
    });
  }

  function chooseLanguage(next) {
    if (!['zh-TW', 'en'].includes(next) || next === language) return;
    try { localStorage.setItem(storageKey, next); } catch (_) {
      // A session override still supports language choice when storage is blocked.
      const url = new URL(location.href);
      url.searchParams.set('lang', next);
      location.replace(url.href);
      return;
    }
    const url = new URL(location.href);
    url.searchParams.delete('lang');
    // Only offered at entry: reload also rebuilds module-level localized data.
    location.replace(url.href);
  }

  const override = new URLSearchParams(location.search).get('lang');
  if (override === 'en' || override === 'zh-TW') language = override;
  window.ECHO_I18N = Object.freeze({ t, chooseLanguage, language, missing });
  document.documentElement.lang = language;
  localizeEntry();
  document.querySelectorAll('[data-language-choice] button').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.language === language));
    button.addEventListener('click', () => chooseLanguage(button.dataset.language));
  });
})();
