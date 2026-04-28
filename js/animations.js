/* ============================================================
   Fizz — Scroll & page animations (GSAP + ScrollTrigger)
============================================================ */

/* ── Hero entrance ── */
function initHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-eyebrow',     { opacity: 0, y: 20, duration: 0.7 }, 0.3)
    .from('.hero-title',       { opacity: 0, y: 60, duration: 0.9 }, 0.5)
    .from('.hero-sub',         { opacity: 0, y: 30, duration: 0.7 }, 0.75)
    .from('.hero-cta .btn',    { opacity: 0, y: 20, stagger: 0.1,  duration: 0.6 }, 0.9)
    .from('.hero-stage',       { opacity: 0, y: 40, duration: 0.8 }, 0.6)
    .from('.scroll-indicator', { opacity: 0, y: 12, duration: 0.6 }, 1.2);

  gsap.to('.hero-ghost-title', {
    y: '-18%', ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
  });
  gsap.to('.hero-stage', {
    y: '12%', ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2 },
  });
}

/* ── Generic reveals ── */
function initReveal() {
  gsap.utils.toArray('.reveal-up').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
    );
  });
  gsap.utils.toArray('.reveal-fade').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true } }
    );
  });
}

/* ── Content split sections ── */
function initContentSplits() {
  document.querySelectorAll('.content-split').forEach((section) => {
    const media = section.querySelector('.cs-media-inner');
    const text  = section.querySelector('.cs-text');
    if (!media || !text) return;
    const isReverse = section.classList.contains('reverse');
    const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 75%', once: true } });
    tl.fromTo(media,
      { opacity: 0, x: isReverse ? 60 : -60 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
    ).fromTo(text.querySelectorAll('.eyebrow, h2, p, .btn'),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.12, duration: 0.75, ease: 'power3.out' },
      '-=0.6'
    );
  });
}

/* ── Product preview ── */
function initProductPreview() {
  const section = document.querySelector('.product-preview');
  if (!section) return;
  const visual = section.querySelector('.pp-visual');
  const info   = section.querySelector('.pp-info');
  if (visual) {
    gsap.fromTo(visual, { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 75%', once: true } });
  }
  if (info) {
    gsap.fromTo([...info.children], { opacity: 0, y: 35 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 75%', once: true } });
  }
}

/* ── Shop grid stagger ── */
function initShopGrid() {
  const cards = document.querySelectorAll('.shop-card');
  if (!cards.length) return;
  gsap.fromTo(cards,
    { opacity: 0, y: 50, scale: 0.95 },
    { opacity: 1, y: 0, scale: 1, stagger: { amount: 0.6 },
      duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.shop-grid', start: 'top 85%', once: true } }
  );
}

/* ── Product page: hero entry from expand overlay ── */
function initProductPage() {
  const overlay = document.getElementById('carousel-expand-overlay');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Read transition data from sessionStorage
  let gradient = null;
  let name     = 'Tropical Storm';
  let sub      = 'Pineapple · Coconut · Passionfruit';
  let flavor   = 'tropical';
  let price    = '$34.00';
  let imageMarkup = '';

  try {
    gradient = sessionStorage.getItem('fizz-gradient');
    name     = sessionStorage.getItem('fizz-name')  || name;
    sub      = sessionStorage.getItem('fizz-sub')   || sub;
    flavor   = sessionStorage.getItem('fizz-flavor')|| flavor;
    price    = sessionStorage.getItem('fizz-price') || price;
    imageMarkup = sessionStorage.getItem('fizz-image-markup') || '';
  } catch (_) {}

  /* ── Populate hero with flavor data ── */
  const heroBg      = document.querySelector('.product-page-hero-bg');
  const heroTitle   = document.getElementById('hero-title');
  const heroEyebrow = document.getElementById('hero-eyebrow');
  const heroSub     = document.getElementById('hero-sub');
  const heroBotEl   = document.getElementById('hero-bottle');
  const infoTitle   = document.getElementById('info-title');
  const infoEyebrow = document.getElementById('info-eyebrow');
  const infoPrice   = document.getElementById('info-price');
  const infoDesc    = document.getElementById('info-desc');
  const variantGrid = document.getElementById('variant-grid');
  const mainImg     = document.getElementById('product-main-img');

  // Flavor data map
  const FLAVORS = {
    citrus:      { name:'Citrus Burst',      sub:'Valencia Orange · Yuzu · Lemon',        gradient:'linear-gradient(135deg,#f59e0b,#fde68a)', svgFill:'#f59e0b', capFill:'#d97706', price:'$28.00', desc:'A sharp-sweet citrus trio engineered to keep your senses alert. PressCap™ lock keeps every bubble where it belongs.' },
    berry:       { name:'Berry Blast',       sub:'Blueberry · Açaí · Blackcurrant',       gradient:'linear-gradient(135deg,#7c3aed,#c4b5fd)', svgFill:'#8b5cf6', capFill:'#6d28d9', price:'$28.00', desc:'Antioxidant-packed and effervescent. Our best-seller for good reason.' },
    tropical:    { name:'Tropical Storm',    sub:'Pineapple · Coconut · Passionfruit',    gradient:'linear-gradient(135deg,#059669,#6ee7b7)', svgFill:'#10b981', capFill:'#047857', price:'$34.00', desc:'Pineapple, coconut, and passionfruit collide in this sun-drenched blend. Zero sugar. Maximum refresh.' },
    cherry:      { name:'Cherry Pop',        sub:'Black Cherry · Hibiscus · Rose',        gradient:'linear-gradient(135deg,#e11d48,#fda4af)', svgFill:'#f43f5e', capFill:'#be123c', price:'$28.00', desc:'Tart black cherry meets floral hibiscus for a bold, romantic sip.' },
    watermelon:  { name:'Watermelon Wave',   sub:'Watermelon · Mint · Lime',              gradient:'linear-gradient(135deg,#db2777,#fbcfe8)', svgFill:'#ec4899', capFill:'#9d174d', price:'$32.00', desc:'Limited-run summer legend. Watermelon sweetness cut with Arctic mint and lime.' },
    mango:       { name:'Mango Tango',       sub:'Alphonso Mango · Chilli · Tajín',       gradient:'linear-gradient(135deg,#ea580c,#fed7aa)', svgFill:'#f97316', capFill:'#c2410c', price:'$28.00', desc:'Sweet Alphonso mango with a slow chilli burn finish. Not for the faint-hearted.' },
  };

  const data = FLAVORS[flavor] || FLAVORS.tropical;
  const grad = gradient || data.gradient;
  const transitionImage = imageMarkup || buildBottleSVG(data.svgFill, data.capFill, 200);

  if (heroBg)      heroBg.style.background    = grad;
  if (heroTitle)   heroTitle.textContent       = data.name;
  if (heroEyebrow) heroEyebrow.textContent     = 'Signature Flavour';
  if (heroSub)     heroSub.textContent         = data.sub;
  if (infoTitle)   infoTitle.textContent       = data.name;
  if (infoEyebrow) infoEyebrow.textContent     = 'Signature Flavour';
  if (infoPrice)   infoPrice.textContent       = data.price;
  if (infoDesc)    infoDesc.textContent        = data.desc;

  // Build bottle SVG
  if (heroBotEl) heroBotEl.innerHTML = transitionImage;
  if (mainImg)   mainImg.innerHTML   = transitionImage + `<style>
    #product-main-img svg { width:260px; height:auto; position:relative; z-index:1;
      filter:drop-shadow(0 40px 80px rgba(0,0,0,.6)); }
  </style>`;

  // Variant grid
  if (variantGrid) {
    const variants = Object.entries(FLAVORS).map(([key, f]) => `
      <button class="variant-btn ${key === flavor ? 'is-active' : ''}" aria-label="${f.name}" data-flavor="${key}">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="100" height="100" rx="12" fill="${f.svgFill}"/>
        </svg>
      </button>
    `).join('');
    variantGrid.innerHTML = variants;
    variantGrid.querySelectorAll('.variant-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        variantGrid.querySelectorAll('.variant-btn').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
      });
    });
  }

  /* ── Overlay → hero reveal ── */
  if (overlay && overlay.style.display !== 'none' && window.fizzIsExpandTransition) {
    window.fizzIsExpandTransition = false;
    // Overlay is fullscreen same color as hero — fade it away
    gsap.to(overlay, {
      opacity: 0,
      duration: reducedMotion ? 0 : 0.55,
      ease: 'power2.out',
      delay: reducedMotion ? 0 : 0.15,
      onComplete: () => {
        overlay.style.display = 'none';
        overlay.innerHTML = '';
        overlay.style.opacity = '1';
      },
    });
  }

  // Hero content entrance
  const heroContent = document.querySelector('.product-page-hero-content');
  if (heroContent) {
    gsap.fromTo([...heroContent.children],
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, stagger: 0.12, duration: reducedMotion ? 0.01 : 0.8, ease: 'power3.out', delay: reducedMotion ? 0 : 0.3 }
    );
  }

  // Bottle float animation
  const bottleInHero = document.querySelector('.product-page-hero-bottle svg');
  if (bottleInHero) {
    if (!reducedMotion) {
      gsap.to(bottleInHero, { y: -14, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }
  }

  // Page info entrance
  gsap.fromTo(
    document.querySelectorAll('.product-page-info > *'),
    { opacity: 0, y: 28 },
    { opacity: 1, y: 0, stagger: 0.08, duration: reducedMotion ? 0.01 : 0.65, ease: 'power3.out', delay: reducedMotion ? 0 : 0.45, scrollTrigger: { trigger: '.product-page-wrap', start: 'top 80%', once: true } }
  );

  // Clean up sessionStorage
  try { ['fizz-gradient','fizz-flavor','fizz-name','fizz-sub','fizz-price','fizz-image-markup'].forEach((k) => sessionStorage.removeItem(k)); } catch (_) {}
}

/* ── Bubble generation ── */
function initBubbles() {
  const container = document.querySelector('.hero-bubbles');
  if (!container) return;
  for (let i = 0; i < 18; i++) {
    const b    = document.createElement('div');
    b.className = 'bubble';
    const size  = Math.random() * 16 + 6;
    b.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;bottom:-${size}px;--dur:${Math.random()*8+7}s;--del:${Math.random()*10}s;`;
    container.appendChild(b);
  }
}

/* ── Bottle SVG builder ── */
function buildBottleSVG(fill, capFill, width = 120) {
  return `<svg viewBox="0 0 100 180" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:${width}px;height:auto;">
    <rect x="32" y="0" width="36" height="27" rx="5" fill="${capFill}" opacity=".9"/>
    <line x1="40" y1="4" x2="40" y2="23" stroke="rgba(0,0,0,.15)" stroke-width="2"/>
    <line x1="47" y1="4" x2="47" y2="23" stroke="rgba(0,0,0,.15)" stroke-width="2"/>
    <line x1="54" y1="4" x2="54" y2="23" stroke="rgba(0,0,0,.15)" stroke-width="2"/>
    <line x1="61" y1="4" x2="61" y2="23" stroke="rgba(0,0,0,.15)" stroke-width="2"/>
    <rect x="8" y="25" width="84" height="153" rx="26" fill="${fill}"/>
    <rect x="18" y="35" width="16" height="68" rx="8" fill="rgba(255,255,255,.2)"/>
    <path d="M8 115 Q18 100 28 115 Q38 130 48 115 Q58 100 68 115 Q78 130 88 115 L92 178 8 178Z" fill="rgba(255,255,255,.12)"/>
    <circle cx="35" cy="85" r="3.5" fill="rgba(255,255,255,.2)"/>
    <circle cx="58" cy="68" r="2.5" fill="rgba(255,255,255,.15)"/>
    <circle cx="70" cy="93" r="4" fill="rgba(255,255,255,.1)"/>
  </svg>`;
}

window.buildBottleSVG = buildBottleSVG;

/* ── Master init ── */
function initAnimations(namespace) {
  ScrollTrigger.getAll().forEach((t) => t.kill());
  ScrollTrigger.refresh();

  if (namespace === 'home' || !namespace) {
    initBubbles();
    initHero();
    initContentSplits();
    initProductPreview();
    initScrollCarousel(); // scroll-driven 3D carousel
  }
  if (namespace === 'shop')    initShopGrid();
  if (namespace === 'product') initProductPage();

  initReveal();
}

window.initAnimations = initAnimations;
