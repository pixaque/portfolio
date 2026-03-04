/* ============================================================
   PIXAQUE — Lightbox
   lightbox.js
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     State
     ---------------------------------------------------------- */
  var items   = [];   // Array of { image, title, category }
  var current = 0;    // Index of currently open item
  var lb      = null; // Lightbox DOM element (built once)


  /* ----------------------------------------------------------
     Build the lightbox DOM (called once on first open)
     ---------------------------------------------------------- */
  function buildDOM() {
    if (lb) return;

    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Image lightbox');
    lb.innerHTML = [
      /* Close button */
      '<button class="lightbox__close" id="lb-close" aria-label="Close lightbox">',
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none">',
          '<path d="M2 2l12 12M14 2L2 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
        '</svg>',
      '</button>',

      /* Main inner box */
      '<div class="lightbox__inner">',

        /* Prev / Next */
        '<button class="lightbox__prev" id="lb-prev" aria-label="Previous image">',
          '<svg width="16" height="16" viewBox="0 0 16 16" fill="none">',
            '<path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
          '</svg>',
        '</button>',

        '<button class="lightbox__next" id="lb-next" aria-label="Next image">',
          '<svg width="16" height="16" viewBox="0 0 16 16" fill="none">',
            '<path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
          '</svg>',
        '</button>',

        /* Stage */
        '<div class="lightbox__stage" id="lb-stage">',
          '<div class="lightbox__loader"><div class="lightbox__spinner"></div></div>',
          '<img class="lightbox__img" id="lb-img" alt="">',
        '</div>',

        /* Caption */
        '<div class="lightbox__caption">',
          '<div class="lightbox__meta">',
            '<p class="lightbox__category" id="lb-category"></p>',
            '<p class="lightbox__title"    id="lb-title"></p>',
          '</div>',
          '<p class="lightbox__counter" id="lb-counter"></p>',
        '</div>',

      '</div>',

      /* Keyboard hint */
      '<div class="lightbox__hint">',
        '<span class="lightbox__hint-key"><kbd>&#8592;</kbd><kbd>&#8594;</kbd> Navigate</span>',
        '<span class="lightbox__hint-key"><kbd>Esc</kbd> Close</span>',
      '</div>',
    ].join('');

    document.body.appendChild(lb);

    /* Events */
    document.getElementById('lb-close').addEventListener('click', close);
    document.getElementById('lb-prev').addEventListener('click', prev);
    document.getElementById('lb-next').addEventListener('click', next);

    /* Close on backdrop click */
    lb.addEventListener('click', function (e) {
      if (e.target === lb) close();
    });

    /* Keyboard */
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')    prev();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown')  next();
      if (e.key === 'Escape')                                close();
    });

    /* Add hover class for custom cursor */
    [lb.querySelector('.lightbox__close'),
     lb.querySelector('.lightbox__prev'),
     lb.querySelector('.lightbox__next')].forEach(function (el) {
      el.addEventListener('mouseenter', function () { document.body.classList.add('hov'); });
      el.addEventListener('mouseleave', function () { document.body.classList.remove('hov'); });
    });
  }


  /* ----------------------------------------------------------
     Load image into the stage
     ---------------------------------------------------------- */
  function loadImage(index) {
    var item  = items[index];
    var img   = document.getElementById('lb-img');
    var stage = document.getElementById('lb-stage');

    /* Reset */
    img.classList.remove('is-loaded');
    img.src = '';

    /* Caption */
    document.getElementById('lb-category').textContent = item.category;
    document.getElementById('lb-title').textContent    = item.title;
    document.getElementById('lb-counter').textContent  =
      (index + 1) + ' / ' + items.length;

    /* Hide/show arrows at boundaries */
    document.getElementById('lb-prev').style.opacity      = index === 0 ? '0.2' : '1';
    document.getElementById('lb-prev').style.pointerEvents = index === 0 ? 'none' : '';
    document.getElementById('lb-next').style.opacity      = index === items.length - 1 ? '0.2' : '1';
    document.getElementById('lb-next').style.pointerEvents = index === items.length - 1 ? 'none' : '';

    /* If it's a placeholder (no real image src) show a fallback */
    if (!item.image) {
      stage.style.paddingTop = '56.25%';
      img.alt = item.title;
      img.classList.add('is-loaded');
      img.style.objectFit = 'contain';
      img.src = 'data:image/svg+xml,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">' +
        '<rect width="800" height="450" fill="#111"/>' +
        '<text x="400" y="200" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#333" letter-spacing="4" text-transform="uppercase">NO IMAGE YET</text>' +
        '<text x="400" y="230" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#2a2a2a">' + item.title + '</text>' +
        '</svg>'
      );
      return;
    }

    /* Load real image */
    var tempImg = new Image();
    tempImg.onload = function () {
      /* Set aspect ratio from real image */
      var ratio = (tempImg.naturalHeight / tempImg.naturalWidth) * 100;
      stage.style.paddingTop = Math.min(ratio, 75) + '%'; /* cap at 4:3 */
      img.src = item.image;
      img.alt = item.title;
      img.style.objectFit = 'contain';
      img.classList.add('is-loaded');
    };
    tempImg.onerror = function () {
      img.classList.add('is-loaded');
    };
    tempImg.src = item.image;
  }


  /* ----------------------------------------------------------
     Open
     ---------------------------------------------------------- */
  function open(index) {
    buildDOM();
    current = index;
    loadImage(current);
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    /* Focus trap */
    setTimeout(function () {
      document.getElementById('lb-close').focus();
    }, 50);
  }


  /* ----------------------------------------------------------
     Close
     ---------------------------------------------------------- */
  function close() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
  }


  /* ----------------------------------------------------------
     Navigation
     ---------------------------------------------------------- */
  function prev() {
    if (current > 0) {
      current--;
      loadImage(current);
    }
  }

  function next() {
    if (current < items.length - 1) {
      current++;
      loadImage(current);
    }
  }


  /* ----------------------------------------------------------
     Collect all portfolio cards and wire up clicks
     ---------------------------------------------------------- */
  function init() {
    var cards = document.querySelectorAll('.pcard');
    items = [];

    cards.forEach(function (card, index) {
      var thumb    = card.querySelector('.pcard__thumb');
      var titleEl  = card.querySelector('.pcard__title');
      var catEl    = card.querySelector('.pcard__category');

      /* Extract background-image URL if set */
      var bgStyle  = thumb ? thumb.style.backgroundImage : '';
      var imgMatch = bgStyle.match(/url\(['"]?([^'"]+)['"]?\)/);
      var imgSrc   = imgMatch ? imgMatch[1] : '';

      items.push({
        image:    imgSrc,
        title:    titleEl    ? titleEl.textContent    : '',
        category: catEl      ? catEl.textContent      : '',
      });

      /* Make card keyboard-accessible */
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', 'View ' + (titleEl ? titleEl.textContent : 'project'));

      card.addEventListener('click', function () {
        open(index);
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(index);
        }
      });
    });
  }

  /* Run after DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
