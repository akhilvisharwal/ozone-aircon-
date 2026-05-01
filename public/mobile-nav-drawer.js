(function () {
  'use strict';

  var BP = 900;
  var menu;
  var btn;
  var origToggle;

  function isNarrow() {
    return (window.innerWidth || document.documentElement.clientWidth || 980) <= BP;
  }

  function injectDrawerHeader(menuEl) {
    if (!menuEl || menuEl.querySelector('.mobile-drawer-header')) return;
    var header = document.createElement('div');
    header.className = 'mobile-drawer-header';
    var title = document.createElement('span');
    title.className = 'mobile-drawer-title';
    title.textContent = 'Explore';
    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'mobile-drawer-close';
    closeBtn.setAttribute('aria-label', 'Close menu');
    closeBtn.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>';
    closeBtn.addEventListener('click', forceCloseDrawer);
    header.appendChild(title);
    header.appendChild(closeBtn);
    menuEl.insertBefore(header, menuEl.firstChild);
  }

  function syncMenuState(open) {
    if (!menu) return;
    btn = btn || document.getElementById('hamburgerBtn');
    if (!isNarrow()) {
      menu.removeAttribute('aria-modal');
      menu.removeAttribute('aria-hidden');
      return;
    }

    if (open) {
      menu.setAttribute('aria-modal', 'false');
      menu.removeAttribute('aria-hidden');
      requestAnimationFrame(function () {
        var c = menu.querySelector('.mobile-drawer-close');
        if (c && typeof c.focus === 'function') c.focus();
      });
    } else {
      menu.removeAttribute('aria-modal');
      menu.removeAttribute('aria-hidden');
      if (document.activeElement && menu.contains(document.activeElement) && btn) {
        btn.focus();
      }
    }
  }

  function forceCloseDrawer() {
    if (!menu || !menu.classList.contains('open')) return;
    menu.classList.remove('open');
    btn = btn || document.getElementById('hamburgerBtn');
    if (btn) {
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  }

  function wrapToggle() {
    origToggle = typeof window.toggleMobileMenu === 'function' ? window.toggleMobileMenu : null;
    window.toggleMobileMenu = function () {
      if (origToggle) return origToggle.apply(null, arguments);
      var m = document.getElementById('mobileMenu');
      var b = document.getElementById('hamburgerBtn');
      if (!m || !b) return;
      var open = m.classList.toggle('open');
      b.classList.toggle('open', open);
      b.setAttribute('aria-expanded', String(open));
    };
  }

  function init() {
    menu = document.getElementById('mobileMenu');
    btn = document.getElementById('hamburgerBtn');
    if (!menu) return;

    injectDrawerHeader(menu);

    wrapToggle();

    var mo = new MutationObserver(function () {
      syncMenuState(menu.classList.contains('open'));
    });
    mo.observe(menu, { attributes: true, attributeFilter: ['class'] });

    syncMenuState(menu.classList.contains('open'));

    window.addEventListener(
      'resize',
      function () {
        if (!isNarrow() && menu.classList.contains('open')) forceCloseDrawer();
      },
      { passive: true },
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
