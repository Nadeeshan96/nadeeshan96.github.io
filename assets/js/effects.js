/* ==========================================================================
   Antigravity-inspired effects: starfield, cursor glow, reveal-on-scroll.
   Vanilla JS, no dependencies. All effects respect prefers-reduced-motion;
   the cursor glow is skipped on touch-only devices.
   ========================================================================== */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------- reveal on scroll -------------------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------- starfield ---------------------------------- */
  var canvas = document.getElementById('starfield');
  if (canvas && !reducedMotion) {
    var ctx = canvas.getContext('2d');
    var stars = [];
    var STAR_DENSITY = 1 / 9000; // stars per px^2
    var scrollY = 0;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      var count = Math.round(canvas.width * canvas.height * STAR_DENSITY);
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.3 + 0.3,
          depth: Math.random() * 0.6 + 0.2,     // parallax factor
          tw: Math.random() * Math.PI * 2,       // twinkle phase
          twSpeed: Math.random() * 0.015 + 0.004,
          vx: (Math.random() - 0.5) * 0.05,
          vy: (Math.random() - 0.5) * 0.05
        });
      }
    }

    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.tw += s.twSpeed;
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x += canvas.width;
        if (s.x > canvas.width) s.x -= canvas.width;
        if (s.y < 0) s.y += canvas.height;
        if (s.y > canvas.height) s.y -= canvas.height;
        var y = s.y - ((scrollY * s.depth * 0.15) % canvas.height);
        if (y < 0) y += canvas.height;
        var alpha = 0.35 + 0.4 * Math.abs(Math.sin(s.tw));
        ctx.beginPath();
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(214, 220, 255, ' + alpha.toFixed(3) + ')';
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', function () { scrollY = window.scrollY; }, { passive: true });
    resize();
    requestAnimationFrame(frame);
  } else if (canvas && reducedMotion) {
    // static stars, drawn once
    var sctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var n = Math.round(canvas.width * canvas.height / 9000);
    for (var j = 0; j < n; j++) {
      sctx.beginPath();
      sctx.arc(Math.random() * canvas.width, Math.random() * canvas.height,
               Math.random() * 1.3 + 0.3, 0, Math.PI * 2);
      sctx.fillStyle = 'rgba(214, 220, 255, 0.5)';
      sctx.fill();
    }
  }

  /* ------------------------- cursor glow -------------------------------- */
  var glow = document.getElementById('cursor-glow');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (glow && finePointer && !reducedMotion) {
    var targetX = window.innerWidth / 2;
    var targetY = window.innerHeight / 2;
    var curX = targetX;
    var curY = targetY;
    var active = false;

    document.addEventListener('mousemove', function (e) {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!active) {
        active = true;
        document.body.classList.add('has-cursor');
      }
    });
    document.addEventListener('mouseleave', function () {
      document.body.classList.remove('has-cursor');
      active = false;
    });

    (function glowFrame() {
      // ease toward the pointer for a floating, weightless trail
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      glow.style.transform = 'translate(' + curX.toFixed(1) + 'px, ' + curY.toFixed(1) + 'px)';
      requestAnimationFrame(glowFrame);
    })();
  }
})();
