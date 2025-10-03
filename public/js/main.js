// Hethar Main Behaviors

// Analytics-ready event hooks (no trackers)
window.dataLayer = window.dataLayer || [];
const track = (event, payload = {}) => {
  window.dataLayer.push({ event, ...payload, ts: Date.now() });
};

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

document.querySelectorAll('.btn, a').forEach(anticipate);

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
document.querySelectorAll('.btn').forEach(b =>
  b.addEventListener('click', () =>
    track('cta_click', { label: b.textContent.trim() })
  )
);

// Set current year in footer
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

