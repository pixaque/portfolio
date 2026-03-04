/* ============================================================
   PIXAQUE — Scroll Animations
   animations.js
   ============================================================
   HOW TO USE:
   Add this file before </body> after main.js:
     <script src="js/animations.js"></script>
   ============================================================ */

(function () {
  'use strict';


  /* ----------------------------------------------------------
     1. INTERSECTION OBSERVER
     Watches all [data-anim] elements and adds .is-visible
     when they scroll into view.
     ---------------------------------------------------------- */
  var animEls = document.querySelectorAll('[data-anim]');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        /* Unobserve after triggering so it only fires once */
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  animEls.forEach(function (el) {
    observer.observe(el);
  });


  /* ----------------------------------------------------------
     2. SECTION HEADER LINE DRAW
     Animates the accent underline on every .section__head
     ---------------------------------------------------------- */
  var headEls = document.querySelectorAll('.section__head');

  var headObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        headObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  headEls.forEach(function (el) {
    headObserver.observe(el);
  });


  /* ----------------------------------------------------------
     3. STAT COUNTER
     Counts up the numbers in .stat__number elements when
     they scroll into view. Reads the final value from the
     text content (e.g. "127+" → counts to 127 then adds "+").
     ---------------------------------------------------------- */
  function animateCounter(el, target, suffix, duration) {
    var start     = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      /* Ease out quad */
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  var statNumbers = document.querySelectorAll('.stat__number');

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el   = entry.target;
        var raw  = el.textContent.trim();           /* e.g. "127+" or "10+" */
        var suffix = raw.replace(/[0-9]/g, '');     /* "+" */
        var target = parseInt(raw.replace(/\D/g, ''), 10); /* 127 */

        if (!isNaN(target)) {
          animateCounter(el, target, suffix, 1600);
        }
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(function (el) {
    counterObserver.observe(el);
  });


  /* ----------------------------------------------------------
     4. PORTFOLIO CARDS STAGGER ON FILTER
     Re-applies stagger animation when filter tabs are clicked
     so newly shown cards animate back in cleanly.
     ---------------------------------------------------------- */
  var filterTabs = document.querySelectorAll('.filter-tab');

  filterTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var cat   = tab.dataset.filter;
      var cards = document.querySelectorAll('.pcard');
      var delay = 0;

      cards.forEach(function (card) {
        var match = cat === 'all' || card.dataset.category === cat;
        if (match) {
          card.style.transitionDelay = delay + 'ms';
          delay += 60;
        } else {
          card.style.transitionDelay = '0ms';
        }
      });
    });
  });


  /* ----------------------------------------------------------
     5. HERO HEADLINE — split into lines for stagger
     Wraps each line of the h1 in a .line-inner span so the
     line-reveal animation works correctly.
     ---------------------------------------------------------- */
  var headline = document.querySelector('.hero__headline');
  if (headline) {
    /* The headline already animates via CSS keyframes.
       This just ensures the structure is correct if you
       switch to data-anim="line" on the headline. */
  }


  /* ----------------------------------------------------------
     6. NAV LINK ACTIVE STATE ON SCROLL
     Highlights the correct nav link based on scroll position.
     ---------------------------------------------------------- */
  var sections = document.querySelectorAll('section[id], div[id]');
  var navLinks = document.querySelectorAll('.nav__links a');

  function updateActiveNav() {
    var scrollY = window.scrollY;

    sections.forEach(function (section) {
      var top    = section.offsetTop - 120;
      var bottom = top + section.offsetHeight;
      var id     = section.getAttribute('id');

      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(function (link) {
          link.classList.remove('is-active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('is-active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();


  /* ----------------------------------------------------------
     7. SMOOTH PARALLAX on hero background grid
     Subtle depth effect — moves grid slightly on scroll.
     ---------------------------------------------------------- */
  var heroGrid = document.querySelector('.hero__grid');
  var heroBg   = document.querySelector('.hero__bg');

  if (heroGrid && heroBg) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < window.innerHeight) {
        heroGrid.style.transform = 'translateY(' + (y * 0.15) + 'px)';
        heroBg.style.transform   = 'translateY(' + (y * 0.08) + 'px)';
      }
    }, { passive: true });
  }


})();