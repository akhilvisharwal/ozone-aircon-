(function () {
  'use strict';

  var started = typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
  var MIN_VISIBLE_MS = 150;

  /** One assign per outbound navigation — blocks double‑click / repeated synthetic clicks before unload */
  var assignPending = false;

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

  /**
   * Do not show the overlay on the page we are leaving: that spinner restarts when the next
   * document parses, which reads as a double load. The destination markup already mounts a
   * visible loader until hideLoader runs — one spinner per navigation.
   */
  function navigateAway(a) {
    if (assignPending) return;
    var destUrl = typeof a.href === 'string' ? a.href : '';
    if (!destUrl) return;
    assignPending = true;
    var root = document.documentElement;
    if (root && root.style) root.style.pointerEvents = 'none';
    requestAnimationFrame(function () {
      window.location.assign(destUrl);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideLoader);
  } else {
    hideLoader();
  }

  window.addEventListener('pageshow', function (ev) {
    assignPending = false;
    var root = document.documentElement;
    if (root && root.style && root.style.pointerEvents === 'none') root.style.pointerEvents = '';
    if (ev.persisted) {
      var el = getEl();
      if (el) {
        el.classList.add('page-loader--hide');
        el.setAttribute('aria-hidden', 'true');
        el.setAttribute('aria-busy', 'false');
      }
    }
  });

  document.addEventListener(
    'click',
    function (e) {
      var a = e.target && e.target.closest && e.target.closest('a[href]');
      if (!a || a.target === '_blank') return;

      var hrefAttr = (a.getAttribute('href') || '').trim();
      if (!hrefAttr || hrefAttr.charAt(0) === '#') return;
      if (/^https?:\/\//i.test(hrefAttr)) return;
      if (hrefAttr.indexOf('.html') === -1) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      e.preventDefault();
      e.stopPropagation();

      navigateAway(a);
    },
    true
  );
})();
