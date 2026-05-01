(function () {
  'use strict';

  var started = typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
  var MIN_VISIBLE_MS = 150;

  function getEl() {
    return document.getElementById('page-loader');
  }

  /** Match in-view scroll-reveal targets before fade — IO often runs next frame → empty hero then pop-in. */
  function revealInViewRevealClasses() {
    var nodes = document.querySelectorAll('.rv,.rv-l,.rv-r,.rv-sc,.rv-fd');
    if (!nodes.length) return;
    var vh = window.innerHeight || document.documentElement.clientHeight || 0;
    var vw = window.innerWidth || document.documentElement.clientWidth || 0;
    var inset = Math.min(72, Math.max(28, Math.round(vh * 0.06)));
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.classList.contains('on')) continue;
      var r = el.getBoundingClientRect();
      if (r.bottom > -inset && r.top < vh + inset && r.right > -inset && r.left < vw + inset) {
        el.classList.add('on');
      }
    }
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
      revealInViewRevealClasses();
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          el.classList.add('page-loader--hide');
          el.setAttribute('aria-hidden', 'true');
          el.setAttribute('aria-busy', 'false');
        });
      });
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
