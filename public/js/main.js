// Hethar Presence Design System - Full Spec v1.0

// Populate ALL content from COPY object (single source of truth)
function populateContent() {
  if (!window.COPY) return;
  const C = window.COPY;
  
  // Hero
  const heroH1 = document.getElementById('hero-headline');
  if (heroH1) {
    heroH1.textContent = C.heroHeadline;
    heroH1.setAttribute('data-text', C.heroHeadline);
  }
  document.getElementById('hero-sub').textContent = C.heroSub;
  document.getElementById('hero-cta-primary').textContent = 'drop your assistant →';
  document.getElementById('hero-cta-secondary').textContent = 'schedule nothing';
  
  // Interjections
  document.querySelectorAll('[data-inject-index]').forEach(el => {
    const idx = parseInt(el.getAttribute('data-inject-index'));
    if (C.interjections[idx]) el.textContent = C.interjections[idx];
  });
  
  // Contrast
  document.getElementById('contrast-head').textContent = C.contrast.head;
  const contrastGrid = document.getElementById('contrast-grid');
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
  document.getElementById('contrast-cta').textContent = C.contrast.cta;
  
  // Different
  document.getElementById('different-head').textContent = C.different.head;
  document.getElementById('different-left').textContent = C.different.left;
  document.getElementById('different-right').textContent = C.different.right;
  document.getElementById('different-kicker').textContent = C.different.kicker;
  
  // Vision (full-screen scroll lines)
  document.getElementById('vision-head').textContent = C.vision.head;
  const visionLines = document.getElementById('vision-lines');
  visionLines.innerHTML = '';
  C.vision.lines.forEach(line => {
    const div = document.createElement('div');
    div.className = 'vision-line echo';
    div.textContent = line;
    visionLines.appendChild(div);
  });
  document.getElementById('vision-closer').textContent = C.vision.closer;
  
  // Final
  document.getElementById('final-head').textContent = C.final.head;
  document.getElementById('final-cta-primary').textContent = C.final.primary;
  document.getElementById('final-cta-secondary').textContent = C.final.secondary;
  
  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();
}

populateContent();

// 0. Sound — Room tone on first entry (1s, -24 LUFS equivalent)
const playRoomTone = () => {
  if (sessionStorage.getItem('roomTonePlayed')) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Low frequency oscillator (presence hum)
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(110, audioCtx.currentTime); // Low A
    
    // Gain node (very quiet: -24 LUFS ≈ 0.063 linear gain)
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 0.1); // Fade in
    gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime + 0.9); // Hold
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.0); // Fade out
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 1.0);
    
    sessionStorage.setItem('roomTonePlayed', '1');
  } catch (e) {
    // Silent fail (autoplay blocked or AudioContext unavailable)
  }
};

// Play room tone after 400ms (with entry fade)
setTimeout(playRoomTone, 400);

// 1. Entry lock + fade (400ms delay, then 1.2s scroll lock)
document.documentElement.classList.add('no-scroll');
setTimeout(() => document.documentElement.classList.remove('no-scroll'), 1200);

// 2. Adaptive time-based copy
const slot = document.getElementById('adaptive-line');
if (slot) {
  const h = new Date().getHours();
  const C = window.COPY.timeBased;
  slot.textContent = (h >= 22 || h < 5) ? C.night : (h < 12 ? C.morning : (h < 18 ? C.afternoon : C.fallback));
}

// 3. Optional geo one-liner
if (window.__CITY && !sessionStorage.getItem('geoLineShown')) {
  const msg = window.COPY.geoOnce[window.__CITY];
  if (msg) {
    whisper(msg);
    sessionStorage.setItem('geoLineShown', '1');
  }
}

// 4. Whispers: idle / exit / seeking (exact spec timing: 1600ms fade)
let idle;
const whisper = (msg) => {
  const w = document.createElement('div');
  w.className = 'whisper';
  w.textContent = msg;
  document.body.appendChild(w);
  requestAnimationFrame(() => w.classList.add('on'));
  setTimeout(() => w.classList.remove('on'), 1600);
  setTimeout(() => w.remove(), 2000);
};

const resetIdle = () => {
  clearTimeout(idle);
  idle = setTimeout(() => whisper('you paused. i noticed.'), 4000);
};

['mousemove', 'keydown', 'scroll', 'touchstart'].forEach(ev => window.addEventListener(ev, resetIdle, { passive: true }));
resetIdle();

let scrollHistory = 0, lastY = window.scrollY;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (Math.sign(y - lastY) !== Math.sign(scrollHistory)) scrollHistory++;
  if (scrollHistory > 4) {
    whisper('looking for the point? here: presence > prompts.');
    scrollHistory = 0;
  }
  lastY = y;
}, { passive: true });

window.addEventListener('mouseout', e => {
  if (e.relatedTarget === null) whisper('don\'t worry. i keep going.');
});

// 5. Anticipation (pre-hover nudge) - 80ms timing
const anticipate = (el, r = 40) => {
  const b = () => el.getBoundingClientRect();
  let armed = false;
  window.addEventListener('mousemove', e => {
    const R = b();
    const inZone = e.clientX > R.left - r && e.clientX < R.right + r && e.clientY > R.top - r && e.clientY < R.bottom + r;
    if (inZone && !armed) {
      armed = true;
      el.style.transition = 'transform 0.08s cubic-bezier(.22,.61,.36,1)';
      el.style.transform = 'translateY(-1px)';
    }
    if (!inZone && armed) {
      armed = false;
      el.style.transform = 'translateY(0)';
    }
  }, { passive: true });
};

setTimeout(() => {
  document.querySelectorAll('.btn, a').forEach(anticipate);
}, 100);

// 6. Echo cursor lag (120-180ms lag via 0.08 lerp factor) - opacity 0.08
const echoEls = [...document.querySelectorAll('.echo')];
let targetX = 0, targetY = 0, echoX = 0, echoY = 0;

window.addEventListener('mousemove', e => {
  targetX = e.clientX;
  targetY = e.clientY;
}, { passive: true });

const tick = () => {
  // 0.08 lerp factor creates ~150ms lag at 60fps
  echoX += (targetX - echoX) * 0.08;
  echoY += (targetY - echoY) * 0.08;
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
  echoEls.forEach(el => {
    el.style.textShadow = 'none';
  });
}

// 8. Event hooks (analytics-ready, no trackers)
window.dataLayer = window.dataLayer || [];
const track = (event, payload = {}) => window.dataLayer.push({ event, ...payload, ts: Date.now() });
setTimeout(() => {
  document.querySelectorAll('.btn').forEach(b => b.addEventListener('click', () => track('cta_click', { label: b.textContent.trim() })));
}, 200);
