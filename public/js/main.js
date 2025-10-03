// Hethar — Alive & Feral Implementation
// "presence as feral intelligence"

const C = window.COPY;

// ============================================
// 1. COLD OPEN (OPERATOR BREACH - Matrix style)
// ============================================

function coldOpen() {
  const overlay = document.createElement('div');
  overlay.id = 'cold-open';
  overlay.style.cssText = 'position:fixed;inset:0;background:#000;color:#fff;display:grid;place-items:center;z-index:10000;overflow:hidden;';
  
  const textContainer = document.createElement('div');
  textContainer.style.cssText = 'position:relative;font:700 clamp(32px,6vw,64px)/1.1 monospace;text-align:center;min-height:2em;';
  
  const text = document.createElement('div');
  text.style.cssText = 'position:relative;z-index:1;';
  textContainer.appendChild(text);
  overlay.appendChild(textContainer);
  document.body.appendChild(overlay);
  
  // Disable scroll
  document.documentElement.classList.add('no-scroll');
  
  const line1 = C.coldOpen.line1;
  const line2 = C.coldOpen.line2;
  
  // Phase 1: Type line 1 (whispered)
  let i = 0;
  const typeInterval = setInterval(() => {
    if (i < line1.length) {
      text.textContent = line1.slice(0, i + 1) + '|'; // Cursor
      i++;
    } else {
      clearInterval(typeInterval);
      // Blink cursor twice
      let blinks = 0;
      const blinkInterval = setInterval(() => {
        text.textContent = line1 + (blinks % 2 === 0 ? '|' : '');
        blinks++;
        if (blinks >= 4) {
          clearInterval(blinkInterval);
          text.textContent = line1;
          
          // Phase 2: OPERATOR BREACH (delete with ghost letters)
          setTimeout(() => operatorBreach(), 800);
        }
      }, 300);
    }
  }, 80);
  
  function operatorBreach() {
    // Delete with Matrix ghost letters
    let d = line1.length;
    const deleteInterval = setInterval(() => {
      if (d > 0) {
        const deletedChar = line1[d - 1];
        
        // Create ghost letter that flickers
        const ghost = document.createElement('span');
        ghost.textContent = deletedChar;
        ghost.style.cssText = `
          position:absolute;
          left:${d * 0.6}em;
          top:0;
          color:#0f0;
          opacity:0.12;
          font-family:monospace;
          animation:ghost-flicker 0.15s ease-out forwards;
          pointer-events:none;
        `;
        textContainer.appendChild(ghost);
        setTimeout(() => ghost.remove(), 150);
        
        text.textContent = line1.slice(0, d - 1);
        d--;
      } else {
        clearInterval(deleteInterval);
        
        // Phase 3: SCANLINE TAKEOVER
        setTimeout(() => scanlineTakeover(), 100);
      }
    }, 40);
  }
  
  function scanlineTakeover() {
    // Play subtle audio click (optional)
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      // Silent fail
    }
    
    // Subtle background shift (no scanline)
    overlay.style.background = 'linear-gradient(180deg, #050505 0%, #000 100%)';
    overlay.style.transition = 'background 0.3s ease';
    
    // Phase 4: RE-TYPE with confidence
    setTimeout(() => retypeCommand(), 200);
  }
  
  function retypeCommand() {
    text.textContent = '';
    let j = 0;
    const type2Interval = setInterval(() => {
      if (j < line2.length) {
        text.textContent = line2.slice(0, j + 1);
        j++;
      } else {
        clearInterval(type2Interval);
        // Hold for 1s (command executed), then transition to operator takeover
        setTimeout(() => {
          overlay.style.opacity = '0';
          overlay.style.transition = 'opacity 0.5s ease';
          setTimeout(() => {
            overlay.remove();
            document.documentElement.classList.remove('no-scroll');
            initEchoCursor();
            // TRIGGER: Operator Takeover on hero line
            operatorTakeover();
          }, 500);
        }, 1000);
      }
    }, 50); // Faster, confident typing
  }
}

// ============================================
// OPERATOR TAKEOVER (Matrix breach)
// ============================================
/**
 * Call this AFTER cold open completes.
 * Requirements:
 *  - <h1 id="hero-headline" class="hero-line">…</h1> exists
 *  - The hero line currently shows existing text (will be replaced)
 */
function operatorTakeover() {
  const line = document.getElementById('hero-headline');
  if (!line) return;

  // Safety: snapshot the current text
  const original = line.textContent.trim();
  if (!original) return; // Don't run if line is empty

  // Layer: ghost echo for the delete moment
  const ghost = document.createElement('div');
  ghost.className = 'operator-ghost';
  ghost.textContent = original;
  line.appendChild(ghost);

  // Layer: precise strike element
  const strike = document.createElement('div');
  strike.className = 'operator-strike';
  line.appendChild(strike);

  // Layer: global scanline
  const scan = document.createElement('div');
  scan.className = 'operator-scanline';
  document.body.appendChild(scan);

  // 0) Brief stillness so it feels intentional
  setTimeout(() => {
    // 1) Slow, deliberate delete with green echo
    slowDeleteWithGhost(line, ghost, original, () => {
      // 2) Kill-stroke across the now-empty line
      strike.style.animation = 'strike .22s var(--ease) forwards';

      // 3) Single scanline sweep + subtle dim
      requestAnimationFrame(() => {
        document.body.classList.add('body-dim');
        scan.style.animation = 'scan .6s var(--ease) forwards';
        // 4) Terminal whisper
        terminalWhisper('[link established] operator: control transferred');
      });

      // 5) Cursor magnet micro-jolt on the line
      line.classList.add('cursor-magnet');

      // 6) Retype with authority
      setTimeout(() => {
        line.classList.remove('cursor-magnet');
        typeCommandClean(line, 'retire the prompt.', 28 /*speed*/, () => {
          // cleanup overlays after finish
          setTimeout(() => {
            strike.remove();
            ghost.remove();
            scan.remove();
            setTimeout(() => document.body.classList.remove('body-dim'), 200);
          }, 200);
        });
      }, 320);
    });
  }, 400);
}

/** Deletes text one char at a time; ghost echoes during the operation */
function slowDeleteWithGhost(lineEl, ghostEl, text, done) {
  let i = text.length;
  const base = document.createTextNode(text);
  lineEl.firstChild && lineEl.removeChild(lineEl.firstChild);
  lineEl.insertBefore(base, ghostEl);

  const tick = () => {
    if (i <= 0) {
      // fully deleted
      base.nodeValue = '';
      ghostEl.style.opacity = '0'; // hide any remainder
      return setTimeout(done, 90);
    }
    // delete one char (slower than typing) + show ghost briefly
    base.nodeValue = text.slice(0, i - 1);
    ghostEl.textContent = text.slice(0, i);
    ghostEl.style.opacity = '0.14';
    ghostEl.style.transform = 'translateY(2px)';
    setTimeout(() => { ghostEl.style.opacity = '0' }, 140);
    i--;
    setTimeout(tick, 42 + Math.random() * 22); // slight humanization
  };
  tick();
}

/** Types the target string with confident cadence (no cursor blink) */
function typeCommandClean(lineEl, target, cps = 30, done) {
  // Clear line content (remove text nodes only, keep layers)
  [...lineEl.childNodes].forEach(n => {
    if (n.nodeType === Node.TEXT_NODE) lineEl.removeChild(n);
  });
  const textNode = document.createTextNode('');
  lineEl.insertBefore(textNode, lineEl.firstChild);

  let i = 0;
  const step = () => {
    if (i > target.length) return done && done();
    textNode.nodeValue = target.slice(0, i++);
    setTimeout(step, Math.max(8, 1000 / cps)); // faster than human, not robotic
  };
  step();
}

/** Bottom-left terminal whisper */
function terminalWhisper(msg) {
  const w = document.createElement('div');
  w.className = 'operator-whisper';
  w.textContent = msg;
  document.body.appendChild(w);
  requestAnimationFrame(() => {
    w.style.opacity = '1';
    w.style.transform = 'translateY(0)';
  });
  setTimeout(() => {
    w.style.opacity = '0';
    w.style.transform = 'translateY(6px)';
    setTimeout(() => w.remove(), 220);
  }, 1600);
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
  o.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;text-align:center;opacity:0;transition:opacity .3s ease;z-index:9999;pointer-events:none;';
  o.innerHTML = `<div style="font:800 clamp(28px,6vw,80px)/1 system-ui;text-transform:lowercase;text-shadow:0 2px 20px rgba(0,0,0,0.8);">${interludes[Math.floor(Math.random() * interludes.length)]}</div>`;
  document.body.appendChild(o);
  requestAnimationFrame(() => o.style.opacity = 1);
  setTimeout(() => {
    o.style.opacity = 0;
    setTimeout(() => o.remove(), 300);
  }, 1800); // Stays for 1.8s (longer)
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

