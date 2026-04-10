/* ============================================================
   OUTDOOR GRILL SALES — nav.js
   ============================================================ */

/* ─────────────────────────────────────────────
   NAV SCROLL BEHAVIOR
   ───────────────────────────────────────────── */
function initNavScroll() {
  const nav = document.querySelector('nav');
  const progressBar = document.getElementById('progress-bar');
  const backTop = document.getElementById('back-top');

  if (!nav) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.body.scrollHeight - window.innerHeight;

    if (scrolled > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    if (progressBar) {
      progressBar.style.width = (scrolled / total * 100) + '%';
    }

    if (backTop) {
      backTop.classList.toggle('visible', scrolled > 400);
    }
  });
}

/* ─────────────────────────────────────────────
   HAMBURGER MENU
   ───────────────────────────────────────────── */
function initHamburger() {
  const hamburger = document.getElementById('nav-hamburger');
  const drawer = document.getElementById('nav-drawer');

  if (!hamburger || !drawer) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('open');
    if (isOpen) {
      hamburger.classList.remove('open');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    } else {
      hamburger.classList.add('open');
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hamburger.classList.remove('open');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ─────────────────────────────────────────────
   ACTIVE NAV LINK
   ───────────────────────────────────────────── */
function initActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPage = href.split('/').pop();
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ─────────────────────────────────────────────
   SCROLL REVEAL
   ───────────────────────────────────────────── */
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => io.observe(el));
}

/* ─────────────────────────────────────────────
   BACK TO TOP
   ───────────────────────────────────────────── */
function initBackTop() {
  const btn = document.getElementById('back-top');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ─────────────────────────────────────────────
   REVIEWS CAROUSEL
   ───────────────────────────────────────────── */
function initReviewsCarousel() {
  const track = document.getElementById('reviews-track');
  const dots = document.querySelectorAll('.reviews-carousel-dot');
  if (!track) return;

  const cards = track.querySelectorAll('.review-card');
  const total = cards.length;
  let current = 0;
  let autoTimer = setInterval(next, 5500);

  function goTo(n) {
    current = (n + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 5500);
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  document.getElementById('reviews-next')?.addEventListener('click', next);
  document.getElementById('reviews-prev')?.addEventListener('click', prev);
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
  });
}

/* ─────────────────────────────────────────────
   INIT ALL
   ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initHamburger();
  initActiveNav();
  initReveal();
  initBackTop();
  initReviewsCarousel();
});
