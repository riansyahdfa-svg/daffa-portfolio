/* ═══════════════════════════════════════════════════
   DAFFA PORTOFOLIO — main.js
   Semua JavaScript: animasi, efek, interaktivitas
   ═══════════════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────
   1. PAGE LOADER
   ──────────────────────────────────── */
(function Loader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('done');
      // trigger AOS after loader hides
      setTimeout(initAOS, 200);
    }, 900);
  });

  // Fallback — hide after 2.5s regardless
  setTimeout(() => {
    if (loader) loader.classList.add('done');
    setTimeout(initAOS, 200);
  }, 2500);
})();


/* ────────────────────────────────────
   2. CUSTOM CURSOR
   ──────────────────────────────────── */
(function Cursor() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  if (!cursor || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function loop() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    raf = requestAnimationFrame(loop);
  }
  loop();

  // Hover effect
  const targets = 'a, button, .kcard, .av-card, .tl-item, .data-item, .photo-rig, .stat-item';
  document.querySelectorAll(targets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hov');
      ring.classList.add('hov');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hov');
      ring.classList.remove('hov');
    });
  });

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; ring.style.opacity = '1'; });
})();


/* ────────────────────────────────────
   3. NAVBAR SCROLL
   ──────────────────────────────────── */
(function Navbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', scrollY > 50);
  }, { passive: true });
})();


/* ────────────────────────────────────
   4. HAMBURGER / MOBILE MENU
   ──────────────────────────────────── */
(function MobileMenu() {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMobile');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });

  menu.querySelectorAll('.nm-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();


/* ────────────────────────────────────
   5. SCROLL PROGRESS BAR
   ──────────────────────────────────── */
(function ProgressBar() {
  const bar = document.createElement('div');
  bar.id = 'progress-bar';
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (total > 0 ? (scrollY / total) * 100 : 0) + '%';
  }, { passive: true });
})();


/* ────────────────────────────────────
   6. AOS — Animate On Scroll
   Custom lightweight implementation
   ──────────────────────────────────── */
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseFloat(el.dataset.aosDelay || 0);
        setTimeout(() => el.classList.add('aos-animate'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}


/* ────────────────────────────────────
   7. COUNTER ANIMATION (hero stats)
   ──────────────────────────────────── */
(function CounterAnim() {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if (!counters.length) return;

  function animCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = target > 100 ? 1800 : 1000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current.toLocaleString('id');
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animCount(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => obs.observe(el));
})();


/* ────────────────────────────────────
   8. PARTICLE CANVAS
   Floating gold dots background
   ──────────────────────────────────── */
(function Particles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = window.innerWidth < 768 ? 30 : 60;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.4 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;
      this.a  = Math.random() * 0.5 + 0.08;
      this.da = (Math.random() - 0.5) * 0.002;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.a  = Math.max(0.04, Math.min(0.55, this.a + this.da));
      if (this.x < -10 || this.x > W+10 || this.y < -10 || this.y > H+10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${this.a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function frame() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });

    // Draw faint connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(201,168,76,${(1 - dist/130) * 0.06})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(frame);
  }
  frame();
})();


/* ────────────────────────────────────
   9. PAGE TRANSITION
   Smooth fade between pages
   ──────────────────────────────────── */
(function PageTransition() {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'page-overlay';
  overlay.style.opacity = '1';
  document.body.appendChild(overlay);

  // Fade in on load
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
    });
  });

  // Fade out on navigate
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#')
        || href.startsWith('mailto') || href.startsWith('tel')) return;
    if (link.hasAttribute('target')) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'all';
      setTimeout(() => { window.location.href = href; }, 480);
    });
  });
})();


/* ────────────────────────────────────
   10. ACTIVE NAV based on current page
   ──────────────────────────────────── */
(function ActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    const isActive = href === page || (page === '' && href === 'index.html');
    link.classList.toggle('active', isActive);
  });
})();


/* ────────────────────────────────────
   11. KCARD RIPPLE EFFECT (kontak)
   Mouse position ripple on hover
   ──────────────────────────────────── */
(function KcardRipple() {
  document.querySelectorAll('.kcard').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      card.style.setProperty('--rx', x + '%');
      card.style.setProperty('--ry', y + '%');
    });
  });
})();


/* ────────────────────────────────────
   12. TYPING EFFECT on hero name
   Subtle character reveal
   ──────────────────────────────────── */
(function TypingEffect() {
  const line = document.querySelector('.hh-line2');
  if (!line) return;

  const text = line.textContent.trim();
  line.textContent = '';
  line.style.opacity = '1';

  let i = 0;
  function type() {
    if (i <= text.length) {
      line.textContent = text.slice(0, i);
      i++;
      setTimeout(type, 60);
    }
  }
  // Start after loader
  setTimeout(type, 1200);
})();


/* ────────────────────────────────────
   13. PHOTO FALLBACK
   ──────────────────────────────────── */
(function PhotoFallback() {
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      this.style.display = 'none';
      // Try to show sibling fallback
      const fb = this.nextElementSibling;
      if (fb) fb.style.display = 'flex';
      // Brand init fallback
      const init = document.getElementById('brandInit');
      if (init) init.style.display = 'flex';
    });
  });
})();


/* ────────────────────────────────────
   GLOBAL HELPER
   setFoto('assets/foto.jpg') di console
   ──────────────────────────────────── */
window.setFoto = function(path) {
  document.querySelectorAll('img').forEach(img => {
    if (img.alt === 'Daffa' || img.alt === 'Muhammad Daffa Riansyah') {
      img.src = path;
      img.style.display = 'block';
      const fb = img.nextElementSibling;
      if (fb) fb.style.display = 'none';
    }
  });
  const heroImg = document.querySelector('.photo-img');
  if (heroImg) { heroImg.src = path; heroImg.style.display = 'block'; }
  console.log('%c✓ Foto dipasang: ' + path, 'color:#c9a84c');
};
