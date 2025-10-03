// Hethar — Alive & Feral Implementation
// "presence as feral intelligence"

const C = window.COPY;

// ============================================
// 1. COLD OPEN (typing/deleting + echo cursor)
// ============================================

function coldOpen() {
  const overlay = document.createElement('div');
  overlay.id = 'cold-open';
  overlay.style.cssText = 'position:fixed;inset:0;background:#000;color:#fff;display:grid;place-items:center;z-index:10000;';
  
  const text = document.createElement('div');
  text.style.cssText = 'font:700 clamp(32px,6vw,64px)/1.1 system-ui;text-align:center;min-height:2em;';
  overlay.appendChild(text);
  document.body.appendChild(overlay);
  
  // Disable scroll
  document.documentElement.classList.add('no-scroll');
  
  let i = 0;
  const line1 = C.coldOpen.line1;
  const line2 = C.coldOpen.line2;
  
  // Type line 1
  const typeInterval = setInterval(() => {
    if (i < line1.length) {
      text.textContent = line1.slice(0, i + 1);
      i++;
    } else {
      clearInterval(typeInterval);
      // Delete 70% after pause
      setTimeout(() => {
        const deleteCount = Math.floor(line1.length * 0.7);
        let d = 0;
        const deleteInterval = setInterval(() => {
          if (d < deleteCount) {
            text.textContent = line1.slice(0, line1.length - d - 1);
            d++;
          } else {
            clearInterval(deleteInterval);
            // Type line 2
            setTimeout(() => {
              let j = 0;
              const type2Interval = setInterval(() => {
                if (j < line2.length) {
                  text.textContent = line2.slice(0, j + 1);
                  j++;
                } else {
                  clearInterval(type2Interval);
                  // Fade out and unlock
                  setTimeout(() => {
                    overlay.style.opacity = '0';
                    overlay.style.transition = 'opacity 0.4s ease';
                    setTimeout(() => {
                      overlay.remove();
                      document.documentElement.classList.remove('no-scroll');
                      initEchoCursor(); // Start echo cursor after cold open
                    }, 400);
                  }, 800);
                }
              }, 50);
            }, 100);
          }
        }, 35); // Faster delete
      }, 600);
    }
  }, 80);
}

// ============================================
// 2. ECHO CURSOR (lags by ~140ms)
// ============================================

function initEchoCursor() {
  const echo = document.createElement('div');
  Object.assign(echo.style, {
    position: 'fixed',
    width: '8px',
    height: '8px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,.2)',
    pointerEvents: 'none',
    mixBlendMode: 'screen',
    transform: 'translate(-50%,-50%)',
    zIndex: '9998'
  });
  document.body.appendChild(echo);
  
  let tx = 0, ty = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  
  function loop() {
    cx += (tx - cx) * 0.18; // ~140ms lag
    cy += (ty - cy) * 0.18;
    echo.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(loop);
  }
  loop();
}

// ============================================
// 3. PREDICTIVE HOVER (56px anticipation)
// ============================================

function predictiveHover(el, r = 56) {
  let armed = false;
  const tick = e => {
    const b = el.getBoundingClientRect();
    const inZone = e.clientX > b.left - r && e.clientX < b.right + r && 
                   e.clientY > b.top - r && e.clientY < b.bottom + r;
    if (inZone && !armed) {
      armed = true;
      el.style.transform = 'translateY(-2px) scale(1.01)';
      el.style.transition = 'transform 90ms ease-out';
    }
    if (!inZone && armed) {
      armed = false;
      el.style.transform = 'translateY(0) scale(1)';
    }
  };
  window.addEventListener('mousemove', tick, { passive: true });
}

// ============================================
// 4. CUT-TO-BLACK INTERLUDES
// ============================================

let scrolled = 0, nextCut = window.innerHeight * 2;
const interludes = C.interludes;

function cutToBlack() {
  const o = document.createElement('div');
  o.style.cssText = 'position:fixed;inset:0;background:#000;color:#fff;display:grid;place-items:center;opacity:0;transition:opacity .18s ease;z-index:9999;';
  o.innerHTML = `<div style="font:800 clamp(28px,6vw,80px)/1 system-ui;text-transform:lowercase;">${interludes[Math.floor(Math.random() * interludes.length)]}</div>`;
  document.body.appendChild(o);
  requestAnimationFrame(() => o.style.opacity = 1);
  setTimeout(() => {
    o.style.opacity = 0;
    setTimeout(() => o.remove(), 180);
  }, 520);
}

window.addEventListener('scroll', () => {
  scrolled = window.scrollY;
  if (scrolled > nextCut) {
    nextCut += window.innerHeight * 2;
    cutToBlack();
  }
}, { passive: true });

// ============================================
// 5. WHISPERS (idle, exit, hesitation)
// ============================================

let idle;
let firstIdleWhisper = true;

const whisper = msg => {
  const w = document.createElement('div');
  w.textContent = msg;
  w.style.cssText = 'position:fixed;left:24px;bottom:24px;color:#8A8D91;font-size:14px;opacity:0;transition:opacity .22s ease;z-index:9997;';
  document.body.appendChild(w);
  requestAnimationFrame(() => w.style.opacity = 1);
  setTimeout(() => {
    w.style.opacity = 0;
    setTimeout(() => w.remove(), 220);
  }, 1400);
};

const resetIdle = () => {
  clearTimeout(idle);
  idle = setTimeout(() => {
    if (firstIdleWhisper) {
      playEarnedSound('idle');
      firstIdleWhisper = false;
    }
    whisper(C.whispers.idle);
  }, 5000);
};

['mousemove', 'keydown', 'scroll', 'touchstart'].forEach(e => 
  window.addEventListener(e, resetIdle, { passive: true })
);
resetIdle();

// Exit intent
window.addEventListener('mouseout', e => {
  if (e.relatedTarget === null && e.clientY < 10) whisper(C.whispers.exit);
});

// Hesitation catch (scroll up twice within 2s)
let scrollHistory = [], lastY = window.scrollY;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const direction = y > lastY ? 'down' : 'up';
  scrollHistory.push({ direction, time: Date.now() });
  scrollHistory = scrollHistory.filter(s => Date.now() - s.time < 2000);
  
  const recentUps = scrollHistory.filter(s => s.direction === 'up').length;
  if (recentUps >= 2) {
    whisper(C.whispers.hesitation);
    scrollHistory = []; // Reset
  }
  lastY = y;
}, { passive: true });

// ============================================
// 6. KINETIC TEXT (parallax drift)
// ============================================

function kineticText() {
  const headlines = document.querySelectorAll('.h1, .h2, .line');
  let mouseX = 0, mouseY = 0;
  
  window.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });
  
  function animate() {
    headlines.forEach(el => {
      const dx = mouseX * 1; // ±1px
      const dy = mouseY * 1;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// ============================================
// 7. CLIPBOARD TRICK
// ============================================

document.addEventListener('copy', e => {
  const selection = window.getSelection().toString();
  if (selection.includes(C.heroHeadline)) {
    e.preventDefault();
    e.clipboardData.setData('text/plain', 'presence > prompts — hethar.app');
  }
});

// ============================================
// 8. TIME-AWARE HERO LINE
// ============================================

function setTimeBasedCopy() {
  const slot = document.getElementById('adaptive-line');
  if (slot) {
    const h = new Date().getHours();
    slot.textContent = (h >= 22 || h < 5) ? C.timeBased.night :
                       (h < 12) ? C.timeBased.morning :
                       (h < 18) ? C.timeBased.afternoon :
                       C.timeBased.fallback;
  }
}

// ============================================
// 9. ECHO FEED TICKER
// ============================================

function initEchoFeed() {
  const feed = document.createElement('div');
  feed.style.cssText = 'position:fixed;bottom:0;left:0;right:0;padding:8px 0;background:rgba(10,10,10,0.8);color:#8A8D91;font-size:12px;text-align:center;opacity:0.6;z-index:9996;';
  document.body.appendChild(feed);
  
  let index = 0;
  setInterval(() => {
    feed.textContent = C.echoFeed[index];
    index = (index + 1) % C.echoFeed.length;
  }, 8000);
  
  // Initial
  feed.textContent = C.echoFeed[0];
}

// ============================================
// 10. EARNED SOUND
// ============================================

function playEarnedSound(type) {
  if (sessionStorage.getItem(`sound-${type}`)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    if (type === 'idle') {
      // Air swell
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(220, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.03, audioCtx.currentTime + 0.5);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.0);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 1.0);
    } else if (type === 'choice') {
      // Heartbeat (two beats)
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(80, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 0.4);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.5);
    }
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    sessionStorage.setItem(`sound-${type}`, '1');
  } catch (e) {
    // Silent fail
  }
}

// ============================================
// 11. POPULATE CONTENT
// ============================================

function populateContent() {
  // Hero
  document.getElementById('hero-headline').textContent = C.heroHeadline;
  document.getElementById('hero-sub').textContent = C.heroSub;
  setTimeBasedCopy();
  document.getElementById('hero-cta-primary').textContent = C.hero.primary;
  document.getElementById('hero-cta-secondary').textContent = C.hero.secondary;
  
  // Contrast
  document.getElementById('contrast-head').textContent = C.contrast.head;
  const contrastGrid = document.getElementById('contrast-grid');
  C.contrast.lines.forEach(line => {
    const p = document.createElement('p');
    p.className = 'statement';
    p.textContent = line;
    contrastGrid.appendChild(p);
  });
  document.getElementById('contrast-cta').textContent = C.contrast.cta;
  
  // Different
  document.getElementById('different-head').textContent = C.different.head;
  document.getElementById('different-left').textContent = C.different.left;
  document.getElementById('different-right').textContent = C.different.right;
  document.getElementById('different-kicker').textContent = C.different.kicker;
  
  // Vision
  document.getElementById('vision-head').textContent = C.vision.head;
  const visionLines = document.getElementById('vision-lines');
  C.vision.lines.forEach(line => {
    const div = document.createElement('div');
    div.className = 'vision-line';
    div.textContent = line;
    visionLines.appendChild(div);
  });
  document.getElementById('vision-closer').textContent = C.vision.closer;
  
  // Final
  document.getElementById('final-head').textContent = C.final.head;
  document.getElementById('final-question').textContent = C.final.question;
  document.getElementById('final-cta-primary').textContent = C.final.primary;
  document.getElementById('final-cta-secondary').textContent = C.final.secondary;
  
  // Footer
  document.getElementById('year').textContent = new Date().getFullYear();
}

// ============================================
// 12. GUARDRAILS (a11y)
// ============================================

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  populateContent();
  
  // Kinetic effects (if not reduced motion)
  if (!prefersReduced) {
    kineticText();
  } else {
    document.documentElement.classList.add('reduced-motion');
  }
  
  // Cold open
  coldOpen();
  
  setTimeout(() => {
    // Init predictive hover on all interactive elements
    document.querySelectorAll('a, .btn, button').forEach(el => predictiveHover(el));
    
    // Init echo feed
    initEchoFeed();
  }, 3500); // After cold open completes
});

