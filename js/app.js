/* ============================================================
   Fizz — App: Barba.js + Lenis + Cursor
============================================================ */

/* ── Lenis smooth scroll ── */
let lenis;
let cursorBound = false;
function initLenis() {
  if (lenis) lenis.destroy();
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  });
  window.lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ── Custom cursor ── */
function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring || cursorBound) return;
  cursorBound = true;

  window.addEventListener('mousemove', (e) => {
    gsap.to(dot,  { x: e.clientX, y: e.clientY, duration: 0.08, ease: 'none' });
    gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.22, ease: 'power2.out' });
  });

  document.addEventListener('mousedown', () => ring.classList.add('is-down'));
  document.addEventListener('mouseup',   () => ring.classList.remove('is-down'));

  const hoverSel = 'a, button, .shop-card, .variant-btn, .c3d-dot, .filter-btn, .pp-thumb, .product-page-thumb, [data-carousel="item"]';
  document.addEventListener('mouseover', (e) => { if (e.target.closest(hoverSel)) ring.classList.add('is-hovering'); });
  document.addEventListener('mouseout',  (e) => { if (e.target.closest(hoverSel)) ring.classList.remove('is-hovering'); });
}

/* ── Hamburger nav ── */
function initNav() {
  const btn     = document.querySelector('.nav-menu-btn');
  const overlay = document.querySelector('.nav-overlay');
  if (!btn || !overlay) return;

  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);

  newBtn.addEventListener('click', () => {
    const open = overlay.classList.toggle('is-open');
    newBtn.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  overlay.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      overlay.classList.remove('is-open');
      document.querySelector('.nav-menu-btn')?.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });
}

/* ── Hero mini orbital carousel (decorative) ── */
function initHeroCarousel() {
  const track = document.querySelector('.hero-track');
  if (!track) return;
  const items  = [...track.querySelectorAll('.hero-item')];
  const n      = items.length;
  const angle  = 360 / n;
  const w      = items[0]?.offsetWidth || 110;
  const radius = Math.round((w / 2) / Math.tan(Math.PI / n));
  items.forEach((item, i) => {
    gsap.set(item, { rotateY: angle * i, transformOrigin: `50% 50% -${radius}px`, z: radius });
  });
}

/* ── Qty selector ── */
function initQty() {
  const selector = document.querySelector('.qty-selector');
  if (!selector) return;
  const val   = selector.querySelector('.qty-value');
  const minus = selector.querySelector('[data-qty="-1"]');
  const plus  = selector.querySelector('[data-qty="+1"]');
  let count   = 1;
  const update = () => { if (val) val.textContent = count; };
  minus?.addEventListener('click', () => { count = Math.max(1, count - 1); update(); });
  plus?.addEventListener('click',  () => { count = Math.min(99, count + 1); update(); });
}

/* ── Variant buttons ── */
function initVariants() {
  document.querySelectorAll('.variants, .product-page-variant-grid').forEach((group) => {
    group.querySelectorAll('.variant-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.variant-btn').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
      });
    });
  });
}

/* ── Shop filters ── */
function initShopFilters() {
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });
}

/* ── Per-page init ── */
function initPage(namespace) {
  initNav();
  initVariants();
  initQty();
  if (namespace === 'home')    initHeroCarousel();
  if (namespace === 'shop')    initShopFilters();
  initAnimations(namespace);
}

/* ================================================================
   BARBA.JS
================================================================ */
const ptPanel = document.querySelector('.pt-panel');

barba.init({
  prevent: ({ el }) => el.classList?.contains('no-barba'),
  hooks: {
    beforeLeave() {
      window.destroyScrollCarousel?.();
    },
  },

  transitions: [
    /* ── Expand transition (carousel card → product page) ── */
    {
      name: 'fizz-expand',
      custom: () => !!window.fizzIsExpandTransition,

      async leave({ current }) {
        // Overlay already covers screen; just hide old container instantly
        gsap.set(current.container, { opacity: 0 });
      },

      async enter({ next }) {
        window.scrollTo(0, 0);
        lenis?.scrollTo(0, { immediate: true });
        // Product page hero reveals over the overlay (handled in initProductPage)
        gsap.from(next.container, { opacity: 0, duration: 0.4, ease: 'power2.out' });
      },
    },

    /* ── Default fade + panel wipe ── */
    {
      name: 'fizz-fade',

      async leave({ current }) {
        await gsap.timeline()
          .to(current.container, { opacity: 0, y: -24, duration: 0.4, ease: 'power3.inOut' })
          .to(ptPanel, { scaleY: 1, duration: 0.45, ease: 'power3.inOut', transformOrigin: 'bottom' }, '-=0.15');
      },

      async enter({ next }) {
        window.scrollTo(0, 0);
        lenis?.scrollTo(0, { immediate: true });
        await gsap.timeline()
          .from(next.container, { opacity: 0, y: 24, duration: 0.5, ease: 'power3.out' })
          .to(ptPanel, { scaleY: 0, duration: 0.45, ease: 'power3.inOut', transformOrigin: 'top' }, '-=0.3');
      },
    },
  ],

  views: [
    { namespace: 'home',    afterEnter() { initPage('home'); } },
    { namespace: 'shop',    afterEnter() { initPage('shop'); } },
    { namespace: 'product', afterEnter() { initPage('product'); } },
  ],
});

/* ── Bootstrap ── */
(function bootstrap() {
  initLenis();
  initCursor();
  initNav();
  const container = document.querySelector('[data-barba="container"]');
  const ns = container?.dataset?.barbaNamespace || 'home';
  initPage(ns);
})();
