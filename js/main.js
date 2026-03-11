/* ============================================================
   PIXAQUE — Asad Ullah Portfolio
   main.js
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
   1. CUSTOM CURSOR + PARTICLE TRAIL
   ---------------------------------------------------------- */
var dot  = document.getElementById('cur-dot');
var ring = document.getElementById('cur-ring');
var mx = window.innerWidth  / 2;
var my = window.innerHeight / 2;
var rx = mx;
var ry = my;

// --- Particle setup ---
var canvas = document.getElementById('particle-canvas');
var ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

var particles    = [];
var spawnTimer   = 0;
var spawnInterval = 30; // lower = more particles
var isMoving     = false;
var type = 0

function newParticle() {
  var angle = Math.random() * Math.PI * 2;
  var speed = Math.random() * 1.5;
  type = type?0:1
  particles.push({
    x:  rx,
    y:  ry,
    xv:type?18*Math.random()-9:24*Math.random()-12,
    yv:type?18*Math.random()-9:24*Math.random()-12,
    c:type?'rgb(255,'+((200*Math.random())|0)+','+((80*Math.random())|0)+')':'rgb(255,255,255)',
    s:type?5+10*Math.random():1,
    a:1
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];
    ctx.globalAlpha = p.a;
    ctx.fillStyle   = p.c;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function updateParticles(dt) {
  if (isMoving) {
    spawnTimer += dt;
    while (spawnTimer > spawnInterval) {
      newParticle();
      spawnTimer -= spawnInterval;
    }
  }

  // cap at 300 particles
  if (particles.length > 300) particles.splice(0, particles.length - 300);

  for (var i = particles.length - 1; i >= 0; i--) {
    var p = particles[i];
    p.x  += p.xv;
    p.y  += p.yv;
    p.a  *= 0.94;          // fade speed
    p.s  *= 0.98;          // shrink slightly
    if (p.a < 0.01) particles.splice(i, 1);
  }
}

// --- Cursor + particle loop ---
var lastTime = performance.now();
var movementThreshold = 2;
var prevMx = mx, prevMy = my;

document.addEventListener('mousemove', function (e) {
  mx = e.clientX;
  my = e.clientY;
});

function cursorLoop(now) {
  var dt = now - lastTime;
  lastTime = now;

  // detect meaningful movement
  var moved = Math.abs(mx - prevMx) + Math.abs(my - prevMy);
  isMoving = moved > movementThreshold;
  prevMx = mx; prevMy = my;

  // update ring position
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;

  dot.style.transform  = 'translate(calc(' + mx + 'px - 50%), calc(' + my + 'px - 50%))';
  ring.style.transform = 'translate(calc(' + rx + 'px - 50%), calc(' + ry + 'px - 50%))';

  // particles
  updateParticles(dt);
  drawParticles();

  requestAnimationFrame(cursorLoop);
}
requestAnimationFrame(cursorLoop);

/* Hover enlargement */
var hoverTargets = document.querySelectorAll('a, button, .pcard, .filter-tab');
hoverTargets.forEach(function (el) {
  el.addEventListener('mouseenter', function () { document.body.classList.add('hov'); });
  el.addEventListener('mouseleave', function () { document.body.classList.remove('hov'); });
});

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.width  = window.innerWidth  + 'px';
  canvas.style.height = window.innerHeight + 'px';
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', function () {
  setTimeout(resizeCanvas, 100);
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
     5. CONTACT FORM — Formspree integration
     Replace YOUR_FORM_ID with your actual Formspree endpoint
     e.g. https://formspree.io/f/xyzabcde
     ---------------------------------------------------------- */
  var form = document.getElementById('contact-form');

  if (form) {
    var btn        = form.querySelector('.btn--send');
    var inputs     = form.querySelectorAll('.form-input, .form-textarea');
    var ENDPOINT   = 'https://formspree.io/f/mzdjrjez';

    /* -- Inline validation helper -- */
    function showError(input, msg) {
      input.style.borderColor = '#ff4d4d';
      var err = input.parentNode.querySelector('.form-error');
      if (!err) {
        err = document.createElement('span');
        err.className = 'form-error';
        err.style.cssText = 'font-size:0.65rem;color:#ff4d4d;margin-top:4px;display:block;letter-spacing:0.06em;';
        input.parentNode.appendChild(err);
      }
      err.textContent = msg;
    }

    function clearError(input) {
      input.style.borderColor = '';
      var err = input.parentNode.querySelector('.form-error');
      if (err) err.remove();
    }

    function validateForm() {
      var valid = true;
      var nameEl    = document.getElementById('name');
      var emailEl   = document.getElementById('email');
      var messageEl = document.getElementById('message');

      clearError(nameEl);
      clearError(emailEl);
      clearError(messageEl);

      if (!nameEl.value.trim()) {
        showError(nameEl, 'Please enter your name');
        valid = false;
      }

      if (!emailEl.value.trim()) {
        showError(emailEl, 'Please enter your email');
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
        showError(emailEl, 'Please enter a valid email address');
        valid = false;
      }

      if (!messageEl.value.trim()) {
        showError(messageEl, 'Please write a message');
        valid = false;
      }

      return valid;
    }

    /* -- Clear errors on input -- */
    inputs.forEach(function (input) {
      input.addEventListener('input', function () { clearError(input); });
    });

    /* -- Submit -- */
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validateForm()) return;

      /* Loading state */
      btn.textContent  = 'Sending…';
      btn.disabled     = true;
      btn.style.opacity = '0.7';

      var data = {
        name:    document.getElementById('name').value.trim(),
        email:   document.getElementById('email').value.trim(),
        project: document.getElementById('project').value.trim(),
        message: document.getElementById('message').value.trim()
      };

      fetch(ENDPOINT, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify(data)
      })
      .then(function (res) { return res.json(); })
      .then(function (res) {
        if (res.ok || res.next) {
          /* Success */
          btn.textContent   = 'Sent ✓';
          btn.style.opacity = '1';
          btn.style.background = '#a8d434';
          form.reset();
          setTimeout(function () {
            btn.textContent      = 'Send Message →';
            btn.style.background = '';
            btn.disabled         = false;
          }, 4000);
        } else {
          throw new Error(res.error || 'Submission failed');
        }
      })
      .catch(function (err) {
        /* Error state */
        btn.textContent      = 'Failed — try again';
        btn.style.background = '#ff4d4d';
        btn.style.opacity    = '1';
        btn.disabled         = false;
        setTimeout(function () {
          btn.textContent      = 'Send Message →';
          btn.style.background = '';
        }, 4000);
        console.error('Form error:', err);
      });
    });
  }

  

})();
