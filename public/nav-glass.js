(function () {
  'use strict';

  var shell = document.querySelector('.nav-shell');
  if (!shell) return;

  var band =
    document.querySelector('[data-nav-scroll-anchor]') ||
    document.querySelector('.hero') ||
    document.querySelector('.about-hero') ||
    document.querySelector('.section-hero') ||
    document.querySelector('.page-header');

  if (!band) return;

  /** Larger band on phones/tablets avoids nav "scrolled" class flicker at the boundary. */
  function hy() {
    var w = window.innerWidth || document.documentElement.clientWidth || 980;
    return w <= 900 ? 72 : 32;
  }
  var scheduled = false;

  function thresh() {
    return Math.max(0, band.offsetHeight - 8);
  }

  var y0 = window.scrollY || window.pageYOffset || 0;
  var scrolled = y0 > thresh();
  shell.classList.toggle('scrolled', scrolled);

  function compute() {
    scheduled = false;
    var y = window.scrollY || window.pageYOffset || 0;
    var t = thresh();
    if (scrolled) {
      if (y < t - hy()) {
        scrolled = false;
        shell.classList.remove('scrolled');
      }
    } else {
      if (y > t + hy()) {
        scrolled = true;
        shell.classList.add('scrolled');
      }
    }
  }

  function queue() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(compute);
    }
  }

  window.addEventListener('scroll', queue, { passive: true });

  var vv = window.visualViewport;
  if (vv) {
    vv.addEventListener('scroll', queue, { passive: true });
    vv.addEventListener('resize', queue, { passive: true });
  }

  window.addEventListener('resize', queue, { passive: true });
})();
