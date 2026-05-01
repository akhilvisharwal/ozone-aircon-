(function () {
  'use strict';

  var started = typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
  var MIN_VISIBLE_MS = 360;

  function getEl() {
    return document.getElementById('page-loader');
  }

  function showLoader() {
    var el = getEl();
    if (!el) return;
    el.classList.remove('page-loader--hide');
    el.setAttribute('aria-busy', 'true');
    el.removeAttribute('aria-hidden');
  }

  function hideLoader() {
    var el = getEl();
    if (!el) return;
    var now = typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
    var wait = Math.max(0, MIN_VISIBLE_MS - (now - started));
    setTimeout(function () {
      el.classList.add('page-loader--hide');
      el.setAttribute('aria-hidden', 'true');
      el.setAttribute('aria-busy', 'false');
    }, wait);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideLoader);
  } else {
    hideLoader();
  }

  document.addEventListener(
    'click',
    function (e) {
      var a = e.target && e.target.closest && e.target.closest('a[href]');
      if (!a || a.target === '_blank') return;
      var href = (a.getAttribute('href') || '').trim();
      if (!href || href.charAt(0) === '#') return;
      if (/^https?:\/\//i.test(href)) return;
      if (href.indexOf('.html') === -1) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      showLoader();
    },
    true
  );
})();
