/* ============================================================
   PIXAQUE — Asad Ullah Portfolio
   main.js
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. CUSTOM CURSOR
     ---------------------------------------------------------- */
  var dot  = document.getElementById('cur-dot');
  var ring = document.getElementById('cur-ring');
  var mx = window.innerWidth  / 2;
  var my = window.innerHeight / 2;
  var rx = mx;
  var ry = my;

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
  });

  function cursorLoop() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    dot.style.transform  = 'translate(calc(' + mx + 'px - 50%), calc(' + my + 'px - 50%))';
    ring.style.transform = 'translate(calc(' + rx + 'px - 50%), calc(' + ry + 'px - 50%))';
    requestAnimationFrame(cursorLoop);
  }
  cursorLoop();

  /* Hover enlargement */
  var hoverTargets = document.querySelectorAll('a, button, .pcard, .filter-tab');
  hoverTargets.forEach(function (el) {
    el.addEventListener('mouseenter', function () { document.body.classList.add('hov'); });
    el.addEventListener('mouseleave', function () { document.body.classList.remove('hov'); });
  });


  /* ----------------------------------------------------------
     2. NAV — add .scrolled class after 50px
     ---------------------------------------------------------- */
  var nav = document.getElementById('main-nav');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });


  /* ----------------------------------------------------------
     3. SCROLL FADE-IN
     ---------------------------------------------------------- */
  var fadeEls = document.querySelectorAll('.fade-in');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(function (el) {
    observer.observe(el);
  });


  /* ----------------------------------------------------------
     4. PORTFOLIO FILTER
     ---------------------------------------------------------- */
  var filterTabs  = document.querySelectorAll('.filter-tab');
  var portfolioCards = document.querySelectorAll('.pcard');

  filterTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var cat = tab.dataset.filter;

      /* Update active tab */
      filterTabs.forEach(function (t) { t.classList.remove('is-active'); });
      tab.classList.add('is-active');

      /* Show / hide cards */
      portfolioCards.forEach(function (card) {
        var match = cat === 'all' || card.dataset.category === cat;
        card.style.transition    = 'opacity 0.35s ease, transform 0.35s ease';
        card.style.opacity       = match ? '1' : '0.1';
        card.style.transform     = match ? '' : 'scale(0.97)';
        card.style.pointerEvents = match ? '' : 'none';
      });
    });
  });


  /* ----------------------------------------------------------
     5. CONTACT FORM — basic submit handler (extend as needed)
     ---------------------------------------------------------- */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('.btn--send');
      btn.textContent = 'Sent ✓';
      btn.style.background = '#a8d434';
      setTimeout(function () {
        btn.textContent = 'Send Message →';
        btn.style.background = '';
        form.reset();
      }, 3000);
    });
  }

})();
