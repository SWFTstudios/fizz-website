let carouselObserver = null;
let carouselTriggers = [];
let carouselHandlers = [];

function destroyScrollCarousel() {
  carouselObserver?.kill();
  carouselObserver = null;
  carouselTriggers.forEach((t) => t.kill());
  carouselTriggers = [];
  carouselHandlers.forEach(({ el, type, fn }) => el.removeEventListener(type, fn));
  carouselHandlers = [];
}

function bind(el, type, fn) {
  if (!el) return;
  el.addEventListener(type, fn);
  carouselHandlers.push({ el, type, fn });
}

function initScrollCarousel() {
  destroyScrollCarousel();
  const component = document.querySelector('[data-carousel="component"]');
  if (!component) return;

  const wrap = component.querySelector('[data-carousel="wrap"]');
  const ring = component.querySelector('[data-carousel="ring"]');
  const items = [...component.querySelectorAll('[data-carousel="item"]')];
  const prevBtn = component.querySelector('[data-carousel="prev"]');
  const nextBtn = component.querySelector('[data-carousel="next"]');
  const labelEl = component.querySelector('[data-carousel="label"]');
  const currentEl = component.querySelector('.c3d-current');
  if (!wrap || !ring || !items.length) return;

  const n = items.length;
  const rotateAmount = 360 / n;
  const itemWidth = items[0].offsetWidth;
  const halfAngle = (rotateAmount / 2) * (Math.PI / 180);
  const zTranslate = 2 * Math.tan(halfAngle);
  const radius = Math.round(itemWidth / zTranslate);
  const perspective = radius * 2.4;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  wrap.style.perspective = `${perspective}px`;
  items.forEach((item, i) => {
    item.style.transform = `rotateY(${rotateAmount * i}deg) translateZ(${radius}px)`;
  });

  let activeIdx = 0;
  let animating = false;

  function setActive(idx) {
    const i = ((idx % n) + n) % n;
    activeIdx = i;
    items.forEach((item, j) => item.classList.toggle('is-active', j === i));
    if (labelEl) labelEl.textContent = items[i].dataset.name || '';
    if (currentEl) currentEl.textContent = String(i + 1).padStart(2, '0');
  }

  function goToIndex(idx) {
    if (animating) return;
    const i = ((idx % n) + n) % n;
    animating = true;
    setActive(i);
    const targetRotation = -(i * rotateAmount);
    gsap.to(ring, {
      rotateY: targetRotation,
      duration: reducedMotion ? 0 : 0.6,
      ease: 'power3.out',
      onComplete: () => {
        animating = false;
      },
    });
  }

  function stepForward() {
    goToIndex(activeIdx + 1);
  }
  function stepBackward() {
    goToIndex(activeIdx - 1);
  }

  bind(prevBtn, 'click', stepBackward);
  bind(nextBtn, 'click', stepForward);

  if (typeof Observer !== 'undefined') {
    carouselObserver = Observer.create({
      target: component,
      type: 'touch,pointer',
      lockAxis: true,
      tolerance: 14,
      preventDefault: false,
      onLeft: stepForward,
      onRight: stepBackward,
    });
  }

  bind(document, 'keydown', (event) => {
    if (!component.matches(':hover')) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      stepBackward();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      stepForward();
    } else if (event.key === 'Enter') {
      const item = items[activeIdx];
      if (item) {
        const href = item.dataset.href;
        if (href) carouselExpandNavigate(item, href);
      }
    }
  });

  items.forEach((item, i) => {
    bind(item, 'click', () => {
      if (i !== activeIdx) {
        goToIndex(i);
        return;
      }
      const href = item.dataset.href;
      if (href) carouselExpandNavigate(item, href);
    });
  });

  setActive(0);
  gsap.set(ring, { rotateY: 0 });
}

function carouselExpandNavigate(item, href) {
  const overlay = document.getElementById('carousel-expand-overlay');
  if (!overlay || !window.barba) return;

  const source = item.querySelector('[data-carousel="image"]') || item;
  const state = typeof Flip !== 'undefined' ? Flip.getState(source) : null;
  const sourceBg = item.querySelector('[data-carousel="bg"]');
  const gradient = item.dataset.gradient || sourceBg?.style?.background || 'linear-gradient(135deg,#10b981,#34d399)';
  const imageMarkup = source.innerHTML;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  overlay.innerHTML = `<div class="carousel-card" style="border-radius:20px;background:${gradient};">${imageMarkup}</div>`;
  overlay.style.display = 'block';
  overlay.style.opacity = '1';
  overlay.style.inset = '0';
  overlay.style.pointerEvents = 'none';

  const overlayCard = overlay.firstElementChild;
  if (!overlayCard) return;
  source.parentElement?.appendChild(overlayCard);

  try {
    sessionStorage.setItem('fizz-gradient', gradient);
    sessionStorage.setItem('fizz-flavor', item.dataset.flavor || '');
    sessionStorage.setItem('fizz-name', item.dataset.name || '');
    sessionStorage.setItem('fizz-sub', item.dataset.sub || '');
    sessionStorage.setItem('fizz-price', item.dataset.price || '$28.00');
    sessionStorage.setItem('fizz-image-markup', imageMarkup);
  } catch (_) {}

  window.fizzIsExpandTransition = true;

  if (!state || reducedMotion) {
    overlay.appendChild(overlayCard);
    gsap.set(overlayCard, { position: 'fixed', inset: 0, borderRadius: 0 });
    barba.go(href);
    return;
  }

  overlay.appendChild(overlayCard);
  Flip.from(state, {
    duration: 0.7,
    ease: 'power3.inOut',
    absolute: true,
    onEnter: (els) => gsap.set(els, { borderRadius: 20 }),
    onComplete: () => {
      gsap.to(overlayCard, {
        borderRadius: 0,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => barba.go(href),
      });
    },
  });
}

window.initScrollCarousel = initScrollCarousel;
window.destroyScrollCarousel = destroyScrollCarousel;
window.carouselExpandNavigate = carouselExpandNavigate;
