// Hethar Main Behaviors

// Analytics-ready event hooks (no trackers)
window.dataLayer = window.dataLayer || [];
const track = (event, payload = {}) => {
  window.dataLayer.push({ event, ...payload, ts: Date.now() });
};

// Populate ALL content from COPY object (single source of truth)
function populateContent() {
  if (!window.COPY) {
    console.error('COPY object not loaded');
    return;
  }
  
  const C = window.COPY;
  
  // Hero
  const heroH1 = document.getElementById('hero-headline');
  if (heroH1) {
    heroH1.textContent = C.heroHeadline;
    heroH1.setAttribute('data-text', C.heroHeadline);
  }
  
  const heroSub = document.getElementById('hero-sub');
  if (heroSub) heroSub.textContent = C.heroSub;
  
  const heroPrimary = document.getElementById('hero-cta-primary');
  if (heroPrimary) heroPrimary.textContent = 'drop your assistant →';
  
  const heroSecondary = document.getElementById('hero-cta-secondary');
  if (heroSecondary) heroSecondary.textContent = 'schedule nothing';
  
  // Interjections
  document.querySelectorAll('[data-inject-index]').forEach(el => {
    const idx = parseInt(el.getAttribute('data-inject-index'));
    if (C.interjections[idx]) {
      el.textContent = C.interjections[idx];
    }
  });
  
  // Contrast
  const contrastHead = document.getElementById('contrast-head');
  if (contrastHead) contrastHead.textContent = C.contrast.head;
  
  const contrastGrid = document.getElementById('contrast-grid');
  if (contrastGrid) {
    contrastGrid.innerHTML = '';
    C.contrast.lines.forEach(line => {
      const div = document.createElement('div');
      div.className = 'contrast-item';
      const p = document.createElement('p');
      p.className = 'statement';
      p.textContent = line;
      div.appendChild(p);
      contrastGrid.appendChild(div);
    });
  }
  
  const contrastCTA = document.getElementById('contrast-cta');
  if (contrastCTA) contrastCTA.textContent = C.contrast.cta;
  
  // Different
  const differentHead = document.getElementById('different-head');
  if (differentHead) differentHead.textContent = C.different.head;
  
  const differentLeft = document.getElementById('different-left');
  if (differentLeft) differentLeft.textContent = C.different.left;
  
  const differentRight = document.getElementById('different-right');
  if (differentRight) differentRight.textContent = C.different.right;
  
  const differentKicker = document.getElementById('different-kicker');
  if (differentKicker) differentKicker.textContent = C.different.kicker;
  
  // Vision
  const visionHead = document.getElementById('vision-head');
  if (visionHead) visionHead.textContent = C.vision.head;
  
  const visionLines = document.getElementById('vision-lines');
  if (visionLines) {
    visionLines.innerHTML = '';
    C.vision.lines.forEach(line => {
      const p = document.createElement('p');
      p.className = 'vision-line';
      p.textContent = line;
      visionLines.appendChild(p);
    });
  }
  
  const visionCloser = document.getElementById('vision-closer');
  if (visionCloser) visionCloser.textContent = C.vision.closer;
  
  // Final
  const finalHead = document.getElementById('final-head');
  if (finalHead) finalHead.textContent = C.final.head;
  
  const finalPrimary = document.getElementById('final-cta-primary');
  if (finalPrimary) finalPrimary.textContent = C.final.primary;
  
  const finalSecondary = document.getElementById('final-cta-secondary');
  if (finalSecondary) finalSecondary.textContent = C.final.secondary;
}

// Populate content immediately
populateContent();

// 1. Entry lock + fade
document.documentElement.classList.add('no-scroll');
setTimeout(() => {
  document.documentElement.classList.remove('no-scroll');
}, 1200);

// 2. Adaptive time-based copy
const slot = document.getElementById('adaptive-line');
if (slot && window.COPY) {
  const h = new Date().getHours();
  const C = window.COPY.timeBased;
  slot.textContent = (h >= 22 || h < 5) ? C.night : (h < 12 ? C.morning : (h < 18 ? C.afternoon : C.fallback));
}

// 3. Optional geo one-liner
if (window.__CITY && !sessionStorage.getItem('geoLineShown') && window.COPY) {
  const msg = window.COPY.geoOnce[window.__CITY];
  if (msg) {
    setTimeout(() => {
      whisper(msg);
      sessionStorage.setItem('geoLineShown', '1');
    }, 2000);
  }
}

// 4. Whispers: idle / exit / seeking
let idle;
const whisper = (msg) => {
  const w = document.createElement('div');
  w.className = 'whisper';
  w.textContent = msg;
  document.body.appendChild(w);
  requestAnimationFrame(() => w.classList.add('on'));
  setTimeout(() => w.classList.remove('on'), 1400);
  setTimeout(() => w.remove(), 2000);
};

const resetIdle = () => {
  clearTimeout(idle);
  idle = setTimeout(() => whisper('you paused. i noticed.'), 4000);
};

['mousemove', 'keydown', 'scroll', 'touchstart'].forEach(ev =>
  window.addEventListener(ev, resetIdle, { passive: true })
);
resetIdle();

// Scroll seeking detection
let scrollHistory = 0;
let lastY = window.scrollY;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (Math.sign(y - lastY) !== Math.sign(scrollHistory)) {
    scrollHistory++;
  }
  if (scrollHistory > 4) {
    whisper('looking for the point? here: presence > prompts.');
    scrollHistory = 0;
  }
  lastY = y;
}, { passive: true });

// Exit intent
window.addEventListener('mouseout', e => {
  if (e.relatedTarget === null && e.clientY < 10) {
    whisper('don't worry. i keep going.');
  }
});

// 5. Anticipation (pre-hover nudge)
const anticipate = (el, r = 40) => {
  const b = () => el.getBoundingClientRect();
  let armed = false;
  
  window.addEventListener('mousemove', e => {
    const R = b();
    const inZone = e.clientX > R.left - r && e.clientX < R.right + r &&
                   e.clientY > R.top - r && e.clientY < R.bottom + r;
    
    if (inZone && !armed) {
      armed = true;
      el.style.transform = 'translateY(-1px)';
    }
    if (!inZone && armed) {
      armed = false;
      el.style.transform = 'translateY(0)';
    }
  }, { passive: true });
};

// Apply anticipation after content is loaded
setTimeout(() => {
  document.querySelectorAll('.btn, a').forEach(anticipate);
}, 100);

// 6. Echo cursor lag (for .echo headlines)
const echoEls = [...document.querySelectorAll('.echo')];
let targetX = 0, targetY = 0, echoX = 0, echoY = 0;

window.addEventListener('mousemove', e => {
  targetX = e.clientX;
  targetY = e.clientY;
}, { passive: true });

const tick = () => {
  echoX += (targetX - echoX) * 0.12;
  echoY += (targetY - echoY) * 0.12;
  const dx = Math.round((echoX - window.innerWidth / 2) / 400);
  const dy = Math.round((echoY - window.innerHeight / 2) / 400);
  echoEls.forEach(el => {
    el.style.textShadow = `${dx}px ${dy}px 0 rgba(255,255,255,.08)`;
  });
  requestAnimationFrame(tick);
};
tick();

// 7. Reduced motion guard
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReduced) {
  document.documentElement.classList.add('reduced');
  // Additional cleanup if needed
  echoEls.forEach(el => {
    el.style.textShadow = 'none';
  });
}

// 8. Event hooks (analytics-ready)
setTimeout(() => {
  document.querySelectorAll('.btn').forEach(b =>
    b.addEventListener('click', () =>
      track('cta_click', { label: b.textContent.trim() })
    )
  );
}, 200);

// Set current year in footer
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
